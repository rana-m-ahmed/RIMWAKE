import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Link } from '../lib/router';
import { Dialog } from '../components/Shell';
import SceneGuard from '../cinema/SceneGuard';
import { useMedia, useWebGLCapability } from '../cinema/preferences';
import { useAtlas } from './useAtlas';
import {
  addHours,
  angle,
  classify,
  comparisonURL,
  DEFAULT,
  pct,
  requestError,
  stateWords,
  utcLabel,
  type Analysis,
  type Index,
  type Metric,
  type Request,
  type Site,
  type Summary,
} from './model';
import Horizon from './Horizon';
import MissionLoading from './Loading';
import photos from '../../public/assets/atlas-sites/provenance.json';
import Timeline from './Timeline';
import s from './Mission.module.css';
const Scene = lazy(() => import('./AtlasScene'));
const fallbackSites = [
  { id: 'im1', name: 'Odysseus' },
  { id: 'im2', name: 'Athena' },
];
function FlatMap({
  sites,
  a,
  b,
  onChoose,
}: {
  sites: Site[];
  a: string;
  b: string;
  onChoose: (id: string) => void;
}) {
  return (
    <svg
      className={s.flatMap}
      viewBox="0 0 720 380"
      role="img"
      aria-label="Lunar longitude and latitude map. Use the site list to choose viewpoints."
    >
      <rect x="35" y="35" width="650" height="300" fill="#141f28" stroke="#53636d" />
      {[-60, -30, 0, 30, 60].map((lat) => (
        <g key={lat}>
          <line
            x1="35"
            x2="685"
            y1={185 - (lat * 300) / 180}
            y2={185 - (lat * 300) / 180}
            stroke="#3c4a54"
          />
          <text x="28" y={190 - (lat * 300) / 180} fill="#b8c4cc" fontSize="12" textAnchor="end">
            {lat}
          </text>
        </g>
      ))}
      {[-180, -90, 0, 90, 180].map((lon) => (
        <g key={lon}>
          <line
            x1={360 + (lon * 650) / 360}
            x2={360 + (lon * 650) / 360}
            y1="35"
            y2="335"
            stroke="#3c4a54"
          />
          <text
            x={360 + (lon * 650) / 360}
            y="359"
            fill="#b8c4cc"
            fontSize="12"
            textAnchor="middle"
          >
            {lon} E
          </text>
        </g>
      ))}
      {sites.map((site) => {
        const lon =
            site.longitude_deg_east > 180 ? site.longitude_deg_east - 360 : site.longitude_deg_east,
          x = 360 + (lon * 650) / 360,
          y = 185 - (site.latitude_deg * 300) / 180;
        return (
          <g key={site.id} onClick={() => onChoose(site.id)} style={{ cursor: 'pointer' }}>
            <circle cx={x} cy={y} r="12" fill="#d3be94" fillOpacity=".2" />
            <circle cx={x} cy={y} r="4" fill="#e6dfcf" />
            <text x={x + 12} y={y - 10} fontSize="13" fill="#edf0e9">
              {site.id === a ? 'A / ' : site.id === b ? 'B / ' : ''}
              {site.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
function WindowControls({
  r,
  index,
  patch,
}: {
  r: Request;
  index: Index;
  patch: (c: Partial<Request>) => void;
}) {
  const [start, setStart] = useState(r.start.slice(0, 16)),
    [hours, setHours] = useState(r.hours),
    [delay, setDelay] = useState(r.delay),
    [error, setError] = useState(''),
    [expanded, setExpanded] = useState(false);
  useEffect(() => {
    setStart(r.start.slice(0, 16));
    setHours(r.hours);
    setDelay(r.delay);
    setError('');
  }, [r.start, r.hours, r.delay]);
  const apply = (event: React.FormEvent) => {
    event.preventDefault();
    const ms = Date.parse(start + 'Z');
    if (!Number.isFinite(ms)) {
      setError('Enter a UTC date and time.');
      return;
    }
    const next = {
      ...r,
      start: new Date(ms).toISOString().replace('.000Z', 'Z'),
      hours,
      delay,
      elapsed: Math.min(r.elapsed, hours),
    };
    const err = requestError(index, next);
    if (err) {
      setError(err);
      return;
    }
    setError('');
    patch(next);
  };
  return (
    <section className={`${s.windowShell} ${expanded ? s.windowExpanded : ''}`}>
      <button
        className={s.windowToggle}
        aria-expanded={expanded}
        onClick={() => setExpanded(!expanded)}
      >
        <span>
          {utcLabel(r.start, true)} UTC / {r.hours / 24} days
          <br />
          <small>Schedule slip +{r.delay} hours</small>
        </span>
        <strong>
          {expanded ? 'Close settings' : 'Edit window'} {String.fromCharCode(8599)}
        </strong>
      </button>
      <form
        className={s.windowControls}
        onSubmit={apply}
        noValidate
        aria-label="Configure mission window"
      >
        <label>
          01 / START UTC
          <input
            aria-label="Mission start UTC"
            type="datetime-local"
            value={start}
            min={index.start_utc.slice(0, 16)}
            max={index.end_utc.slice(0, 16)}
            step="3600"
            onChange={(e) => setStart(e.target.value)}
          />
        </label>
        <label>
          02 / DURATION
          <select
            aria-label="Mission duration"
            value={[24, 72, 168, 336].includes(hours) ? hours : 'custom'}
            onChange={(e) => setHours(e.target.value === 'custom' ? 120 : Number(e.target.value))}
          >
            <option value="24">1 Earth day</option>
            <option value="72">3 Earth days</option>
            <option value="168">7 Earth days</option>
            <option value="336">14 Earth days</option>
            <option value="custom">Custom hours</option>
          </select>
          {![24, 72, 168, 336].includes(hours) && (
            <input
              aria-label="Custom duration hours"
              type="number"
              min="24"
              max="336"
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
            />
          )}
        </label>
        <label>
          03 / SCHEDULE SLIP
          <select
            aria-label="Mission delay"
            value={[24, 48, 72, 168].includes(delay) ? delay : 'custom'}
            onChange={(e) => setDelay(e.target.value === 'custom' ? 0 : Number(e.target.value))}
          >
            <option value="24">+1 day / 24 h</option>
            <option value="48">+2 days / 48 h</option>
            <option value="72">+3 days / 72 h</option>
            <option value="168">+7 days / 168 h</option>
            <option value="custom">Custom hours</option>
          </select>
          {![24, 48, 72, 168].includes(delay) && (
            <input
              aria-label="Custom delay hours"
              type="number"
              min="0"
              max="336"
              value={delay}
              onChange={(e) => setDelay(Number(e.target.value))}
            />
          )}
        </label>
        <button className={s.lightButton} type="submit">
          Update window <span aria-hidden="true">{String.fromCharCode(8599)}</span>
        </button>
        {error && (
          <p className={s.formError} role="alert">
            {error}
          </p>
        )}
        <p className={s.windowRange}>
          Hourly archive / {utcLabel(index.start_utc, true)} &ndash; {utcLabel(index.end_utc, true)}{' '}
          UTC. All times use UTC.
        </p>
      </form>
    </section>
  );
}
function MetricLine({ label, before, after }: { label: string; before: Metric; after: Metric }) {
  return (
    <div className={s.metricLine}>
      <span>{label}</span>
      <strong>
        {pct(before)}
        <small>%</small>
      </strong>
      <span aria-hidden="true">{String.fromCharCode(8594)}</span>
      <strong>
        {pct(after)}
        <small>%</small>
      </strong>
    </div>
  );
}
function SiteComparison({
  before,
  after,
  site,
  change,
}: {
  before: Summary;
  after: Summary;
  site: Site;
  change: string;
}) {
  const run = after.joint.longest;
  return (
    <article className={s.resultSite}>
      <header>
        <span>{site.mission}</span>
        <h3>{site.name}</h3>
      </header>
      <div className={s.resultColumns}>
        <span>SHARE OF HOURLY SAMPLES</span>
        <span>Original</span>
        <span>Delayed</span>
      </div>
      <MetricLine label="Sun above" before={before.sun} after={after.sun} />
      <MetricLine label="Earth above" before={before.earth} after={after.earth} />
      <div className={s.jointMetric}>
        <MetricLine label="Both above" before={before.joint} after={after.joint} />
      </div>
      <p className={s.sampleReceipt}>
        {before.joint.above}/{before.joint.expected} original &middot; {after.joint.above}/
        {after.joint.expected} delayed
      </p>
      <p className={s.change}>{change}</p>
      <details>
        <summary>Timing &amp; coverage</summary>
        <p>
          {run
            ? `Longest jointly above sampled run in delayed window: ${run.hours} h endpoint span, ${run.count} samples. ${utcLabel(run.start)} to ${utcLabel(run.end)} UTC.`
            : 'No jointly above-horizon samples in the delayed window.'}
        </p>
        <p>
          Unknown Sun/Earth samples: {after.sun.unknown}/{after.earth.unknown}. Numerical boundary:{' '}
          {after.sun.boundary}/{after.earth.boundary}. Minimum sampled elevations: Sun{' '}
          {angle(after.minimumSun)}, Earth {angle(after.minimumEarth)}.
        </p>
        <p>
          Runs may start or end at the window boundary. Endpoint spans do not establish
          uninterrupted availability.
        </p>
      </details>
    </article>
  );
}
function TimeChooser({
  analysis,
  patch,
  onClose,
}: {
  analysis: Analysis;
  patch: (c: Partial<Request>) => void;
  onClose: () => void;
}) {
  const { request: r } = analysis,
    start = addHours(r.start, r.scenario === 'delayed' ? r.delay : 0),
    end = addHours(start, r.hours);
  const [value, setValue] = useState(analysis.utc.slice(0, 16)),
    [error, setError] = useState(''),
    [nearest, setNearest] = useState<number | null>(null);
  const choose = (elapsed: number) => {
    patch({ elapsed });
    onClose();
  };
  return (
    <Dialog title="Inspect a UTC sample" onClose={onClose}>
      <p className="eyebrow">ONE CLOCK / BOTH PLACES</p>
      <h2 className={s.dialogTitle}>CHOOSE A MOMENT.</h2>
      <p>
        Choose an exact hourly sample in the active {r.scenario} window. Both skies update together.
      </p>
      <form
        className={s.timeForm}
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          const n = (Date.parse(value + 'Z') - Date.parse(start)) / 3600000;
          if (Number.isInteger(n) && n >= 0 && n <= r.hours) choose(n);
          else {
            setError(
              'No released hourly sample at that UTC in this window. No position has been estimated.',
            );
            if (Number.isFinite(n)) setNearest(Math.max(0, Math.min(r.hours, Math.round(n))));
          }
        }}
      >
        <label>
          UTC date and time
          <input
            aria-label="Inspection UTC"
            type="datetime-local"
            value={value}
            min={start.slice(0, 16)}
            max={end.slice(0, 16)}
            step="3600"
            onChange={(e) => {
              setValue(e.target.value);
              setNearest(null);
              setError('');
            }}
          />
        </label>
        <p>
          {utcLabel(start)} &ndash; {utcLabel(end)} UTC.
        </p>
        <button className={s.lightButton}>Inspect this sample</button>
        {error && (
          <div role="status">
            <p>{error}</p>
            {nearest !== null && (
              <button type="button" onClick={() => choose(nearest)}>
                Use nearest supported sample: {utcLabel(addHours(start, nearest))} UTC
              </button>
            )}
          </div>
        )}
      </form>
    </Dialog>
  );
}
function Exporter({
  analysis,
  index,
  onClose,
}: {
  analysis: Analysis;
  index: Index;
  onClose: () => void;
}) {
  const [status, setStatus] = useState(''),
    [manual, setManual] = useState('');
  const url = new URL(comparisonURL(analysis.request), location.origin).href;
  const download = (kind: 'csv' | 'json') => {
    const content =
        kind === 'csv'
          ? analysis.csv
          : JSON.stringify(
              {
                schema_version: '2.0.0',
                release: index.release_id,
                request: analysis.request,
                utc: analysis.utc,
                summaries: analysis.summaries,
                explanation: analysis.explanation,
                changes: analysis.changes,
                runs: analysis.runs,
                validation: index.validation,
                observer_frame: index.source.frame,
                limitations: index.limitations,
              },
              null,
              2,
            ),
      link = document.createElement('a'),
      href = URL.createObjectURL(
        new Blob([content], {
          type: kind === 'csv' ? 'text/csv;charset=utf-8' : 'application/json',
        }),
      );
    link.href = href;
    link.download = `rimwake-comparison.${kind}`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(href), 1000);
  };
  return (
    <Dialog title="Share the comparison" onClose={onClose}>
      <p className="eyebrow">THE PLACE / THE WINDOW / THE EVIDENCE</p>
      <h2 className={s.dialogTitle}>
        TAKE THE COMPARISON
        <br />
        WITH YOU.
      </h2>
      <p>
        Reopen the same archive, viewpoints, original window, delay and inspection time. Links work
        when the application is served from the same address.
      </p>
      <div className={s.exportButtons}>
        <button
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(url);
              setStatus('Comparison link copied.');
            } catch {
              setManual(url);
            }
          }}
        >
          Copy comparison link
        </button>
        <button onClick={() => download('json')}>Download comparison JSON</button>
        <button onClick={() => download('csv')}>Download source samples CSV</button>
        <button
          onClick={() => {
            onClose();
            setTimeout(() => window.print(), 120);
          }}
        >
          Print comparison brief
        </button>
      </div>
      {status && <p role="status">{status}</p>}
      {manual && (
        <label>
          Copy link manually
          <textarea readOnly value={manual} onFocus={(e) => e.target.select()} />
        </label>
      )}
      <p>
        Exports retain sample semantics, source requests, response hashes and provisional scientific
        status.
      </p>
    </Dialog>
  );
}
function Evidence({
  analysis,
  index,
  onClose,
}: {
  analysis: Analysis;
  index: Index;
  onClose: () => void;
}) {
  return (
    <Dialog title="Comparison evidence" onClose={onClose} wide>
      <p className="eyebrow">SOURCE-BACKED / SCIENCE PROVISIONAL</p>
      <h2 className={s.dialogTitle}>
        A RESULT YOU
        <br />
        CAN INSPECT.
      </h2>
      <p>
        Release <code>{index.release_id}</code>. Source integrity and independent astronomical
        validation are different checks.
      </p>
      <h3>What is modeled</h3>
      <p>
        {index.source.frame} All observers are hypothetical at zero reference-ellipsoid height, not
        real spacecraft instruments.
      </p>
      <ul>
        {index.limitations.map((limit) => (
          <li key={limit}>{limit}</li>
        ))}
      </ul>
      <p>
        Independent ephemeris check: {index.validation.independent_ephemeris_check}. Frame
        reconciliation: {index.validation.frame_reconciliation}.
      </p>
      <h3>Selected records / {utcLabel(analysis.utc)} UTC</h3>
      {analysis.records.map((rows, i) => (
        <section key={i}>
          <h4>
            {i ? 'B' : 'A'} / {index.sites.find((site) => site.id === rows[0].site_id)?.name}
          </h4>
          {rows.map((row) => (
            <p key={row.body_id}>
              {row.body_id === 10 ? 'Sun' : 'Earth'}: elevation {angle(row.elevation_deg)}, bearing{' '}
              {row.azimuth_deg}&deg;. Run <code>{row.run_id}</code>.
            </p>
          ))}
        </section>
      ))}
      <h3>Archived JPL requests</h3>
      {analysis.runs.map((run) => (
        <details key={run.run_id}>
          <summary>{run.run_id}</summary>
          <p>
            <a href={run.request_url} target="_blank" rel="noreferrer">
              Original JPL query
            </a>{' '}
            / <a href={run.raw_url}>Archived raw response</a>
          </p>
          <p>
            API response signature {run.api_version}. Retrieved {run.retrieved_at_utc}.
          </p>
          <p className={s.hash}>{run.raw_sha256}</p>
        </details>
      ))}
      <p>
        <a href={index.source.raw_url}>Archived NASA coordinate catalog</a> /{' '}
        <a href="/data/atlas/manifest.json">Atlas manifest</a>
      </p>
      <Link href="/sources">Full sources &amp; credits</Link>
    </Dialog>
  );
}
export default function MissionPage() {
  const restoreTimeFocus = useRef(false);
  const o = useAtlas(),
    { request: r, result, pending, error, patch } = o;
  const [modal, setModal] = useState<'evidence' | 'export' | 'time' | null>(null),
    [inspected, setInspected] = useState<string | null>(null),
    [reset, setReset] = useState(0),
    [failed, setFailed] = useState(false),
    [interact, setInteract] = useState(false),
    [playing, setPlaying] = useState(false),
    [catalog, setCatalog] = useState(false),
    [showPhoto, setShowPhoto] = useState(false);
  useEffect(() => {
    if (
      restoreTimeFocus.current &&
      modal === null &&
      !pending &&
      result &&
      JSON.stringify(r) === JSON.stringify(result.analysis.request)
    ) {
      document.getElementById('atlas-time-trigger')?.focus();
      restoreTimeFocus.current = false;
    }
  }, [modal, pending, result]);
  const reduced = useMedia('(prefers-reduced-motion:reduce)'),
    phone = useMedia('(max-width:700px)'),
    capable = useWebGLCapability(!reduced);
  useEffect(() => {
    if (!playing || pending) return;
    const timer = setTimeout(() => {
      if (r.elapsed >= r.hours) setPlaying(false);
      else patch({ elapsed: Math.min(r.hours, r.elapsed + 1) });
    }, 500);
    return () => clearTimeout(timer);
  }, [playing, pending, r.elapsed, r.hours]);
  useEffect(
    () => () => {
      document.body.style.cursor = '';
    },
    [],
  );
  if (error)
    return (
      <main id="main" className={s.mission}>
        <p className="eyebrow">NO READINGS ESTIMATED</p>
        <h1 className={s.errorTitle}>
          THIS COMPARISON
          <br />
          IS UNAVAILABLE.
        </h1>
        <p role="alert">{error}</p>
        <div className={s.errorActions}>
          <button className={s.lightButton} onClick={o.retry}>
            Retry verification
          </button>
          <button onClick={o.reset}>Reset to archived example</button>
          <Link href="/sources">Inspect the sources</Link>
        </div>
      </main>
    );
  if (!result) return <MissionLoading />;
  const { index, analysis } = result,
    shown = analysis.request,
    current = !pending && JSON.stringify(r) === JSON.stringify(shown),
    sites = index.sites,
    a = sites.find((site) => site.id === shown.a)!,
    b = sites.find((site) => site.id === shown.b)!,
    focus = shown.focus === 'A' ? a : b,
    viewSite = sites.find((site) => site.id === inspected) ?? focus;
  const photo = photos.find((item) => item.site_id === viewSite.id);
  const choose = (id: string) => {
    if (id === r.a || id === r.b) {
      setInspected(null);
      patch({ focus: id === r.a ? 'A' : 'B' });
    } else setInspected(id);
  };
  const focusRows = analysis.records[shown.focus === 'A' ? 0 : 1],
    skyLimit = Math.max(
      12,
      ...analysis.records
        .flat()
        .map((row) => Math.ceil(Math.abs(row.elevation_deg ?? 0) / 10) * 10),
    );
  const currentSummaries = analysis.summaries.filter((sum) => sum.scenario === shown.scenario);
  const nextCross = currentSummaries[shown.focus === 'A' ? 0 : 1].crossings.find(
    (event) => event.end > analysis.utc,
  );
  return (
    <main id="main" tabIndex={-1} className={s.mission} data-release-id={index.release_id}>
      <header className={s.pageHeading}>
        <div>
          <p className="eyebrow">THE RIMWAKE MISSION ATLAS</p>
          <h1>WHAT IF THE DATE CHANGES?</h1>
          <p>
            <span className={s.desktopLead}>
              Compare two places. Move the window. Understand the difference.
            </span>
            <span className={s.mobileLead}>Two places. One window. What changes?</span>
          </p>
        </div>
        <div className={s.headingTools}>
          <button onClick={() => setModal('evidence')}>
            Evidence &amp; limits <span aria-hidden="true">{String.fromCharCode(8599)}</span>
          </button>
          <button onClick={() => setModal('export')} disabled={!current}>
            Share &amp; export <span aria-hidden="true">{String.fromCharCode(8599)}</span>
          </button>
        </div>
      </header>
      <WindowControls r={r} index={index} patch={patch} />
      <section className={s.verdict} aria-label="Comparison outcome" aria-busy={pending}>
        <div>
          <p className="eyebrow">
            THE {shown.scenario === 'baseline' ? 'ORIGINAL' : 'DELAYED'} WINDOW / {shown.hours / 24}{' '}
            EARTH DAYS
          </p>
          <h2 className={s.fullVerdict}>
            {pending ? 'UPDATING THE COMPARISON.' : analysis.explanation}
          </h2>
          <div className={s.compactVerdict} aria-busy={pending}>
            <p>BOTH ABOVE / SHARE OF HOURLY SAMPLES</p>
            <div>
              {currentSummaries.map((summary, i) => (
                <span key={i}>
                  {i === 0 ? a.name : b.name}
                    <strong>{pending ? 'Updating' : pct(summary.joint) + '%'}</strong>
                </span>
              ))}
            </div>
          </div>
          <p>
            {utcLabel(addHours(shown.start, shown.scenario === 'delayed' ? shown.delay : 0))}{' '}
            &ndash;{' '}
            {utcLabel(
              addHours(shown.start, shown.hours + (shown.scenario === 'delayed' ? shown.delay : 0)),
            )}{' '}
            UTC
          </p>
        </div>
        <button
          className={s.lightButton}
          onClick={() => patch({ scenario: r.scenario === 'baseline' ? 'delayed' : 'baseline' })}
        >
          {r.scenario === 'baseline' ? `Apply ${r.delay}-hour delay` : 'Return to original'}{' '}
          <span aria-hidden="true">{String.fromCharCode(8594)}</span>
        </button>
      </section>
      <div className={s.workspace}>
        <section className={s.atlas} aria-label="Lunar atlas">
          <div className={s.atlasTop}>
            <span>06 PLACES / ONE MOON</span>
            <div>
              <button aria-pressed={r.view === 'atlas'} onClick={() => patch({ view: 'atlas' })}>
                Globe
              </button>
              <button aria-pressed={r.view === 'sky'} onClick={() => patch({ view: 'sky' })}>
                Sky
              </button>
            </div>
          </div>
          <div className={`${s.globeStage} ${phone && !interact ? s.touchLocked : ''}`}>
            {shown.view === 'sky' ? (
              <div className={s.skyStage}>
                {current ? (
                  <Horizon records={focusRows} name={focus.name} limit={skyLimit} />
                ) : (
                  <p>Updating the shared sample&hellip;</p>
                )}
              </div>
            ) : capable && !failed && !reduced ? (
              <SceneGuard onFailure={() => setFailed(true)}>
                <Suspense
                  fallback={
                    <div className={s.globePoster}>
                      <img src="/assets/moon-context-mobile.webp" alt="" />
                    </div>
                  }
                >
                  <Scene
                    sites={sites}
                    a={shown.a}
                    b={shown.b}
                    focus={viewSite}
                    onChoose={choose}
                    reset={reset}
                    reduced={reduced}
                    onFailure={() => setFailed(true)}
                  />
                </Suspense>
              </SceneGuard>
            ) : capable === null && !reduced ? (
              <div className={s.globePoster}>
                <img src="/assets/moon-context-mobile.webp" alt="" />
              </div>
            ) : (
              <FlatMap sites={sites} a={shown.a} b={shown.b} onChoose={choose} />
            )}
            <div className={s.globeCaption}>
              <p>{inspected ? 'EXPLORING A PLACE' : `FOCUSED VIEWPOINT ${shown.focus}`}</p>
              <h2>{viewSite.name}</h2>
              <span>
                {Math.abs(viewSite.latitude_deg)}&deg; {viewSite.latitude_deg < 0 ? 'S' : 'N'} /{' '}
                {viewSite.longitude_deg_east}&deg; E
              </span>
            </div>
            {inspected && (
              <div className={s.assignPlace}>
                <p>Compare {viewSite.name} as a viewpoint</p>
                <button
                  onClick={() => {
                    patch({ a: inspected, focus: 'A' });
                    setInspected(null);
                  }}
                >
                  Use as A
                </button>
                <button
                  onClick={() => {
                    patch({ b: inspected, focus: 'B' });
                    setInspected(null);
                  }}
                >
                  Use as B
                </button>
                <button aria-label="Close place preview" onClick={() => setInspected(null)}>
                  Close
                </button>
              </div>
            )}
          </div>
          <div className={s.atlasBottom}>
            <span>NASA LRO imagery / illustrative lighting / no terrain model</span>
            <div>
              {photo && (
                <button aria-expanded={showPhoto} onClick={() => setShowPhoto(!showPhoto)}>
                  {showPhoto ? 'Close LROC image' : 'LROC site image'}
                </button>
              )}
              {phone && capable && shown.view === 'atlas' && (
                <button onClick={() => setInteract(!interact)}>
                  {interact ? 'Done rotating' : 'Rotate globe'}
                </button>
              )}
              <button
                onClick={() => {
                  setInspected(null);
                  setReset((n) => n + 1);
                }}
              >
                Reset view
              </button>
            </div>
          </div>
          {showPhoto && photo && (
            <figure className={s.sitePhoto}>
              <img
                src={photo.file}
                alt={`Historical LROC context image of the ${viewSite.mission} landing location`}
                width="300"
                height="230"
              />
              <figcaption>
                <strong>{viewSite.name} / LROC</strong>
                <p>Historical image. Not the selected date's lighting or a terrain calculation.</p>
                <a href={photo.source_page} target="_blank" rel="noreferrer">
                  Open original source {String.fromCharCode(8599)}
                </a>
                <small>{photo.credit}</small>
              </figcaption>
            </figure>
          )}
        </section>
        <aside className={s.places}>
          <p className="eyebrow">TWO VIEWPOINTS</p>
          {(['A', 'B'] as const).map((slot) => (
            <label className={s.placeSelect} key={slot}>
              <span>{slot}</span>
              <select
                aria-label={`Viewpoint ${slot}`}
                value={slot === 'A' ? r.a : r.b}
                onChange={(e) => {
                  setInspected(null);
                  patch(
                    slot === 'A'
                      ? { a: e.target.value, focus: 'A' }
                      : { b: e.target.value, focus: 'B' },
                  );
                }}
              >
                {sites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name} / {site.mission}
                  </option>
                ))}
              </select>
            </label>
          ))}
          <button
            className={s.swap}
            onClick={() => {
              setInspected(null);
              patch({ a: r.b, b: r.a, focus: r.focus === 'A' ? 'B' : 'A' });
            }}
          >
            Swap viewpoints <span aria-hidden="true">{String.fromCharCode(8644)}</span>
          </button>
          <button
            className={s.catalogToggle}
            aria-expanded={catalog}
            onClick={() => setCatalog(!catalog)}
          >
            {catalog ? 'Hide site catalog' : 'Explore all six sites'}{' '}
            {String.fromCharCode(catalog ? 8722 : 43)}
          </button>
          <div
            className={`${s.siteList} ${catalog ? s.catalogOpen : ''}`}
            aria-label="Explore the six sites"
          >
            {sites.map((site) => (
              <button
                key={site.id}
                onClick={() => choose(site.id)}
                aria-pressed={viewSite.id === site.id}
              >
                <span>
                  {site.id === shown.a ? 'A' : site.id === shown.b ? 'B' : String.fromCharCode(183)}
                </span>
                <div>
                  <strong>{site.name}</strong>
                  <small>{site.mission}</small>
                </div>
                <span aria-hidden="true">{String.fromCharCode(8599)}</span>
              </button>
            ))}
          </div>
          <p className={s.placeNote}>
            Published landing coordinates used as hypothetical viewpoints. These are not
            measurements from the landers.
          </p>
        </aside>
        <aside className={s.inspection}>
          <div className={s.clockHeading}>
            <p className="eyebrow">ONE SHARED INSPECTION TIME</p>
            <span className={s.statusDot}>{pending ? 'Updating' : 'Source verified'}</span>
          </div>
          <button
            id="atlas-time-trigger"
            className={s.clock}
            onClick={() => setModal('time')}
            disabled={!current}
          >
            <strong data-testid="atlas-utc" data-utc={current ? analysis.utc : ''}>
              {current ? utcLabel(analysis.utc) : 'Updating sample'}
            </strong>
            <span>UTC / change time {String.fromCharCode(8599)}</span>
          </button>
          <div className={s.scenarioTabs}>
            <button
              aria-pressed={r.scenario === 'baseline'}
              onClick={() => patch({ scenario: 'baseline' })}
            >
              Original window
            </button>
            <button
              aria-pressed={r.scenario === 'delayed'}
              onClick={() => patch({ scenario: 'delayed' })}
            >
              Delayed +{r.delay} h
            </button>
          </div>
          <div className={s.sampleActions}>
            <button
              aria-label="Previous sample"
              disabled={r.elapsed === 0}
              onClick={() => patch({ elapsed: r.elapsed - 1 })}
            >
              {String.fromCharCode(8592)}
            </button>
            <button
              aria-pressed={playing}
              onClick={() => {
                if (r.elapsed === r.hours) patch({ elapsed: 0 });
                setPlaying(!playing);
              }}
            >
              {playing ? 'Pause' : 'Play samples'}
            </button>
            <button
              aria-label="Next sample"
              disabled={r.elapsed === r.hours}
              onClick={() => patch({ elapsed: r.elapsed + 1 })}
            >
              {String.fromCharCode(8594)}
            </button>
          </div>
          <div className={s.focusTabs}>
            <button
              aria-pressed={r.focus === 'A'}
              onClick={() => {
                setInspected(null);
                patch({ focus: 'A' });
              }}
            >
              A / {a.name}
            </button>
            <button
              aria-pressed={r.focus === 'B'}
              onClick={() => {
                setInspected(null);
                patch({ focus: 'B' });
              }}
            >
              B / {b.name}
            </button>
          </div>
          {shown.view === 'atlas' && (
            <div aria-busy={!current}>
              {current ? (
                <Horizon records={focusRows} name={focus.name} limit={skyLimit} />
              ) : (
                <div className={s.updating}>Verifying the selected sample&hellip;</div>
              )}
            </div>
          )}
          <div className={s.crossingNote}>
            {nextCross ? (
              <>
                <span>NEXT OBSERVED CROSSING / {focus.name}</span>
                <p>
                  {nextCross.body}: {utcLabel(nextCross.start, true)} &ndash;{' '}
                  {utcLabel(nextCross.end, true)} UTC
                </p>
                <small>Exact instant unresolved.</small>
              </>
            ) : (
              <p>No later crossing observed in this window.</p>
            )}
          </div>
          <details className={s.readingHelp}>
            <summary>How to read the sky</summary>
            <p>
              Positive elevation is above the flat geometric reference horizon; negative is below
              it. Bearing runs north 0, east 90, south 180, west 270 degrees. Glyph sizes are
              illustrative. Both sites use the same chart scale.
            </p>
            <p>
              The globe provides geographic context. It does not calculate terrain shadows. These
              results establish neither usable power nor a working radio link.
            </p>
          </details>
        </aside>
      </div>
      <section
        className={`${s.comparison} ${pending ? s.dimmed : ''}`}
        aria-label="Original and delayed window comparison"
      >
        <SiteComparison
          before={analysis.summaries[0]}
          after={analysis.summaries[2]}
          site={a}
          change={analysis.changes[0]}
        />
        <SiteComparison
          before={analysis.summaries[1]}
          after={analysis.summaries[3]}
          site={b}
          change={analysis.changes[1]}
        />
      </section>
      <p className={s.metricsNote}>
        Percentages describe hourly samples, including both window endpoints. Unknowns remain
        explicit; no power yield, radio link or continuous-availability guarantee is implied.
      </p>
      <Timeline analysis={analysis} index={index} patch={patch} pending={pending} />
      <div className={s.bottomNote}>
        <span>GEOMETRIC HORIZON / SCIENCE PROVISIONAL</span>
        <p>A first comparison, with the source and its limits in view.</p>
        <button onClick={() => setModal('evidence')}>
          Inspect the evidence {String.fromCharCode(8599)}
        </button>
      </div>
      <section className={s.printBrief}>
        <h1>RIMWAKE / MISSION WINDOW COMPARISON</h1>
        <p>
          {a.name} and {b.name}. Original: {utcLabel(shown.start)} UTC, {shown.hours} hours. Delay:{' '}
          {shown.delay} hours.
        </p>
        <p>{analysis.explanation}</p>
        {analysis.summaries.map((sum) => (
          <p key={sum.site + sum.scenario}>
            {sum.site} / {sum.scenario}: Sun {sum.sun.above}/{sum.sun.expected}, Earth{' '}
            {sum.earth.above}/{sum.earth.expected}, both {sum.joint.above}/{sum.joint.expected}{' '}
            samples above horizon.
          </p>
        ))}
        <p>{index.release_id} / science provisional.</p>
        {index.limitations.map((limit) => (
          <p key={limit}>{limit}</p>
        ))}
        {analysis.runs.map((run) => (
          <p key={run.run_id}>
            {run.run_id}: {run.request_url}
            <br />
            SHA-256 {run.raw_sha256}
          </p>
        ))}
      </section>
      {modal === 'evidence' && (
        <Evidence analysis={analysis} index={index} onClose={() => setModal(null)} />
      )}{' '}
      {modal === 'export' && (
        <Exporter analysis={analysis} index={index} onClose={() => setModal(null)} />
      )}{' '}
      {modal === 'time' && (
        <TimeChooser
          analysis={analysis}
          patch={patch}
          onClose={() => {
            restoreTimeFocus.current = true;
            setModal(null);
          }}
        />
      )}
    </main>
  );
}
