import { useMemo, useState } from 'react';
import type { useObservation } from '../lib/useObservation';
import { useRoute } from '../lib/router';
import {
  clockFor,
  findMoments,
  observationCSV,
  observationText,
  observationURL,
  type Condition,
} from '../lib/observations';
import { date, time, signed } from '../lib/format';
import { verifiedCase, CASES } from '../story/cases';
import { Dialog } from './Shell';
import s from './Discovery.module.css';
type Observation = ReturnType<typeof useObservation>;
export function ObservationFinder({
  o,
  onClose,
  onPlaces,
}: {
  o: Observation;
  onClose: () => void;
  onPlaces: () => void;
}) {
  const [condition, setCondition] = useState<Condition | 'crossing'>('different'),
    [slot, setSlot] = useState<'A' | 'B'>('A'),
    [limit, setLimit] = useState(6);
  const result = useMemo(
    () =>
      findMoments(
        o.r!,
        o.selection.a,
        o.selection.b,
        o.selection.mode,
        condition === 'crossing' ? 'different' : condition,
        slot,
      ),
    [o.r, o.selection.a, o.selection.b, o.selection.mode, condition, slot],
  );
  const next = () => {
    const start = result.runs.find((run) => run.start > o.selected)?.start ?? result.runs[0]?.start;
    if (start !== undefined) {
      o.sample(start);
      if (start <= o.selected) o.setNotice('Wrapped to the first supported match.');
    }
  };
  return (
    <section className={s.panel} aria-label="Find a moment">
      <header className={s.panelTop}>
        <h2>FIND A MOMENT.</h2>
        <button onClick={onClose}>Close finder</button>
      </header>
      <p>Find a supported time that answers your question, then inspect the two skies.</p>
      <p className={s.resultCount}>
        Searching {date(o.clock[0])} {time(o.clock[0])} to {date(o.clock.at(-1)!)}{' '}
        {time(o.clock.at(-1)!)} UTC.
      </p>
      <div className={s.filters}>
        <label>
          Condition
          <select
            aria-label="Observation condition"
            value={condition}
            onChange={(e) => {
              setCondition(e.target.value as Condition);
              setLimit(6);
            }}
          >
            <option value="different">A and B have different views</option>
            <option value="joint">Sun & Earth above</option>
            <option value="sun-only">Sun above, Earth below</option>
            <option value="earth-only">Earth above, Sun below</option>
            <option value="crossing">Crossing brackets</option>
          </select>
        </label>
        {condition !== 'different' && condition !== 'crossing' && (
          <label>
            At viewpoint
            <select
              aria-label="Finder viewpoint"
              value={slot}
              onChange={(e) => {
                setSlot(e.target.value as 'A' | 'B');
                setLimit(6);
              }}
            >
              <option value="A">A / {o.a!.name}</option>
              <option value="B">B / {o.b!.name}</option>
            </select>
          </label>
        )}{' '}
      </div>
      {condition === 'crossing' ? (
        <>
          <p className={s.resultCount}>
            {o.events.length} released crossing brackets. Exact crossing times are unresolved.
          </p>
          <div className={s.results}>
            {o.events.slice(0, limit).map((event, i) => (
              <button
                aria-current={o.t === event.end_utc ? 'true' : undefined}
                key={event.site_id + event.body_id + event.end_utc}
                onClick={() => {
                  o.sample(o.clock.indexOf(event.end_utc));
                  o.setNotice(
                    `Crossing bracket: ${event.start_utc} to ${event.end_utc}. Exact crossing time is unresolved.`,
                  );
                }}
              >
                <span>
                  {o.r!.sites.find((site) => site.id === event.site_id)!.name} /{' '}
                  {event.body_id === 10 ? 'Sun' : 'Earth'}
                  <small>
                    {date(event.start_utc)} {time(event.start_utc)} &ndash; {date(event.end_utc)}{' '}
                    {time(event.end_utc)} UTC
                  </small>
                </span>
                <span aria-hidden="true">{String.fromCharCode(8599)}</span>
              </button>
            ))}
          </div>
          {!o.events.length && <p>No crossing brackets in this supported window.</p>}
        </>
      ) : (
        <>
          <p className={s.resultCount} role="status">
            {result.count} matching times in {result.runs.length} groups. {result.unknown} times
            unavailable.
          </p>
          <div className={s.results}>
            {result.runs.slice(0, limit).map((run) => (
              <button
                aria-current={o.selected >= run.start && o.selected <= run.end ? 'true' : undefined}
                key={run.start}
                onClick={() => o.sample(run.start)}
              >
                <span>
                  {date(o.clock[run.start])} {time(o.clock[run.start])}
                  <small>
                    Through {date(o.clock[run.end])} {time(o.clock[run.end])} UTC &middot;{' '}
                    {run.count} sample{run.count === 1 ? '' : 's'}
                  </small>
                </span>
                <span aria-hidden="true">{String.fromCharCode(8599)}</span>
              </button>
            ))}
          </div>
          {!result.runs.length ? (
            <p className={s.empty}>
              No supported matches in this window. Try a different condition or time window.
            </p>
          ) : (
            <div className={s.caseButtons}>
              <button onClick={next}>Next matching run</button>
              {result.runs.length > limit && (
                <button onClick={() => setLimit(limit + 6)}>Show more results</button>
              )}
            </div>
          )}
        </>
      )}
      {!result.runs.length && condition === 'different' && o.a!.id === o.b!.id && (
        <p>
          Both views use the same place.{' '}
          <button onClick={onPlaces}>Choose two different places</button>
        </p>
      )}
      {(condition === 'crossing' ? !o.events.length : !result.runs.length) &&
        o.selection.mode === 'refined' && (
          <div className={s.caseButtons}>
            <button onClick={() => o.changeMode('coarse')}>Search the full hourly window</button>
          </div>
        )}
      <div className={s.selectionReceipt}>
        <span>
          Selected: {date(o.t)} {time(o.t)} UTC
        </span>
        <button
          onClick={() => {
            const workspace = document.getElementById('sky-workspace');
            workspace?.focus({ preventScroll: true });
            workspace?.scrollIntoView({
              behavior: matchMedia('(prefers-reduced-motion:reduce)').matches
                ? 'instant'
                : 'smooth',
            });
          }}
        >
          View selected skies <span aria-hidden="true">&darr;</span>
        </button>
      </div>
      <p>
        Cadence: {o.selection.mode === 'coarse' ? 'one hour' : 'ten minutes'}. A group joins
        consecutive matching samples. Endpoint spans do not establish uninterrupted availability
        between samples.
      </p>
    </section>
  );
}
const STEPS = [
  'The question',
  'The places',
  'One shared moment',
  'Read the difference',
  'Move the clock',
  'Inspect the evidence',
  'Why it matters',
];
export function GuidedDiscovery({
  o,
  onEvidence,
  onPlaces,
  onFind,
  onShare,
}: {
  o: Observation;
  onEvidence: () => void;
  onPlaces: () => void;
  onFind: () => void;
  onShare: () => void;
}) {
  const route = useRoute(),
    query = new URLSearchParams(route.search),
    active = query.get('guide') === '1',
    id = query.get('case') ?? CASES[0].id;
  const item = verifiedCase(o.r!, id),
    [step, setStep] = useState(0);
  const [previous, setPrevious] = useState(id);
  if (previous !== id) {
    setPrevious(id);
    setStep(0);
  }
  const close = () => {
    query.delete('guide');
    route.navigate('/explore?' + query.toString(), true);
  };
  const apply = (n: number) => {
    if (!item) return;
    const t = n >= 4 ? item.next_timestamp : item.timestamp;
    o.setSelection((p) => ({
      ...p,
      a: item.a,
      b: item.b,
      mode: item.mode,
      index: clockFor(o.r!, item.mode).indexOf(t),
    }));
    setStep(n);
  };
  if (!active || !item)
    return (
      <div className={s.bar} aria-label="Observation tools">
        <button onClick={() => o.openCase(CASES[0].id)}>
          Guided discovery <span aria-hidden="true">{String.fromCharCode(8599)}</span>
        </button>
        <button className={s.secondaryCase} onClick={() => o.openCase(CASES[1].id)}>
          Follow a crossing <span aria-hidden="true">{String.fromCharCode(8599)}</span>
        </button>
        <button onClick={onFind}>Find a moment</button>
        <button onClick={onShare}>Share &amp; export</button>
      </div>
    );
  const expected = step >= 4 ? item.next_timestamp : item.timestamp,
    matches =
      o.selection.a === item.a &&
      o.selection.b === item.b &&
      o.selection.mode === item.mode &&
      o.t === expected;
  const bodyNames = ['Sun', 'Earth'];
  const interpretations = o.states
    .map(
      (states, i) =>
        `${i === 0 ? 'A' : 'B'}: ${states.map((state, j) => `${bodyNames[j]} ${state === 'visible' ? 'above' : state === 'blocked' ? 'below' : state === 'boundary' ? 'at the numerical boundary' : 'unknown'}`).join(', ')}.`,
    )
    .join(' ');
  const text = [
    `Can two places on the same Moon have different views at one moment? Follow a released observation, then inspect the evidence yourself.`,
    `Odysseus and Athena supply two documented lunar locations. We use their approximate published coordinates as modeled viewpoints, not measurements from the landers.`,
    `Both viewpoints now use ${date(o.t)} ${time(o.t)} UTC. The figures are actual supported records, without interpolation.`,
    interpretations,
    item.id === 'sunrise-im1'
      ? `The clock has moved to ${time(o.t)} UTC. Compare the Sun at A before and after this step. A sign change brackets a threshold; it does not resolve the crossing instant.`
      : `The clock has moved to ${time(o.t)} UTC. The same two observers now have new measured directions. Compare the updated classifications.`,
    `Open the evidence to inspect the selected records, JPL requests and hashes. Source integrity and independent astronomical validation are different checks.`,
    `The interface makes the geometric question easier to investigate. Terrain, usable solar power and working radio links need additional models and validation.`,
  ];
  return (
    <section className={s.guide} aria-label="Guided Discovery">
      <header className={s.guideHeader}>
        <span>
          INVESTIGATION {id === CASES[0].id ? '01' : '02'} / {step + 1} OF 7
        </span>
        <button onClick={close}>Exit discovery</button>
      </header>
      <label className={s.caseChoice}>
        <span>Investigation</span>
        <select
          aria-label="Investigation"
          value={id}
          onChange={(event) => o.openCase(event.target.value)}
        >
          {CASES.filter((item) => verifiedCase(o.r!, item.id)).map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </select>
      </label>
      <h2>{matches ? STEPS[step] : 'Your view has changed.'}</h2>
      <p>
        {matches
          ? text[step]
          : 'You are exploring another supported observation. Resume this step to return to the investigation, or exit and continue freely.'}
      </p>
      {matches && (step === 3 || step === 4) && (
        <p className={s.guideReadings}>
          <span>
            A / SUN <strong className="sun">{signed(o.records[0][0].elevation_deg)}</strong>
          </span>
          <span>
            B / SUN <strong className="sun">{signed(o.records[1][0].elevation_deg)}</strong>
          </span>
        </p>
      )}
      <div className={s.guideControls}>
        {!matches ? (
          <button onClick={() => apply(step)}>Resume this step</button>
        ) : (
          <>
            {step > 0 && <button onClick={() => apply(step - 1)}>Back</button>}
            {step === 1 && <button onClick={onPlaces}>Locate the observers</button>}
            {step === 5 && <button onClick={onEvidence}>Inspect this evidence</button>}
            <button onClick={() => (step < 6 ? apply(step + 1) : close())}>
              {step < 6 ? 'Next' : 'Continue exploring'}
            </button>
          </>
        )}
      </div>
    </section>
  );
}
export function ObservationExport({ o, onClose }: { o: Observation; onClose: () => void }) {
  const [copied, setCopied] = useState(''),
    [manual, setManual] = useState('');
  const r = o.r!,
    rows = o.records.flat(),
    url = new URL(observationURL(r, o.selection), location.origin).href;
  const copy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setManual('');
    } catch {
      setManual(value);
    }
  };
  const download = (kind: 'csv' | 'txt') => {
    const value =
        kind === 'csv'
          ? observationCSV(r, rows, o.selection.mode)
          : observationText(r, rows, o.selection.mode),
      blob = new Blob([value], {
        type: kind === 'csv' ? 'text/csv;charset=utf-8' : 'text/plain;charset=utf-8',
      }),
      href = URL.createObjectURL(blob),
      a = document.createElement('a');
    a.href = href;
    a.download = `rimwake-${o.t.replaceAll(':', '')}.${kind}`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(href), 1000);
  };
  return (
    <Dialog title="Share this observation" onClose={onClose}>
      <h2 style={{ font: '600 44px/1 var(--font-display)' }}>
        THE SAME MOMENT.
        <br />
        EVERYWHERE.
      </h2>
      <p>
        Reopen the exact released sites, sampling window, UTC and view. The link works when this
        application is served from the same address.
      </p>
      <p>
        <strong>
          {date(o.t)} / {time(o.t)} UTC
        </strong>
      </p>
      <div className={s.exportActions}>
        <button onClick={() => copy(url, 'Observation link copied')}>Copy observation link</button>
        <button
          onClick={() =>
            copy(observationText(r, rows, o.selection.mode), 'Scientific summary copied')
          }
        >
          Copy scientific summary
        </button>
        <button onClick={() => download('csv')}>Download CSV</button>
        <button onClick={() => download('txt')}>Download text summary</button>
      </div>
      {copied && <p role="status">{copied}</p>}
      {manual && (
        <label className={s.manual}>
          Copy manually
          <textarea value={manual} readOnly onFocus={(e) => e.target.select()} />
        </label>
      )}
      <p>
        Exports include the source trail and model limits. This geometric comparison does not
        establish available power or a communication link.
      </p>
    </Dialog>
  );
}
