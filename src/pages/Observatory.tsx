import { lazy, Suspense, useState } from 'react';
import { useObservation } from '../lib/useObservation';
import { bearing, date, time, signed, shortName } from '../lib/format';
import { stateFor, plotLimit } from '../lib/selectors';
import { stateLabel } from '../science';
import { supportsWebGL, useMedia } from '../cinema/preferences';
import { Link } from '../lib/router';
import { Dialog } from '../components/Shell';
import Evidence from '../components/Evidence';
import SkyInstrument from '../components/SkyInstrument';
import HorizonLoom from '../components/HorizonLoom';
import s from './Observatory.module.css';
import SceneGuard from '../cinema/SceneGuard';
const Scene = lazy(() => import('../cinema/ObservationScene'));
export default function Observatory() {
  const o = useObservation();
  const [evidence, setEvidence] = useState(false),
    [sites, setSites] = useState(false),
    [numeric, setNumeric] = useState(false),
    [timeline, setTimeline] = useState(false),
    [difference, setDifference] = useState(false);
  const [capable] = useState(supportsWebGL);
  const reduced = useMedia('(prefers-reduced-motion:reduce)');
  const [sceneFailed, setSceneFailed] = useState(false);
  const spatial = capable && !reduced && !numeric && !sceneFailed;
  const { r, a, b, t, records, selection, setSelection } = o;
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
      ? 'Same site. Same sampled sky.'
      : o.same
        ? 'Same states. Different angles.'
        : 'One moment. Different horizon states.';
  return (
    <main
      id="main"
      tabIndex={-1}
      className={`${s.observatory} dark`}
      data-release-id={r.release_id}
    >
      <header className={s.heading}>
        <div>
          <p className="eyebrow">YOUR LOCAL SKY</p>
          <h1>CHANGE YOUR VIEW.</h1>
        </div>
        <div className={s.tools}>
          <button onClick={() => setSites(true)}>
            Choose places <span>↗</span>
          </button>
          <button onClick={() => setEvidence(true)}>
            Evidence & method <span>↗</span>
          </button>
        </div>
      </header>
      <div className={s.contextLine}>
        <span>Geometric horizon · terrain excluded</span>
        <span>Source-backed / science provisional</span>
      </div>
      {o.notice && (
        <div className={s.notice}>
          <p>{o.notice}</p>
          <button onClick={() => o.setNotice('')} aria-label="Dismiss notice">
            ×
          </button>
        </div>
      )}
      <div className={s.mobileSwitch}>
        <button
          aria-pressed={selection.mobile === 'A'}
          onClick={() => setSelection((p) => ({ ...p, mobile: 'A' }))}
        >
          A / {shortName(a.name)}
        </button>
        <button
          aria-pressed={selection.mobile === 'B'}
          onClick={() => setSelection((p) => ({ ...p, mobile: 'B' }))}
        >
          B / {shortName(b.name)}
        </button>
      </div>
      <div className={s.mobileTime}>
        SHARED UTC{' '}
        <strong>
          {date(t)} {time(t)}
        </strong>
      </div>
      <section className={s.workspace} aria-label="Two synchronized local skies">
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
                    <Scene records={records[i]} onFailure={() => setSceneFailed(true)} />
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
                    <th>AZIMUTH</th>
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
      <section className={s.transport} aria-label="Shared observation time">
        <div className={s.clock}>
          <span>SHARED UTC</span>
          <strong data-testid="selected-utc">
            {date(t)} <em>{time(t)}</em>
          </strong>
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
          <button disabled={!o.events.length} onClick={o.nextCrossing}>
            {o.events.length ? 'Next crossing ↗' : 'No crossings'}
          </button>
        </div>
        <div className={s.sampling}>
          <span>
            {selection.mode === 'coarse' ? 'Hourly scan' : 'Ten-minute detail'} · {o.selected + 1} /{' '}
            {o.clock.length}
          </span>
          <button
            aria-label="Swap A and B"
            onClick={() => setSelection((p) => ({ ...p, a: p.b, b: p.a }))}
          >
            Swap A and B ⇄
          </button>
        </div>
      </section>
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
                  : 'The Sun or Earth has a different above/below-plane classification between these two places.'}
          </p>
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
          <button aria-pressed={numeric} onClick={() => setNumeric(!numeric)}>
            {numeric ? 'Spatial' : 'Calibrated 2D'} view <span>↗</span>
          </button>
        ) : (
          <span className={s.fallbackNote}>Calibrated 2D view active</span>
        )}
        <div className={s.modes}>
          <button aria-pressed={selection.mode === 'coarse'} onClick={() => o.changeMode('coarse')}>
            Hourly scan
          </button>
          <button
            aria-pressed={selection.mode === 'refined'}
            disabled={!r.refined_samples.length}
            onClick={() => o.changeMode('refined')}
          >
            10-min detail
          </button>
        </div>
      </div>
      {timeline && (
        <HorizonLoom
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
        <Dialog title="Choose observers" onClose={() => setSites(false)}>
          <h2 className={s.dialogHeading}>
            TWO PLACES.
            <br />
            YOUR PERSPECTIVE.
          </h2>
          <p>
            Approximate reported landing coordinates, used as hypothetical observers at zero
            reference-ellipsoid height.
          </p>
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
          <button className="primaryButton" onClick={() => setSites(false)}>
            Compare these observers ↗
          </button>
        </Dialog>
      )}
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
                <dd>
                  {signed(
                    o.states.flat().includes('unknown')
                      ? null
                      : records[1][i].elevation_deg! - records[0][i].elevation_deg!,
                  )}
                </dd>
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
