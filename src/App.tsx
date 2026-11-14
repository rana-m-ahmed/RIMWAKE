import { useEffect, useMemo, useRef, useState } from 'react';
import {
  both,
  classify,
  releaseSchema,
  skyPoint,
  stateLabel,
  type Release,
  type Sample,
  type Site,
} from './science';
import s from './App.module.css';

const fmt = (n: number | null) =>
  n === null ? 'Unavailable' : `${n >= 0 ? '+' : ''}${n.toFixed(3)}°`;
const az = (n: number | null) => (n === null ? 'Unavailable' : `${n.toFixed(3)}°`);
const date = (t: string) =>
  new Date(t).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
const time = (t: string) => t.slice(11, 16);
const lookup = (rows: Sample[], site: string, body: number, t: string) =>
  rows.find((r) => r.site_id === site && r.body_id === body && r.timestamp_utc === t)!;
function Mark() {
  return (
    <svg viewBox="0 0 40 40" width="34" height="34" aria-hidden="true">
      <circle cx="20" cy="20" r="17" fill="none" stroke="currentColor" />
      <path d="M3 27h34M10 27l10-18 10 18" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function Sky({
  site,
  rows,
  t,
  slot,
  active,
}: {
  site: Site;
  rows: Sample[];
  t: string;
  slot: string;
  active: boolean;
}) {
  const sun = lookup(rows, site.id, 10, t),
    earth = lookup(rows, site.id, 399, t);
  return (
    <section
      className={`${s.skyPanel} ${active ? s.mobileActive : ''}`}
      aria-label={`${slot} ${site.name}`}
    >
      <div className={s.siteTitle}>
        <span className={s.slot}>{slot}</span>
        <div>
          <h2>{site.name}</h2>
          <p>
            {Math.abs(site.latitude_deg)}° S <span>/</span> {site.longitude_deg_east}° E
          </p>
        </div>
        <span className={s.hypothesis}>Hypothetical observer</span>
      </div>
      <svg
        className={s.sky}
        viewBox="0 0 400 400"
        role="img"
        aria-label={`Overhead sky at ${site.name}. Sun elevation ${fmt(sun.elevation_deg)}, azimuth ${az(sun.azimuth_deg)}. Earth elevation ${fmt(earth.elevation_deg)}, azimuth ${az(earth.azimuth_deg)}. Negative elevations are listed below, outside this chart.`}
      >
        <defs>
          <radialGradient id={`sky-${slot}`}>
            <stop offset="0" stopColor="#20312a" />
            <stop offset="1" stopColor="#111b17" />
          </radialGradient>
        </defs>
        <circle cx="200" cy="200" r="135" fill={`url(#sky-${slot})`} stroke="#9eae9270" />
        {[45, 90].map((r) => (
          <circle key={r} cx="200" cy="200" r={r} className={s.gridCircle} />
        ))}
        {[0, 30, 60, 90, 120, 150].map((a) => (
          <line
            key={a}
            x1={200 + 135 * Math.sin((a * Math.PI) / 180)}
            y1={200 - 135 * Math.cos((a * Math.PI) / 180)}
            x2={200 - 135 * Math.sin((a * Math.PI) / 180)}
            y2={200 + 135 * Math.cos((a * Math.PI) / 180)}
            className={s.gridLine}
          />
        ))}
        {Array.from({ length: 72 }, (_, i) => {
          const a = (i * 5 * Math.PI) / 180;
          return (
            <line
              key={i}
              x1={200 + 141 * Math.sin(a)}
              y1={200 - 141 * Math.cos(a)}
              x2={200 + (i % 6 === 0 ? 149 : 145) * Math.sin(a)}
              y2={200 - (i % 6 === 0 ? 149 : 145) * Math.cos(a)}
              stroke={i % 6 === 0 ? '#b4c0a9' : '#50604e'}
              strokeWidth="1"
            />
          );
        })}
        <g className={s.axis}>
          <text x="200" y="37" textAnchor="middle">
            N · 0°
          </text>
          <text x="365" y="204" textAnchor="middle">
            E
          </text>
          <text x="200" y="372" textAnchor="middle">
            S · 180°
          </text>
          <text x="35" y="204" textAnchor="middle">
            W
          </text>
        </g>
        <g className={s.elevLabels}>
          <text x="205" y="194">
            90°
          </text>
          <text x="205" y="159">
            60°
          </text>
          <text x="205" y="114">
            30°
          </text>
          <text x="200" y="352" textAnchor="middle">
            0° TANGENT PLANE
          </text>
        </g>
        <path d="M191 200h18M200 191v18" stroke="#90a184" strokeWidth=".7" />
        {[sun, earth].map((body) => {
          if (body.elevation_deg === null || body.azimuth_deg === null || body.elevation_deg < 0)
            return null;
          const p = skyPoint(body.azimuth_deg, body.elevation_deg);
          const solar = body.body_id === 10;
          return (
            <g
              key={body.body_id}
              className={solar ? s.sun : s.earth}
              data-testid={`${slot}-${solar ? 'sun' : 'earth'}-marker`}
              data-azimuth={body.azimuth_deg}
              data-elevation={body.elevation_deg}
            >
              <line
                x1="200"
                y1="200"
                x2={p.x}
                y2={p.y}
                stroke="currentColor"
                strokeDasharray="3 5"
                opacity=".5"
              />
              <circle cx={p.x} cy={p.y} r="12" fill="#121c17" stroke="currentColor" />
              <circle cx={p.x} cy={p.y} r={solar ? 5 : 4} fill="currentColor" />
              {solar &&
                [0, 90, 180, 270].map((a) => (
                  <line
                    key={a}
                    x1={p.x + 7 * Math.sin((a * Math.PI) / 180)}
                    y1={p.y - 7 * Math.cos((a * Math.PI) / 180)}
                    x2={p.x + 9 * Math.sin((a * Math.PI) / 180)}
                    y2={p.y - 9 * Math.cos((a * Math.PI) / 180)}
                    stroke="currentColor"
                  />
                ))}
              <text
                x={p.x + (p.x > 290 ? -19 : 19)}
                y={p.y - 15}
                textAnchor={p.x > 290 ? 'end' : 'start'}
                fill="currentColor"
                fontSize="11"
              >
                {solar ? 'SUN' : 'EARTH'}
              </text>
            </g>
          );
        })}
      </svg>
      <table className={s.readings}>
        <caption className={s.srOnly}>Exact sampled angles for {site.name}</caption>
        <thead>
          <tr>
            <th>BODY / STATE</th>
            <th>AZIMUTH</th>
            <th>ELEVATION</th>
          </tr>
        </thead>
        <tbody>
          {[sun, earth].map((body) => (
            <tr key={body.body_id}>
              <th>
                <span className={body.body_id === 10 ? s.sun : s.earth}>
                  {body.body_id === 10 ? 'Sun' : 'Earth'}
                </span>
                <small>{stateLabel(classify(body.elevation_deg))}</small>
              </th>
              <td>{az(body.azimuth_deg)}</td>
              <td
                className={body.body_id === 10 ? s.sun : s.earth}
                data-testid={`${slot}-${body.body_id}-elevation`}
              >
                {fmt(body.elevation_deg)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function Track({
  states,
  color,
  selected,
  onSelect,
  label,
}: {
  states: string[];
  color: string;
  selected: number;
  onSelect: (n: number) => void;
  label: string;
}) {
  const segments: { start: number; end: number; state: string }[] = [];
  states.forEach((state, i) => {
    const last = segments.at(-1);
    if (last?.state === state) last.end = i + 1;
    else segments.push({ start: i, end: i + 1, state });
  });
  return (
    <svg
      viewBox={`0 0 ${states.length} 12`}
      preserveAspectRatio="none"
      className={s.track}
      aria-label={label}
      role="img"
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        onSelect(
          Math.min(
            states.length - 1,
            Math.max(0, Math.floor(((e.clientX - rect.left) / rect.width) * states.length)),
          ),
        );
      }}
    >
      <title>
        {label}. Bright segments: above tangent plane. Muted segments: below. Use the UTC slider for
        keyboard navigation.
      </title>
      {segments.map((seg) => (
        <rect
          key={seg.start}
          x={seg.start}
          y="2"
          width={seg.end - seg.start}
          height="8"
          fill={seg.state === 'visible' ? color : seg.state === 'blocked' ? '#334035' : '#b9b3a0'}
          opacity={seg.state === 'blocked' ? '.65' : '1'}
        />
      ))}
      <line
        x1={selected + 0.5}
        x2={selected + 0.5}
        y1="0"
        y2="12"
        stroke="#fff8df"
        strokeWidth={Math.max(1, states.length / 700)}
      />
    </svg>
  );
}

function Evidence({ r, onClose }: { r: Release; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog?.showModal();
    return () => {
      dialog?.close();
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      aria-labelledby="evidence-heading"
      className={s.drawer}
      onCancel={onClose}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return;
        const focusable = [...event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not(:disabled), summary, input, select, [tabindex="0"]')].filter(element => element.checkVisibility());
        const first = focusable[0], last = focusable.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={s.drawerHead}>
        <span className={s.eyebrow}>THE EVIDENCE REGISTER</span>
        <button autoFocus onClick={onClose} aria-label="Close evidence">
          Close ×
        </button>
      </div>
      <h2 id="evidence-heading">
        Every reading has
        <br />a source.
      </h2>
      <p>
        JPL Horizons apparent airless positions. Provisional geometry, with archived source
        responses and parser checks. Independent astronomical-model validation has not been run.
      </p>
      <h3>01 / Model & observer</h3>
      <p>
        Geometric horizon — lunar terrain excluded. Centre-of-disc only. Each observer is
        hypothetical, at 0 km above the Horizons lunar reference ellipsoid at approximate published
        landing coordinates. This does not reproduce a lander’s antenna height.
      </p>
      <p>
        North is 0°, east is 90°, clockwise. Negative elevation means below the tangent plane; it
        does not identify an obstructing ridge. Finite discs, eclipses, power generation and RF link
        performance are excluded.
      </p>
      <h3>02 / Source ledger</h3>
      {r.sources.map((source) => (
        <article className={s.source} key={source.id}>
          <a href={source.url} target="_blank" rel="noreferrer">
            {source.title} ↗
          </a>
          <p>
            {source.publisher} · retrieved {date(source.retrieved_at_utc)}{' '}
            {time(source.retrieved_at_utc)} UTC
          </p>
          <p>Challenge Resources eligibility: {String(source.challenge_resource_eligible)}</p>
          <code>SHA-256 {source.sha256}</code>
        </article>
      ))}
      <h3>03 / Sampling & checks</h3>
      <p>
        35-day discovery scan: 14 November–19 December 2026, hourly, inclusive. The first discovered
        crossing was selected for a 10-minute refinement across both sites and bodies; this is an
        illustrative event, not a claim of typical conditions. No interpolated readings.
      </p>
      <p>
        Numerical boundary tolerance: ±{r.epsilon_deg}°. This classifies source values and is not an
        accuracy or uncertainty estimate. Crossings are brackets between samples.
      </p>
      {r.validation.reference_checks.map((check) => (
        <p key={check.run_id}>
          {check.site_id}: {check.kind}. Maximum checked angle difference:{' '}
          {check.max_angle_difference_deg}°.
        </p>
      ))}
      <h3>04 / Reproducibility</h3>
      <p>
        {r.release_id}
        <br />
        Schema {r.schema_version} · generated {r.generated_at_utc}
      </p>
      <a className={s.download} href="/data/release.json" download>
        Download scientific release ↓
      </a>
      <a className={s.download} href="/data/evidence.zip" download>
        Download raw evidence archive ↓
      </a>
      <details>
        <summary>Exact queries, raw hashes & run lineage</summary>
        {r.runs.map((run) => (
          <div className={s.source} key={run.run_id}>
            <a href={run.request_url} target="_blank" rel="noreferrer">
              {run.run_id} ↗
            </a>
            <code>{JSON.stringify(run.horizons_query_parameters, null, 2)}</code>
            <code>SHA-256 {run.raw_sha256}</code>
            <p>Retrieved {run.retrieved_at_utc}</p>
          </div>
        ))}
      </details>
      <h3>05 / Open limitations</h3>
      <ul>
        {r.validation.limitations.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
      <p>
        Independent educational project. NASA/JPL provide cited data; they do not endorse this
        interface. Built with React, Vite, TypeScript, Python and Codex assistance. Original vector
        artwork; no generated imagery.
      </p>
    </dialog>
  );
}

function Explorer({ r }: { r: Release }) {
  const [a, setA] = useState(r.sites[0].id),
    [b, setB] = useState(r.sites[1].id),
    [index, setIndex] = useState(0),
    [mobile, setMobile] = useState('A'),
    [evidence, setEvidence] = useState(false),
    [mode, setMode] = useState<'coarse' | 'refined'>('coarse');
  const evidenceTrigger = useRef<HTMLButtonElement>(null);
  const rows = mode === 'coarse' ? r.samples : r.refined_samples;
  const clock = useMemo(
    () =>
      mode === 'coarse'
        ? r.timestamps
        : [...new Set(r.refined_samples.map((s) => s.timestamp_utc))].sort(),
    [r, mode],
  );
  const selected = Math.min(index, clock.length - 1),
    t = clock[selected];
  const siteA = r.sites.find((site) => site.id === a)!,
    siteB = r.sites.find((site) => site.id === b)!;
  const matrix = useMemo(
    () => new Map(rows.map((row) => [`${row.site_id}/${row.body_id}/${row.timestamp_utc}`, row])),
    [rows],
  );
  const tracks = (id: string, body: number | string) =>
    clock.map((stamp) =>
      body === 'both'
        ? both(
            classify(matrix.get(`${id}/10/${stamp}`)?.elevation_deg ?? null),
            classify(matrix.get(`${id}/399/${stamp}`)?.elevation_deg ?? null),
          )
        : classify(matrix.get(`${id}/${body}/${stamp}`)?.elevation_deg ?? null),
    );
  const aStates = [10, 399].map((body) => classify(lookup(rows, a, body, t).elevation_deg)),
    bStates = [10, 399].map((body) => classify(lookup(rows, b, body, t).elevation_deg));
  const same = aStates.every((value, i) => value === bStates[i]);
  const events = [...(mode === 'coarse' ? r.crossings : r.refined_crossings)]
    .filter((e) => e.site_id === a || e.site_id === b)
    .sort((a, b) => a.end_utc.localeCompare(b.end_utc));
  const nextEvent = () => {
    const relevant = events.filter((e) => e.site_id === a || e.site_id === b);
    const event = relevant.find((e) => e.end_utc > t) ?? relevant[0];
    if (event) setIndex(clock.indexOf(event.end_utc));
  };
  const changeMode = (m: 'coarse' | 'refined') => {
    setMode(m);
    setIndex(0);
  };
  return (
    <>
      <header className={s.header}>
        <a className={s.brand} href="#main">
          <Mark />
          <span>
            RIMWAKE<small>LUNAR VISIBILITY INSTRUMENT</small>
          </span>
        </a>
        <div className={s.headerRight}>
          <span className={s.releaseTag}>P0 / GEOMETRIC MODEL</span>
          <button ref={evidenceTrigger} onClick={() => setEvidence(true)}>
            Evidence & method <span>↗</span>
          </button>
        </div>
      </header>
      <main id="main">
        <section className={s.intro}>
          <div>
            <p className={s.eyebrow}>
              <span className={s.statusDot} /> NASA / JPL DATA · INDEPENDENT PROJECT
            </p>
            <h1>
              Two places.
              <br />
              <span>One lunar sky.</span>
            </h1>
          </div>
          <div className={s.introAside}>
            <p>
              On the Moon, a small change of place
              <br className={s.desktopBreak} /> changes the view of the Sun and Earth.
            </p>
            <p className={s.muted}>
              Compare two southern lunar locations on one clock. Follow the geometry. Inspect the
              evidence.
            </p>
            <a href="#instrument">
              Explore the instrument <span>↓</span>
            </a>
          </div>
          <span className={s.edition}>FIELD STUDY 001 / SOUTHERN MOON</span>
        </section>
        <section className={s.instrument} id="instrument" aria-label="Lunar visibility explorer">
          <div className={s.instrumentBar}>
            <div>
              <span className={s.tinyCross}>+</span> THE SHARED SKY{' '}
              <span className={s.muted}>/ OVERHEAD PROJECTION</span>
            </div>
            <span className={s.modelNote}>Geometric horizon · terrain excluded</span>
          </div>
          <div className={s.controls}>
            {[
              ['A', a, setA],
              ['B', b, setB],
            ].map(([slot, value, setter]) => (
              <label key={String(slot)}>
                <span>OBSERVATION SITE {String(slot)}</span>
                <select
                  aria-label={`Observation site ${slot}`}
                  value={String(value)}
                  onChange={(e) => (setter as (id: string) => void)(e.target.value)}
                >
                  {r.sites.map((site) => (
                    <option key={site.id} value={site.id}>
                      {site.name}
                    </option>
                  ))}
                </select>
              </label>
            ))}
            <div className={s.clock}>
              <span>SYNCHRONIZED UTC</span>
              <strong data-testid="selected-utc">
                {date(t)} <em>{time(t)}</em>
              </strong>
            </div>
          </div>
          <div className={s.topTransport}>
            <div className={s.timelineControl}>
              <button
                aria-label="Previous sample"
                disabled={selected === 0}
                onClick={() => setIndex(selected - 1)}
              >
                ←
              </button>
              <label className={s.rangeLabel}>
                <span className={s.srOnly}>UTC sample</span>
                <input
                  type="range"
                  aria-label="UTC sample"
                  min="0"
                  max={clock.length - 1}
                  value={selected}
                  onChange={(e) => setIndex(Number(e.target.value))}
                  aria-valuetext={`${date(t)} ${time(t)} UTC`}
                />
              </label>
              <button
                aria-label="Next sample"
                disabled={selected === clock.length - 1}
                onClick={() => setIndex(selected + 1)}
              >
                →
              </button>
              <button className={s.eventButton} disabled={!events.length} onClick={nextEvent}>
                {events.length ? 'Next crossing ↗' : 'No crossings'}
              </button>
            </div>
            <div className={s.transportCaption}>
              <span>{date(clock[0])}</span>
              <span>{mode === 'coarse' ? '60' : '10'}-minute samples / UTC</span>
              <span>{date(clock.at(-1)!)}</span>
            </div>
          </div>
          <div className={s.mobileSwitch} aria-label="Displayed site">
            <button aria-pressed={mobile === 'A'} onClick={() => setMobile('A')}>
              A / {siteA.name.split(' · ')[0]}
            </button>
            <button aria-pressed={mobile === 'B'} onClick={() => setMobile('B')}>
              B / {siteB.name.split(' · ')[0]}
            </button>
          </div>
          <div className={s.skies}>
            <Sky site={siteA} rows={rows} t={t} slot="A" active={mobile === 'A'} />
            <Sky site={siteB} rows={rows} t={t} slot="B" active={mobile === 'B'} />
          </div>
          <div className={s.comparison} role="status">
            <span className={s.comparisonSymbol}>{same ? '=' : '≠'}</span>
            <div>
              <strong>
                {same
                  ? 'Same horizon states. Different angles.'
                  : 'One instant. Different horizon states.'}
              </strong>
              <p>
                {a === b
                  ? 'Both observations use the same site and shared sample.'
                  : same
                    ? 'Sun and Earth have the same above/below classification at these sites at this sample.'
                    : 'At least one body has a different tangent-plane classification between these sites.'}{' '}
                {aStates.includes('unknown') || bStates.includes('unknown')
                  ? 'Some data are unknown.'
                  : 'Read the exact angles above.'}
              </p>
            </div>
            <span className={s.comparisonTime}>
              {time(t)} UTC
              <br />
              <small>EXACT SAMPLE</small>
            </span>
          </div>
          <section className={s.loom} aria-label="Horizon Loom">
            <div className={s.loomHead}>
              <div>
                <p className={s.eyebrow}>READ THE WINDOWS</p>
                <h2>
                  Horizon Loom<span> / {mode === 'coarse' ? '35 days' : 'Refined crossing'}</span>
                </h2>
              </div>
              <div className={s.modes}>
                <button aria-pressed={mode === 'coarse'} onClick={() => changeMode('coarse')}>
                  Hourly scan
                </button>
                <button
                  disabled={!r.refined_samples.length}
                  aria-pressed={mode === 'refined'}
                  onClick={() => changeMode('refined')}
                >
                  10-min detail
                </button>
              </div>
            </div>
            <div className={s.timelineTicks}>
              <span>
                {date(clock[0])} {mode === 'refined' ? time(clock[0]) : ''}
              </span>
              <span>
                {date(clock.at(-1)!)} {mode === 'refined' ? time(clock.at(-1)!) : ''} UTC
              </span>
            </div>
            {[
              ['A', a],
              ['B', b],
            ].map(([slot, id]) => (
              <div className={s.loomSite} key={slot}>
                <span className={s.loomSlot}>{slot}</span>
                <div>
                  {[
                    [10, 'Sun', '#e6bd76'],
                    [399, 'Earth', '#9ac6dd'],
                    ['both', 'Both', '#a9c7a2'],
                  ].map(([body, label, color]) => (
                    <div className={s.trackRow} key={label}>
                      <span style={{ color: String(color) }}>{label}</span>
                      <Track
                        states={tracks(id, body)}
                        color={String(color)}
                        selected={selected}
                        onSelect={setIndex}
                        label={`${slot} ${label} sampled visibility`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className={s.loomLegend}>
              <p>
                <span className={s.legendSolid} /> Above tangent plane{' '}
                <span className={s.legendMuted} /> Below tangent plane{' '}
                <span className={s.legendBoundary} /> Boundary / unknown
              </p>
              <p>
                {clock.length} samples · {mode === 'coarse' ? '60' : '10'}-minute cadence · no
                interpolation
              </p>
            </div>
            <p className={s.bracketNote}>
              {events.length
                ? `${events.length} crossing brackets in this ${mode === 'coarse' ? '35-day scan' : 'refined window'}. A crossing occurs between samples; its exact time is unresolved.`
                : 'No crossing brackets were detected in this window.'}{' '}
              Bright tracks show sampled states, not continuous visibility guarantees.
            </p>
          </section>
          <div className={s.instrumentFoot}>
            <span>HYPOTHETICAL OBSERVERS / 0 KM ABOVE REFERENCE ELLIPSOID</span>
            <span>SOURCE: JPL HORIZONS · PROVISIONAL GEOMETRY</span>
          </div>
        </section>
        <section className={s.notes}>
          <span className={s.eyebrow}>KNOW THE LIMITS</span>
          <h2>The horizon is a beginning.</h2>
          <p>
            This instrument compares a geometric tangent plane. Crater rims and local relief can
            change what is visible, but terrain is excluded from this release. Above-horizon
            geometry alone does not establish solar power or a working radio link.
          </p>
          <button onClick={() => setEvidence(true)}>
            Open the evidence register <span>↗</span>
          </button>
        </section>
      </main>
      <footer className={s.footer}>
        <a className={s.footerBrand} href="#main">
          RIMWAKE
        </a>
        <p>Rim: the landscape. Wake: what the geometry reveals.</p>
        <span>INDEPENDENT EDUCATIONAL EXPLORER / 2026</span>
      </footer>
      {evidence && <Evidence r={r} onClose={() => setEvidence(false)} />}
    </>
  );
}

export default function App() {
  const [release, setRelease] = useState<Release | null>(null),
    [error, setError] = useState(false),
    [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setError(false);
    Promise.all([
      fetch('/data/release.json', { signal: controller.signal }),
      fetch('/data/manifest.json', { signal: controller.signal }),
    ])
      .then(async ([response, manifestResponse]) => {
        if (!response.ok || !manifestResponse.ok) throw Error('Unavailable');
        const [bytes, manifest] = await Promise.all([
          response.arrayBuffer(),
          manifestResponse.json(),
        ]);
        const hash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))]
          .map((v) => v.toString(16).padStart(2, '0'))
          .join('');
        const data = releaseSchema.parse(JSON.parse(new TextDecoder().decode(bytes)));
        if (
          hash !== manifest.release_sha256 ||
          data.release_id !== manifest.release_id ||
          data.schema_version !== manifest.schema_version
        )
          throw Error('Release integrity failed');
        setRelease(data);
      })
      .catch((e) => {
        if (e.name !== 'AbortError') setError(true);
      });
    return () => controller.abort();
  }, [attempt]);
  if (error)
    return (
      <main className={s.fallback}>
        <Mark />
        <h1>Data unavailable.</h1>
        <p>
          Release validation failed or the scientific archive could not be loaded. No astronomical
          readings are shown.
        </p>
        <button onClick={() => setAttempt(attempt + 1)}>Retry data loading</button>
      </main>
    );
  if (!release)
    return (
      <main className={s.fallback} aria-busy="true">
        <Mark />
        <h1>RIMWAKE</h1>
        <p>Opening the scientific archive…</p>
        <div className={s.skeleton} />
      </main>
    );
  return <Explorer r={release} />;
}
