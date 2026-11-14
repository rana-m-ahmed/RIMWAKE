import { lazy, Suspense, useState } from 'react';
import { useObservation } from '../lib/useObservation';
import { bearing, date, time, signed, shortName } from '../lib/format';
import { stateFor, plotLimit } from '../lib/selectors';
import { stateLabel } from '../science';
import { useWebGLCapability, useMedia } from '../cinema/preferences';
import { Link } from '../lib/router';
import { Dialog } from '../components/Shell';
import Evidence from '../components/Evidence';
import SkyInstrument from '../components/SkyInstrument';
import HorizonLoom from '../components/HorizonLoom';
import s from './Observatory.module.css';
import SceneGuard from '../cinema/SceneGuard';
import PolarMap from '../components/PolarMap';
import {
  GuidedDiscovery,
  ObservationFinder,
  ObservationExport,
} from '../components/DiscoveryTools';
import { elevationDifference } from '../lib/observations';
import ObservatoryLoading from '../components/ObservationLoading';
import { ChooseUTC, InstrumentHelp } from '../components/Understanding';
const Scene = lazy(() => import('../cinema/ObservationScene'));
export default function Observatory() {
  const o = useObservation();
  const [evidence, setEvidence] = useState(false),
    [sites, setSites] = useState(false),
    [finder, setFinder] = useState(false),
    [sharing, setSharing] = useState(false),
    [choosingTime, setChoosingTime] = useState(false),
    [timeline, setTimeline] = useState(true),
    [difference, setDifference] = useState(false);
  const reduced = useMedia('(prefers-reduced-motion:reduce)');
  const capable = useWebGLCapability(!reduced);
  const [sceneFailed, setSceneFailed] = useState(false);
  const spatial =
    capable !== false && !reduced && o.selection.view !== 'calibrated' && !sceneFailed;
  const { r, a, b, t, records, selection, setSelection } = o;
  if ((!r || !a || !b) && o.status !== 'error') return <ObservatoryLoading />;
  if (!r || !a || !b)
    return (
      <main id="main" tabIndex={-1} className={s.unavailable}>
        <p className="eyebrow">The observation archive</p>
        <h1>{o.status === 'error' ? 'Data unavailable.' : 'Opening your sky.'}</h1>
        <p>
          {o.status === 'error'
            ? 'The source release could not be loaded or failed validation. No readings are estimated.'
            : 'Checking the scientific release before displaying any measurements.'}
        </p>
        {o.status === 'error' && (
          <button className="primaryButton" onClick={o.retry}>
            Retry data loading ↗
          </button>
        )}
        <Link href="/sources" className="quietLink">
          Read the sources ↗
        </Link>
      </main>
    );
  const summary = o.unknown
    ? 'Some observations are unknown.'
    : a.id === b.id
      ? 'Same site. Same modeled sky.'
      : o.same
        ? 'Same pattern. Different angles.'
        : 'These places have different views.';
  return (
    <main
      id="main"
      tabIndex={-1}
      className={`${s.observatory} dark`}
      data-release-id={r.release_id}
    >
      <header className={s.heading}>
        <div>
          <p className="eyebrow">TWO PLACES / ONE SHARED TIME</p>
          <h1>COMPARE THE SKIES.</h1>
        </div>
        <div className={s.tools}>
          <button onClick={() => setSites(true)}>
            Choose places <span>↗</span>
          </button>
          <button
            className={s.desktopSwap}
            aria-label="Swap A and B"
            onClick={() => setSelection((p) => ({ ...p, a: p.b, b: p.a }))}
          >
            Swap A and B
          </button>
          <button onClick={() => setEvidence(true)}>
            Evidence & method <span>↗</span>
          </button>
        </div>
      </header>
      <div className={s.contextLine}>
        <span>
          Geometric model · terrain excluded{' '}
          <span className={s.mobileModelStatus}>&middot; science provisional</span>
        </span>
        <span className={s.modelStatus}>Source-backed / science provisional</span>
      </div>
      {o.notice && (
        <div className={s.notice}>
          <p>{o.notice}</p>
          <button onClick={() => o.setNotice('')} aria-label="Dismiss notice">
            ×
          </button>
        </div>
      )}
      <GuidedDiscovery
        o={o}
        onEvidence={() => setEvidence(true)}
        onPlaces={() => setSites(true)}
        onFind={() => setFinder(!finder)}
        onShare={() => setSharing(true)}
      />
      {finder && (
        <ObservationFinder o={o} onClose={() => setFinder(false)} onPlaces={() => setSites(true)} />
      )}
      <section className={s.transport} aria-label="Shared observation time">
        <div className={s.clock}>
          <span>
            SHARED UTC
            <small className={s.sampleCount}>
              Sample {o.selected + 1} of {o.clock.length}
            </small>
          </span>
          <button className={s.clockPick} onClick={() => setChoosingTime(true)}>
            <strong data-testid="selected-utc" data-utc={t}>
              {date(t)} <em>{time(t)}</em>
            </strong>
            <small>
              Change UTC <span aria-hidden="true">{String.fromCharCode(8599)}</span>
            </small>
          </button>
        </div>
        <div className={s.sliderRow}>
          <button
            aria-label="Previous sample"
            disabled={o.selected === 0}
            onClick={() => o.sample(o.selected - 1)}
          >
            ←
          </button>
          <input
            onPointerUp={o.flushURL}
            onKeyUp={o.flushURL}
            onBlur={o.flushURL}
            aria-label="UTC sample"
            type="range"
            min="0"
            max={o.clock.length - 1}
            value={o.selected}
            aria-valuetext={`${date(t)} ${time(t)} UTC`}
            onChange={(event) => o.sample(Number(event.target.value))}
          />
          <button
            aria-label="Next sample"
            disabled={o.selected === o.clock.length - 1}
            onClick={() => o.sample(o.selected + 1)}
          >
            →
          </button>
        </div>
        <div className={s.sampling}>
          <label className="srOnly" htmlFor="sampling-window">
            Sampling window
          </label>
          <select
            id="sampling-window"
            aria-label="Sampling window"
            className={s.windowSelect}
            value={selection.mode}
            onChange={(e) => o.changeMode(e.target.value as 'coarse' | 'refined')}
          >
            <option value="coarse">Hourly scan</option>
            <option value="refined" disabled={!r.refined_samples.length}>
              10-min detail
            </option>
          </select>
          <button className={s.crossingButton} disabled={!o.events.length} onClick={o.nextCrossing}>
            {o.events.length ? 'Next crossing' : 'No crossings'}{' '}
            <span aria-hidden="true">{String.fromCharCode(8599)}</span>
          </button>
        </div>
      </section>
      <div className={s.mobileSwitch}>
        <button
          aria-pressed={selection.mobile === 'A'}
          onClick={() => setSelection((p) => ({ ...p, mobile: 'A' }))}
        >
          A / {shortName(a.name)}
          <small>
            <span className="sun">
              Sun{' '}
              {o.states[0][0] === 'visible'
                ? 'above'
                : o.states[0][0] === 'blocked'
                  ? 'below'
                  : o.states[0][0] === 'boundary'
                    ? 'at boundary'
                    : 'unknown'}
            </span>
            <span className="earth">
              Earth{' '}
              {o.states[0][1] === 'visible'
                ? 'above'
                : o.states[0][1] === 'blocked'
                  ? 'below'
                  : o.states[0][1] === 'boundary'
                    ? 'at boundary'
                    : 'unknown'}
            </span>
          </small>
        </button>
        <button
          aria-pressed={selection.mobile === 'B'}
          onClick={() => setSelection((p) => ({ ...p, mobile: 'B' }))}
        >
          B / {shortName(b.name)}
          <small>
            <span className="sun">
              Sun{' '}
              {o.states[1][0] === 'visible'
                ? 'above'
                : o.states[1][0] === 'blocked'
                  ? 'below'
                  : o.states[1][0] === 'boundary'
                    ? 'at boundary'
                    : 'unknown'}
            </span>
            <span className="earth">
              Earth{' '}
              {o.states[1][1] === 'visible'
                ? 'above'
                : o.states[1][1] === 'blocked'
                  ? 'below'
                  : o.states[1][1] === 'boundary'
                    ? 'at boundary'
                    : 'unknown'}
            </span>
          </small>
        </button>
        <button
          className={s.mobileSwap}
          aria-label="Swap A and B"
          onClick={() => setSelection((p) => ({ ...p, a: p.b, b: p.a }))}
        >
          <span aria-hidden="true">&#8644;</span>
        </button>
      </div>
      <div className={s.mobileTime}>
        SHARED UTC{' '}
        <strong>
          {date(t)} {time(t)}
        </strong>
      </div>
      <section
        id="sky-workspace"
        tabIndex={-1}
        className={s.workspace}
        aria-label="Two synchronized local skies"
      >
        {[a, b].map((site, i) => (
          <section
            key={i}
            className={`${s.view} ${selection.mobile === (i === 0 ? 'A' : 'B') ? s.active : ''}`}
            aria-label={`Viewpoint ${i === 0 ? 'A' : 'B'}: ${site.name}`}
          >
            <header className={s.viewHead}>
              <div>
                <span>{i === 0 ? 'A' : 'B'}</span>
                <h2>{shortName(site.name)}</h2>
              </div>
              <p>
                {Math.abs(site.latitude_deg)}° S · {site.longitude_deg_east}° E
              </p>
            </header>
            <div className={s.scene}>
              {spatial ? (
                <Suspense fallback={<div className={s.sceneLoading}>Opening direction view…</div>}>
                  <SceneGuard onFailure={() => setSceneFailed(true)}>
                    {capable === true ? (
                      <Scene records={records[i]} onFailure={() => setSceneFailed(true)} />
                    ) : (
                      <div className={s.sceneLoading}>Opening direction view...</div>
                    )}
                  </SceneGuard>
                </Suspense>
              ) : (
                <SkyInstrument
                  site={site}
                  records={records[i]}
                  slot={i === 0 ? 'A' : 'B'}
                  limit={plotLimit(r)}
                  epsilon={r.epsilon_deg}
                  active
                />
              )}
              <span className={s.sceneHint}>
                {spatial ? 'LOCAL DIRECTION VIEW / REFERENCE PLANE' : 'CALIBRATED SIGNED VIEW'}
              </span>
            </div>
            {spatial && (
              <table className={s.readings}>
                <caption className="srOnly">Exact sampled angles at {site.name}</caption>
                <thead>
                  <tr>
                    <th>BODY / STATE</th>
                    <th>ELEVATION</th>
                    <th>BEARING</th>
                  </tr>
                </thead>
                <tbody>
                  {records[i].map((row) => (
                    <tr key={row.body_id}>
                      <th>
                        <span className={row.body_id === 10 ? 'sun' : 'earth'}>
                          {row.body_id === 10 ? 'Sun' : 'Earth'}
                        </span>
                        <small>{stateLabel(stateFor(row, r.epsilon_deg))}</small>
                      </th>
                      <td
                        className={`${row.body_id === 10 ? 'sun' : 'earth'} ${row.quality_state !== 'available' ? s.missing : ''}`}
                        data-testid={`${i === 0 ? 'A' : 'B'}-${row.body_id}-elevation`}
                      >
                        {signed(row.quality_state === 'available' ? row.elevation_deg : null)}
                      </td>
                      <td>{bearing(row.quality_state === 'available' ? row.azimuth_deg : null)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        ))}
      </section>
      <InstrumentHelp />
      <section className={s.interpretation} role="status" data-testid="comparison-summary">
        <div>
          <h2>{summary}</h2>
          <p>
            {a.id === b.id
              ? 'Both viewpoints use the same site and shared sample.'
              : o.unknown
                ? 'Unavailable records are not estimated.'
                : o.same
                  ? 'Both sites share the same geometric classifications. Their exact angles may differ.'
                  : [10, 399]
                      .map(
                        (body, i) =>
                          `${body === 10 ? 'Sun' : 'Earth'}: ${stateLabel(o.states[0][i]).toLowerCase()} at A; ${stateLabel(o.states[1][i]).toLowerCase()} at B.`,
                      )
                      .join(' ')}
          </p>
        </div>
        <div className={s.inlineDeltas}>
          {[10, 399].map((body, i) => (
            <div key={body}>
              <span>{body === 10 ? 'SUN' : 'EARTH'} / B MINUS A</span>
              <strong className={body === 10 ? 'sun' : 'earth'}>
                {signed(elevationDifference(records[0][i], records[1][i]))}
              </strong>
            </div>
          ))}
        </div>
        <button onClick={() => setDifference(true)}>Understand the difference ↗</button>
      </section>
      {o.bracket && (
        <p className={s.bracket}>
          Crossing bracket:{' '}
          {o.bracket.split(' / ').map((v, i) => (
            <span key={v}>
              {i ? ' — ' : ''}
              {date(v)} {time(v)} UTC
            </span>
          ))}
          . Exact crossing time is unresolved.
        </p>
      )}
      <div className={s.secondary}>
        <button aria-pressed={timeline} onClick={() => setTimeline(!timeline)}>
          {timeline ? 'Hide' : 'Show'} Horizon Loom <span>{timeline ? '−' : '+'}</span>
        </button>
        {capable && !reduced && !sceneFailed ? (
          <button
            aria-pressed={selection.view === 'calibrated'}
            onClick={() =>
              setSelection((p) => ({
                ...p,
                view: p.view === 'calibrated' ? 'spatial' : 'calibrated',
              }))
            }
          >
            {selection.view === 'calibrated' ? 'Spatial' : 'Calibrated 2D'} view <span>↗</span>
          </button>
        ) : (
          <span className={s.fallbackNote}>Calibrated 2D view active</span>
        )}
      </div>
      {timeline && (
        <HorizonLoom
          showModes={false}
          crossingBands={(['A', 'B'] as const).flatMap((slot) =>
            o.events
              .filter((event) => event.site_id === (slot === 'A' ? a.id : b.id))
              .map((event) => ({
                slot,
                kind: event.body_id === 10 ? 'sun' : 'earth',
                start: o.clock.indexOf(event.start_utc),
                end: o.clock.indexOf(event.end_utc),
              })),
          )}
          tracks={o.tracks}
          selected={o.selected}
          onSelect={o.sample}
          clock={o.clock}
          mode={selection.mode}
          onMode={o.changeMode}
          refinedAvailable={!!r.refined_samples.length}
          onEvidence={() => setEvidence(true)}
        />
      )}
      {!o.events.length && (
        <p className={s.bracket}>
          No crossing brackets were detected in this window for the selected sites.
        </p>
      )}
      <p className={s.modelLimit}>
        Hypothetical reference-ellipsoid observers. Above-plane geometry does not establish
        available power or a radio link.{' '}
        <Link href="/field-guide#limits">Understand the limits ↗</Link>
      </p>
      {evidence && (
        <Evidence release={r} records={records.flat()} onClose={() => setEvidence(false)} />
      )}
      {sites && (
        <Dialog wide title="Choose observers" onClose={() => setSites(false)}>
          <h2 className={s.dialogHeading}>CHOOSE YOUR OBSERVERS.</h2>
          <p>Published landing coordinates, used as hypothetical reference-ellipsoid observers.</p>
          <div className={s.mapDialog}>
            <PolarMap
              sites={r.sites}
              a={a.id}
              b={b.id}
              onAssign={(slot, id) =>
                setSelection((p) => ({ ...p, [slot === 'A' ? 'a' : 'b']: id }))
              }
            />
          </div>
          <div className={s.siteSelectors}>
            {(['A', 'B'] as const).map((slot) => (
              <label className={s.siteLabel} key={slot}>
                <span>Observation site {slot}</span>
                <select
                  aria-label={`Observation site ${slot}`}
                  value={slot === 'A' ? a.id : b.id}
                  onChange={(event) =>
                    setSelection((p) => ({ ...p, [slot === 'A' ? 'a' : 'b']: event.target.value }))
                  }
                >
                  {r.sites.map((site) => (
                    <option key={site.id} value={site.id}>
                      {site.name}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
          <button
            className={s.restorePair}
            onClick={() => setSelection((p) => ({ ...p, a: 'im1', b: 'im2' }))}
          >
            Restore Odysseus + Athena
          </button>
          <button className="primaryButton" onClick={() => setSites(false)}>
            Compare these observers ↗
          </button>
        </Dialog>
      )}
      {choosingTime && <ChooseUTC o={o} onClose={() => setChoosingTime(false)} />}
      {sharing && <ObservationExport o={o} onClose={() => setSharing(false)} />}
      {difference && (
        <Dialog title="Meridian difference" onClose={() => setDifference(false)}>
          <h2 className={s.dialogHeading}>{summary}</h2>
          <p>
            At {date(t)} {time(t)} UTC, the difference is elevation at B minus elevation at A.
          </p>
          <dl className={s.deltas}>
            {[10, 399].map((body, i) => (
              <div key={body}>
                <dt>{body === 10 ? 'Sun' : 'Earth'} · Δ elevation B − A</dt>
                <dd>{signed(elevationDifference(records[0][i], records[1][i]))}</dd>
              </div>
            ))}
          </dl>
          <p>
            This is geometric centre-of-disc comparison. It does not identify an obstructing ridge
            or certify power or RF performance.
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
    </main>
  );
}
