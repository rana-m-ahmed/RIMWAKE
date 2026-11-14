import { useEffect, useMemo, useRef, useState } from 'react';
import { useData } from './data';
import { useSelection } from './selection';
import { useRoute } from './router';
import { clockFor, observationURL, parseObservation } from './observations';
import { verifiedCase } from '../story/cases';
import { sampleIndex, sampleKey, seriesStates, stateFor } from './selectors';

export function useObservation() {
  const data = useData(),
    { selection, setSelection } = useSelection(),
    route = useRoute();
  const applied = useRef<string | null>(null),
    pending = useRef<string | null>(null);
  const key = (s: typeof selection) => [s.a, s.b, s.mode, s.index, s.view].join('/');
  const [notice, setNotice] = useState(''),
    [bracket, setBracket] = useState<string | null>(null);
  const r = data.release;
  useEffect(() => {
    if (!r || applied.current === route.search) return;
    applied.current = route.search;
    const query = new URLSearchParams(route.search),
      parsed = parseObservation(r, query);
    let next = parsed.selection;
    if (parsed.error) setNotice(parsed.error);
    if (!parsed.explicit && query.has('case')) {
      const item = verifiedCase(r, query.get('case')!);
      if (item)
        next = {
          a: item.a,
          b: item.b,
          mode: item.mode,
          index: clockFor(r, item.mode).indexOf(item.timestamp),
        };
      else
        setNotice(
          'This case is unavailable in the current release. Showing a supported selection.',
        );
    }
    if (next) {
      const value = { ...selection, ...next };
      pending.current = key(value);
      setSelection((previous) => (key(previous) === key(value) ? previous : value));
      setBracket(null);
    }
  }, [r, route.search, setSelection]);
  useEffect(() => {
    if (!r || applied.current !== route.search) return;
    if (pending.current && pending.current !== key(selection)) return;
    pending.current = null;
    const query = new URLSearchParams(route.search),
      url = new URL(observationURL(r, selection), location.origin);
    for (const field of ['case', 'guide'])
      if (query.has(field)) url.searchParams.set(field, query.get(field)!);
    if (url.search !== route.search) {
      const timer = setTimeout(() => {
        applied.current = url.search;
        route.navigate(url.pathname + url.search, true);
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [r, selection, route.search]);
  const flushURL = () => {
    if (!r) return;
    const query = new URLSearchParams(route.search),
      url = new URL(observationURL(r, selection), location.origin);
    for (const field of ['case', 'guide'])
      if (query.has(field)) url.searchParams.set(field, query.get(field)!);
    if (url.search !== route.search) {
      applied.current = url.search;
      route.navigate(url.pathname + url.search, true);
    }
  };
  const openCase = (id: string, guide = true) =>
    route.navigate(
      '/explore?' + new URLSearchParams({ case: id, ...(guide ? { guide: '1' } : {}) }),
    );
  const rows = useMemo(
    () => (r ? (selection.mode === 'coarse' ? r.samples : r.refined_samples) : []),
    [r, selection.mode],
  );
  const clock = useMemo(
    () =>
      r
        ? selection.mode === 'coarse'
          ? r.timestamps
          : [...new Set(r.refined_samples.map((row) => row.timestamp_utc))].sort()
        : [],
    [r, selection.mode],
  );
  const index = useMemo(() => sampleIndex(rows), [rows]);
  const selected = Math.max(0, Math.min(selection.index, clock.length - 1)),
    t = clock[selected];
  const a = r?.sites.find((site) => site.id === selection.a),
    b = r?.sites.find((site) => site.id === selection.b);
  const records = useMemo(
    () =>
      a && b && t
        ? [a, b].map((site) => [10, 399].map((body) => index.get(sampleKey(site.id, body, t))!))
        : [],
    [a, b, index, t],
  );
  const tracks = useMemo(
    () =>
      r
        ? (['A', 'B'] as const).flatMap((slot) =>
            (['sun', 'earth', 'both'] as const).map((kind) => ({
              slot,
              kind,
              states: seriesStates(
                rows,
                slot === 'A' ? selection.a : selection.b,
                kind === 'sun' ? 10 : kind === 'earth' ? 399 : 'both',
                clock,
                r.epsilon_deg,
              ),
            })),
          )
        : [],
    [r, rows, clock, selection.a, selection.b],
  );
  const events = useMemo(
    () =>
      r
        ? [...(selection.mode === 'coarse' ? r.crossings : r.refined_crossings)]
            .filter((e) => e.site_id === selection.a || e.site_id === selection.b)
            .sort((a, b) => a.end_utc.localeCompare(b.end_utc))
        : [],
    [r, selection.mode, selection.a, selection.b],
  );
  const sample = (n: number) => {
    setSelection((previous) => ({
      ...previous,
      index: Math.max(0, Math.min(clock.length - 1, n)),
    }));
    setBracket(null);
  };
  const changeMode = (mode: 'coarse' | 'refined') => {
    if (!r || mode === selection.mode) return;
    const next =
      mode === 'coarse'
        ? r.timestamps
        : [...new Set(r.refined_samples.map((row) => row.timestamp_utc))].sort();
    const nearest = next.reduce(
      (best, stamp, i) =>
        Math.abs(Date.parse(stamp) - Date.parse(t)) <
        Math.abs(Date.parse(next[best]) - Date.parse(t))
          ? i
          : best,
      0,
    );
    setSelection((previous) => ({ ...previous, mode, index: nearest }));
    setBracket(null);
    setNotice(
      mode === 'refined'
        ? 'Showing the supported 16 November, 03:00–04:00 UTC refinement window.'
        : 'Showing the 14 November–19 December hourly scan.',
    );
  };
  useEffect(() => setBracket(null), [selection.a, selection.b, selection.mode]);
  const nextCrossing = () => {
    const upcoming = events.find((e) => e.end_utc > t);
    const event = upcoming ?? events[0];
    if (!upcoming && event)
      setNotice('Reached the end of this window. Wrapped to the first released crossing bracket.');
    if (!event) return;
    setSelection((previous) => ({ ...previous, index: clock.indexOf(event.end_utc) }));
    setBracket(`${event.start_utc} / ${event.end_utc}`);
  };
  const states = records.map((group) => group.map((row) => stateFor(row, r!.epsilon_deg)));
  const same = states.length === 2 && states[0].every((s, i) => s === states[1][i]);
  const unknown = states.flat().includes('unknown');
  return {
    ...data,
    r,
    selection,
    setSelection,
    a,
    b,
    rows,
    clock,
    selected,
    t,
    records,
    tracks,
    events,
    sample,
    changeMode,
    nextCrossing,
    bracket,
    notice,
    setNotice,
    same,
    unknown,
    states,
    openCase,
    flushURL,
  };
}
