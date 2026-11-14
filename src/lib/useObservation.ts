import { useEffect, useMemo, useRef, useState } from 'react';
import { useData } from './data';
import { useSelection } from './selection';
import { useRoute } from './router';
import { verifiedCase } from '../story/cases';
import { sampleIndex, sampleKey, seriesStates, stateFor } from './selectors';

export function useObservation() {
  const data = useData(),
    { selection, setSelection } = useSelection(),
    route = useRoute();
  const applied = useRef('');
  const [notice, setNotice] = useState(''),
    [bracket, setBracket] = useState<string | null>(null);
  const r = data.release;
  useEffect(() => {
    if (!r || applied.current === route.search) return;
    applied.current = route.search;
    const id = new URLSearchParams(route.search).get('case');
    if (!id) return;
    const item = verifiedCase(r, id);
    if (!item) {
      setNotice('This case is unavailable in the current release. Showing a supported selection.');
      return;
    }
    const times =
      item.mode === 'coarse'
        ? r.timestamps
        : [...new Set(r.refined_samples.map((row) => row.timestamp_utc))].sort();
    setSelection((previous) => ({
      ...previous,
      a: item.a,
      b: item.b,
      mode: item.mode,
      index: times.indexOf(item.timestamp),
    }));
  }, [r, route.search, setSelection]);
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
  const nextCrossing = () => {
    const event = events.find((e) => e.end_utc > t) ?? events[0];
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
  };
}
