import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { both, type Sample } from '../science';
import { useData } from '../lib/data';
import { useSelection } from '../lib/selection';
import { Link, useRoute } from '../lib/router';
import { date, shortName, signed, time } from '../lib/format';
import { plotLimit, sampleIndex, sampleKey, seriesStates, stateFor } from '../lib/selectors';
import { CASES, verifiedCase } from '../story/cases';
import SkyInstrument from '../components/SkyInstrument';
import HorizonLoom from '../components/HorizonLoom';
import Evidence from '../components/Evidence';
import { Dialog } from '../components/Shell';
import s from './Explore.module.css';

const LunarContext = lazy(() => import('../visuals/LunarContext'));
const ACTS = [
  [
    'The same instant.',
    'Start with a simple question: do two locations see the same Sun and Earth at the same UTC? Both readings below come from the same scientific release.',
  ],
  [
    'Two local perspectives.',
    'A and B use approximate reported landing coordinates. Their observers are hypothetical points on the Horizons reference ellipsoid, not the real spacecraft antennas.',
  ],
  [
    'Change one clock.',
    'Step to the next source-backed moment in this case. Both diagrams and all four readings update together; no positions are interpolated.',
  ],
  [
    'Read what differs.',
    'Compare the signed elevations and the note at the central seam. A negative value means below the geometric tangent plane. The evidence sheet retains the selected run IDs.',
  ],
  [
    'A boundary, not a guarantee.',
    'The geometric plane ignores crater rims and local relief. Above it does not establish usable sunlight, solar power or radio contact. Terrain needs a separate validated model.',
  ],
  [
    'Follow the evidence.',
    'This is a real comparison with an explicit limit. Inspect the exact queries, then choose a different time or site and explore for yourself.',
  ],
];

