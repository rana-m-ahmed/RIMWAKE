import { useState } from 'react';
import { addHours, utcLabel, type Analysis, type Index, type Request, type State } from './model';
import s from './Mission.module.css';
const colors: Record<State, string> = {
  visible: '#d7b779',
  blocked: '#34444f',
  boundary: '#f4eee2',
  unknown: 'url(#atlas-unknown)',
};
function Strip({ states, id }: { states: State[]; id: string }) {
  const paths = new Map<string, string>();
  states.forEach((state, i) => paths.set(state, (paths.get(state) ?? '') + `M${i} 0h.92v12h-.92Z`));
  return (
    <svg viewBox={`0 0 ${states.length} 12`} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <pattern
          id={`atlas-unknown-${id.replaceAll(' ', '-')}`}
          width="3"
          height="3"
          patternUnits="userSpaceOnUse"
        >
          <path d="M0 3L3 0" stroke="#c3cdd3" strokeWidth="1" />
        </pattern>
      </defs>
      {[...paths].map(([state, d]) => (
        <path
          key={state}
          d={d}
          fill={
            state === 'unknown'
              ? `url(#atlas-unknown-${id.replaceAll(' ', '-')})`
              : colors[state as State]
          }
        />
      ))}
      <title>{id}</title>
    </svg>
  );
}
export default function Timeline({
  analysis,
  index,
  patch,
  pending,
}: {
  analysis: Analysis;
  index: Index;
  patch: (c: Partial<Request>) => void;
  pending: boolean;
}) {
  const { request: r } = analysis,
    [zoom, setZoom] = useState(false);
  const start = zoom ? Math.max(0, r.elapsed - 12) : 0,
    end = zoom ? Math.min(r.hours, Math.max(24, r.elapsed + 12)) : r.hours;
  const focus = r.focus === 'A' ? 0 : 1;
  const events = analysis.summaries
    .filter((x) => x.scenario === r.scenario)
    [focus].crossings.filter((e) => e.end > analysis.utc);
  const next = () => {
    const event = events[0];
    if (event)
      patch({
        elapsed:
          (Date.parse(event.end) -
            Date.parse(addHours(r.start, r.scenario === 'delayed' ? r.delay : 0))) /
          3600000,
      });
  };
  return (
    <section className={s.timeline} aria-label="Mission timeline">
      <div className={s.timelineHeading}>
        <div>
          <p className="eyebrow">FOLLOW THE WINDOW</p>
          <h2>TIME CHANGES THE COMPARISON.</h2>
        </div>
        <label>
          Show{' '}
          <select
            aria-label="Timeline condition"
            value={r.layer}
            onChange={(e) => patch({ layer: e.target.value as Request['layer'] })}
          >
            <option value="joint">Sun &amp; Earth above</option>
            <option value="sun">Sun above</option>
            <option value="earth">Earth above</option>
          </select>
        </label>
      </div>
      <div className={s.overview}>
        <span>90-DAY ARCHIVE / JOINT STATES</span>
        <div className={s.overviewTracks}>
          {analysis.overview.map((states, i) => (
            <div key={i}>
              <b>{i ? 'B' : 'A'}</b>
              <Strip states={states} id={`Archive ${i ? 'B' : 'A'}`} />
            </div>
          ))}
          <span
            className={s.windowMark}
            style={{
              left: `${(100 * (Date.parse(r.start) - Date.parse(index.start_utc))) / (Date.parse(index.end_utc) - Date.parse(index.start_utc))}%`,
              width: `${(100 * r.hours) / (index.timestamps.length - 1)}%`,
            }}
          />
        </div>
      </div>
      <label className={s.archiveBrush}>
        Move the mission window{' '}
        <input
          type="range"
          aria-label="Mission start within archive"
          min="0"
          max={2160 - r.hours - r.delay}
          step="1"
          value={(Date.parse(r.start) - Date.parse(index.start_utc)) / 3600000}
          onChange={(e) =>
            patch({ start: addHours(index.start_utc, Number(e.target.value)), elapsed: 0 })
          }
        />
      </label>
      <div className={s.timelineAxis}>
        <span>MISSION ELAPSED / HOURS</span>
        <button onClick={() => setZoom(!zoom)}>
          {zoom ? 'Show full window' : 'Zoom around cursor'}
        </button>
      </div>
      <div className={s.trackLabels}>
        <span>SCENARIO / PLACE</span>
        <span>{start} h</span>
        <span>{end} h</span>
      </div>
      {analysis.tracks.map((track) => (
        <button
          key={track.slot + track.scenario}
          className={`${s.trackRow} ${r.scenario === track.scenario ? s.currentTrack : ''}`}
          onClick={(event) => {
            const box = event.currentTarget.querySelector('svg')!.getBoundingClientRect();
            const elapsed = Math.max(
              start,
              Math.min(
                end,
                Math.round(start + ((event.clientX - box.left) / box.width) * (end - start)),
              ),
            );
            patch({ scenario: track.scenario, elapsed });
          }}
        >
          <span>
            <b>{track.slot}</b> {track.scenario === 'baseline' ? 'Original' : 'Delayed'}
            <small>{utcLabel(track.start, true)} UTC</small>
          </span>
          <div>
            <Strip states={track.states.slice(start, end + 1)} id={track.slot + track.scenario} />
            {r.elapsed >= start && r.elapsed <= end && (
              <i
                className={s.playhead}
                style={{ left: `${(100 * (r.elapsed - start)) / (end - start || 1)}%` }}
              />
            )}
          </div>
        </button>
      ))}
      <div className={s.timelineTransport}>
        <label>
          Inspect mission hour{' '}
          <input
            type="range"
            aria-label="Inspection hour"
            min="0"
            max={r.hours}
            value={r.elapsed}
            onChange={(e) => patch({ elapsed: Number(e.target.value) })}
          />
        </label>
        <button onClick={next} disabled={!events.length || pending}>
          Next crossing at {r.focus} <span aria-hidden="true">{String.fromCharCode(8599)}</span>
        </button>
      </div>
      <div className={s.timelineLegend}>
        <span>
          <i /> Above at sampled time
        </span>
        <span>
          <i /> Below
        </span>
        <span>
          <i /> Numerical boundary
        </span>
        <span>
          <i /> Unknown
        </span>
      </div>
      <p className={s.smallPrint}>
        Hourly samples. Each window includes both endpoints. Colored runs do not establish
        continuous sunlight or a working radio link. Crossings are brackets, not exact instants.
      </p>
    </section>
  );
}