export default function Explore() {
  const { release: r, status, retry } = useData();
  const { selection, setSelection } = useSelection();
  const route = useRoute();
  const [evidence, setEvidence] = useState(false),
    [difference, setDifference] = useState(false),
    [research, setResearch] = useState<'Cause' | 'Robustness' | null>(null),
    [context, setContext] = useState(false),
    [sitePicker, setSitePicker] = useState(false),
    [guide, setGuide] = useState<number | null>(null),
    [notice, setNotice] = useState(''),
    [bracket, setBracket] = useState<null | {
      start: string;
      end: string;
      site: string;
      body: string;
    }>(null);
  const appliedQuery = useRef('');
  useEffect(() => {
    if (!r) return;
    if (appliedQuery.current === route.search) return;
    appliedQuery.current = route.search;
    const params = new URLSearchParams(route.search);
    const caseId = params.get('case');
    if (!caseId) {
      setGuide(null);
      return;
    }
    const item = verifiedCase(r, caseId);
    if (!item) {
      setNotice(
        'That case is unavailable in this scientific release. Showing the current supported selection.',
      );
      setGuide(null);
      return;
    }
    const clock =
      item.mode === 'coarse'
        ? r.timestamps
        : [...new Set(r.refined_samples.map((row) => row.timestamp_utc))].sort();
    setSelection((previous) => ({
      ...previous,
      a: item.a,
      b: item.b,
      mode: item.mode,
      index: clock.indexOf(item.timestamp),
    }));
    setGuide(params.get('guide') === '1' ? 0 : null);
    setNotice('');
    setBracket(null);
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
  const selected = Math.min(selection.index, Math.max(0, clock.length - 1)),
    t = clock[selected];
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
    [rows, clock, r, selection.a, selection.b],
  );
  if (status === 'error' || (!r && status !== 'loading'))
    return (
      <main id="main" tabIndex={-1} className={s.loadState}>
        <p className="eyebrow">ARCHIVE / UNAVAILABLE</p>
        <h1>Data unavailable.</h1>
        <p>
          The scientific archive could not be loaded or failed release validation. No astronomical
          readings are shown.
        </p>
        <button className="primaryButton" onClick={retry}>
          Retry data loading <span>↗</span>
        </button>
        <Link className="sectionLink" href="/method">
          Read the method ↗
        </Link>
      </main>
    );
  if (!r)
    return (
      <main id="main" tabIndex={-1} className={s.loadState} aria-busy="true">
        <p className="eyebrow">OPENING THE SCIENTIFIC ARCHIVE</p>
        <h1>
          One time.
          <br />
          <em>Two horizons.</em>
        </h1>
        <p>Checking the source release before showing measurements.</p>
        <div className={s.loadingStage} />
      </main>
    );
  const a = r.sites.find((site) => site.id === selection.a) ?? r.sites[0],
    b = r.sites.find((site) => site.id === selection.b) ?? r.sites[1];
  const get = (site: string, body: number) => index.get(sampleKey(site, body, t))!;
  const aRecords = [get(a.id, 10), get(a.id, 399)],
    bRecords = [get(b.id, 10), get(b.id, 399)],
    records = [...aRecords, ...bRecords];
  const aStates = aRecords.map((row) => stateFor(row, r.epsilon_deg)),
    bStates = bRecords.map((row) => stateFor(row, r.epsilon_deg));
  const same = aStates.every((value, i) => value === bStates[i]),
    unknown = [...aStates, ...bStates].includes('unknown');
  const delta = (body: number) => {
    const one = get(a.id, body),
      two = get(b.id, body);
    return stateFor(one, r.epsilon_deg) === 'unknown' || stateFor(two, r.epsilon_deg) === 'unknown'
      ? null
      : two.elevation_deg! - one.elevation_deg!;
  };
  const events = [...(selection.mode === 'coarse' ? r.crossings : r.refined_crossings)]
    .filter((event) => event.site_id === a.id || event.site_id === b.id)
    .sort((one, two) => one.end_utc.localeCompare(two.end_utc));
  const setSample = (value: number) => {
    setSelection((previous) => ({
      ...previous,
      index: Math.max(0, Math.min(clock.length - 1, value)),
    }));
    setBracket(null);
  };
  const mode = (value: 'coarse' | 'refined') => {
    if (value === selection.mode) return;
    const next =
      value === 'coarse'
        ? r.timestamps
        : [...new Set(r.refined_samples.map((row) => row.timestamp_utc))].sort();
    const closest = next.reduce(
      (best, stamp, i) =>
        Math.abs(Date.parse(stamp) - Date.parse(t)) <
        Math.abs(Date.parse(next[best]) - Date.parse(t))
          ? i
          : best,
      0,
    );
    setSelection((previous) => ({ ...previous, mode: value, index: closest }));
    setBracket(null);
    setNotice(
      value === 'refined'
        ? 'Showing the supported 16 November refinement window. The UTC cursor snaps to its nearest available sample.'
        : 'Showing the 35-day hourly scan. The UTC cursor snaps to its nearest available sample.',
    );
  };
  const nextCrossing = () => {
    const event = events.find((event) => event.end_utc > t) ?? events[0];
    if (!event) return;
    setSelection((previous) => ({ ...previous, index: clock.indexOf(event.end_utc) }));
    setBracket({
      start: event.start_utc,
      end: event.end_utc,
      site: r.sites.find((site) => site.id === event.site_id)!.name,
      body: event.body_id === 10 ? 'Sun' : 'Earth',
    });
  };
  const act = (step: number) => {
    setGuide(step);
    const item = verifiedCase(r, new URLSearchParams(route.search).get('case') ?? CASES[0].id);
    if (item) {
      const stamp = step >= 2 ? item.next_timestamp : item.timestamp;
      const caseClock =
        item.mode === 'coarse'
          ? r.timestamps
          : [...new Set(r.refined_samples.map((row) => row.timestamp_utc))].sort();
      setSelection((previous) => ({
        ...previous,
        a: item.a,
        b: item.b,
        mode: item.mode,
        index: caseClock.indexOf(stamp),
      }));
      setBracket(null);
    }
  };
  const endGuide = () => {
    setGuide(null);
    route.navigate('/explore', true);
  };
  const summary = unknown
    ? 'Some observations are unknown.'
    : a.id === b.id
      ? 'Same site. Same sampled sky.'
      : same
        ? 'Same states. Different angles.'
        : 'One moment. Different horizon states.';
  const statesCombined = [both(aStates[0], aStates[1]), both(bStates[0], bStates[1])];
  return (
    <main id="main" tabIndex={-1} className={s.page}>
      <section className={s.pageHead}>
        <div>
          <p className="eyebrow">02 / THE INSTRUMENT</p>
          <h1>
            One time. <em>Two horizons.</em>
          </h1>
        </div>
        <button className={s.modelBadge} onClick={() => setEvidence(true)}>
          <span aria-hidden="true">◌</span>
          <span>
            Geometric · terrain excluded<small>Source-backed / science provisional</small>
          </span>
          <span aria-hidden="true">↗</span>
        </button>
      </section>
      {notice && (
        <div className={s.notice}>
          <p>{notice}</p>
          <button onClick={() => setNotice('')} aria-label="Dismiss notice">
            ×
          </button>
        </div>
      )}
      {guide !== null && (
        <section className={s.guide} aria-label="Guided discovery">
          <div className={s.guideIndex}>ACT {String(guide + 1).padStart(2, '0')} / 06</div>
          <div>
            <h2>{ACTS[guide][0]}</h2>
            <p>{ACTS[guide][1]}</p>
          </div>
          <div className={s.guideActions}>
            {guide > 0 && <button onClick={() => act(guide - 1)}>Back</button>}
            {guide === 3 && (
              <button onClick={() => setEvidence(true)}>Inspect this sample ↗</button>
            )}
            <button
              className={s.guideNext}
              onClick={() => (guide === 5 ? endGuide() : act(guide + 1))}
            >
              {guide === 5 ? 'Explore your own' : 'Next act →'}
            </button>
            <button onClick={endGuide}>Skip guide</button>
          </div>
        </section>
      )}
      <section
        className={`${s.instrument} dark`}
        aria-label="Meridian comparison instrument"
        data-release-id={r.release_id}
      >
        <div className={s.instrumentStrip}>
          <span>MERIDIAN / COMPARISON 01</span>
          <span>
            NASA / JPL HORIZONS <span className={s.dot} /> STATIC SCIENTIFIC RELEASE
          </span>
        </div>
        <div className={s.command}>
          <label className={s.siteControl}>
            <span>OBSERVATION SITE A</span>
            <select
              value={a.id}
              aria-label="Observation site A"
              onChange={(event) => {
                setSelection((previous) => ({ ...previous, a: event.target.value }));
                setBracket(null);
              }}
            >
              {r.sites.map((site) => (
                <option value={site.id} key={site.id}>
                  {site.name}
                </option>
              ))}
            </select>
          </label>
          <div className={s.sharedUtc}>
            <span>ONE SHARED UTC SAMPLE</span>
            <strong data-testid="selected-utc">
              {date(t)} <em>{time(t)}</em>
            </strong>
            <span>
              {selected + 1} / {clock.length} · {selection.mode === 'coarse' ? '60' : '10'}-minute
              sampling
            </span>
          </div>
          <label className={s.siteControl}>
            <span>OBSERVATION SITE B</span>
            <select
              value={b.id}
              aria-label="Observation site B"
              onChange={(event) => {
                setSelection((previous) => ({ ...previous, b: event.target.value }));
                setBracket(null);
              }}
            >
              {r.sites.map((site) => (
                <option value={site.id} key={site.id}>
                  {site.name}
                </option>
              ))}
            </select>
          </label>
          <button
            className={s.swap}
            onClick={() => {
              setSelection((previous) => ({ ...previous, a: previous.b, b: previous.a }));
              setBracket(null);
            }}
            aria-label="Swap A and B"
          >
            <span aria-hidden="true" className={s.swapIcon}>
              ⇄
            </span>
            <span>Swap</span>
          </button>
          <button className={s.mobileSites} onClick={() => setSitePicker(true)}>
            Sites <span aria-hidden="true">↗</span>
          </button>
        </div>
        <div className={s.timeRail}>
          <button
            className={s.step}
            aria-label="Previous sample"
            disabled={selected === 0}
            onClick={() => setSample(selected - 1)}
          >
            ←
          </button>
          <label className={s.slider}>
            <span className="srOnly">UTC sample</span>
            <input
              aria-label="UTC sample"
              type="range"
              min="0"
              max={clock.length - 1}
              step="1"
              value={selected}
              aria-valuetext={`${date(t)} ${time(t)} UTC`}
              onChange={(event) => setSample(Number(event.target.value))}
            />
            <span>
              <span>
                {date(clock[0])}
                {selection.mode === 'refined' ? ` ${time(clock[0])}` : ''}
              </span>
              <span>
                {date(clock.at(-1)!)}
                {selection.mode === 'refined' ? ` ${time(clock.at(-1)!)}` : ''}
              </span>
            </span>
          </label>
          <button
            className={s.step}
            aria-label="Next sample"
            disabled={selected === clock.length - 1}
            onClick={() => setSample(selected + 1)}
          >
            →
          </button>
          <button
            className={s.crossingButton}
            disabled={!events.length}
            onClick={nextCrossing}
            aria-label={events.length ? 'Next crossing' : 'No crossings'}
          >
            {events.length ? 'Next crossing ↗' : 'No crossings'}
          </button>
        </div>
        {bracket && (
          <p className={s.bracket} role="status">
            {bracket.body} at {bracket.site}: crossing bracket{' '}
            <strong>
              {date(bracket.start)} {time(bracket.start)}–{time(bracket.end)} UTC
            </strong>
            . Exact crossing time is unresolved.
          </p>
        )}
        <div className={s.mobileSwitch} aria-label="Displayed viewpoint">
          <button
            aria-pressed={selection.mobile === 'A'}
            onClick={() => setSelection((previous) => ({ ...previous, mobile: 'A' }))}
          >
            A / {shortName(a.name)}
          </button>
          <button
            aria-pressed={selection.mobile === 'B'}
            onClick={() => setSelection((previous) => ({ ...previous, mobile: 'B' }))}
          >
            B / {shortName(b.name)}
          </button>
        </div>
        <div className={s.skyStage}>
          <SkyInstrument
            site={a}
            records={aRecords}
            slot="A"
            limit={plotLimit(r)}
            epsilon={r.epsilon_deg}
            active={selection.mobile === 'A'}
          />
          <div className={s.meridianSeam}>
            <span>ONE CLOCK</span>
            <i />
            <button
              onClick={() => setDifference(true)}
              aria-label="Inspect the meridian difference"
            >
              {same ? '=' : '≠'}
            </button>
            <i />
            <span>TWO VIEWS</span>
          </div>
          <SkyInstrument
            site={b}
            records={bRecords}
            slot="B"
            limit={plotLimit(r)}
            epsilon={r.epsilon_deg}
            active={selection.mobile === 'B'}
          />
        </div>
        <div className={s.comparison} data-testid="comparison-summary" role="status">
          <div>
            <span className={s.comparisonSign} aria-hidden="true">
              {same ? '=' : '≠'}
            </span>
            <div>
              <strong>{summary}</strong>
              <p>
                {a.id === b.id
                  ? 'Both viewpoints use the same site and shared sample.'
                  : unknown
                    ? 'A comparison cannot resolve unavailable source readings.'
                    : same
                      ? 'Both sites share the same above/below classifications at this UTC.'
                      : 'At least one body has a different tangent-plane classification at A and B.'}
              </p>
            </div>
          </div>
          <button onClick={() => setDifference(true)}>
            Read the difference <span>↗</span>
          </button>
        </div>
        <HorizonLoom
          tracks={tracks}
          selected={selected}
          onSelect={setSample}
          clock={clock}
          mode={selection.mode}
          onMode={mode}
          refinedAvailable={r.refined_samples.length > 0}
          onEvidence={() => setEvidence(true)}
        />
        <div className={s.stageFoot}>
          <span>HYPOTHETICAL OBSERVERS / 0 KM REFERENCE-ELLIPSOID HEIGHT</span>
          <span>GEOMETRIC CENTRE-OF-DISC MODEL / TERRAIN EXCLUDED</span>
        </div>
      </section>
      <section className={s.belowStage}>
        <div>
          <p className="eyebrow">LOOK CLOSER</p>
          <h2>
            The horizon
            <br />
            <em>is a condition.</em>
          </h2>
        </div>
        <div>
          <p>
            These are two local perspectives on the same moment. Change the clock, swap the
            observers, or follow a real case. Every displayed angle comes from the released source
            records.
          </p>
          <Link href="/explore?case=two-skies-one-instant&guide=1" className="sectionLink">
            Begin guided discovery <span>↗</span>
          </Link>
        </div>
        <div className={s.investigate}>
          <p className="eyebrow">INVESTIGATE</p>
          <button onClick={() => setEvidence(true)}>
            Evidence & method <span>↗</span>
          </button>
          <button onClick={() => setContext(true)}>
            Locate the observers in 3D <span>↗</span>
          </button>
          <button onClick={() => setResearch('Cause')}>
            Cause study <small>Research-gated</small>
            <span>↗</span>
          </button>
          <button onClick={() => setResearch('Robustness')}>
            Robustness <small>Research-gated</small>
            <span>↗</span>
          </button>
        </div>
      </section>
      {events.length === 0 && (
        <p className={s.noEvent}>
          No crossing brackets were detected in this window for the selected sites. The current
          geometric readings remain available.
        </p>
      )}
      {evidence && <Evidence release={r} records={records} onClose={() => setEvidence(false)} />}
      {difference && (
        <Dialog title="Meridian difference" onClose={() => setDifference(false)}>
          <p className="eyebrow">A / ONE INSTANT / B</p>
          <h2 className={s.dialogTitle}>{summary}</h2>
          <p>
            At {date(t)} {time(t)} UTC, both sites use the same {r.model} release. The quantities
            below are elevation at B minus elevation at A.
          </p>
          <dl className={s.deltaList}>
            {[10, 399].map((body) => (
              <div key={body}>
                <dt>{body === 10 ? 'Sun' : 'Earth'} · Δ elevation B − A</dt>
                <dd>{signed(delta(body))}</dd>
              </div>
            ))}
          </dl>
          <p>
            Combined above-plane state (Sun AND Earth): A = {statesCombined[0]}, B ={' '}
            {statesCombined[1]}. This is a sampled geometric classification, not a terrain, power or
            communications finding.
          </p>
          <button
            className="primaryButton"
            onClick={() => {
              setDifference(false);
              setEvidence(true);
            }}
          >
            Inspect exact source records ↗
          </button>
        </Dialog>
      )}
      {research && (
        <Dialog title={`${research} research module`} onClose={() => setResearch(null)}>
          <p className="eyebrow">RESEARCH / VALIDATION REQUIRED</p>
          <h2 className={s.dialogTitle}>
            {research === 'Cause' ? 'A ridge needs proof.' : 'Sensitivity needs a real model.'}
          </h2>
          <p>
            {research === 'Cause'
              ? 'Cause study is not yet available. The current view models only the geometric tangent plane. A terrain result needs a source-backed DEM, aligned lunar frame, actual observer height, near and far horizon coverage, and independently checked sightlines.'
              : 'Robustness is not yet available. Height or terrain-realization controls require genuine recomputed runs, named scenarios and validated uncertainty semantics. No probability or hypothetical result is estimated here.'}
          </p>
          <Link className="sectionLink" href="/method#limits" onClick={() => setResearch(null)}>
            Read the scientific gates ↗
          </Link>
        </Dialog>
      )}
      {context && (
        <Dialog title="Lunar context" wide onClose={() => setContext(false)}>
          <Suspense fallback={<p>Opening optional lunar context…</p>}>
            <LunarContext sites={[a, b]} />
          </Suspense>
        </Dialog>
      )}
      {sitePicker && (
        <Dialog title="Choose observers" onClose={() => setSitePicker(false)}>
          <p className="eyebrow">A / TWO DOCUMENTED PLACES / B</p>
          <h2 className={s.dialogTitle}>
            Choose your
            <br />
            <em>local perspectives.</em>
          </h2>
          <p>
            Both observers are hypothetical, at the source coordinates and zero reference-ellipsoid
            height. Selecting the same site is supported and produces an honest equality.
          </p>
          {(['A', 'B'] as const).map((slot) => (
            <label className={s.modalSite} key={slot}>
              <span>Observation site {slot}</span>
              <select
                aria-label={`Observation site ${slot}`}
                value={slot === 'A' ? a.id : b.id}
                onChange={(event) => {
                  setSelection((previous) => ({
                    ...previous,
                    [slot === 'A' ? 'a' : 'b']: event.target.value,
                  }));
                  setBracket(null);
                }}
              >
                {r.sites.map((site) => (
                  <option value={site.id} key={site.id}>
                    {site.name}
                  </option>
                ))}
              </select>
            </label>
          ))}
          <button className="primaryButton" onClick={() => setSitePicker(false)}>
            Compare these observers ↗
          </button>
        </Dialog>
      )}
    </main>
  );
}
