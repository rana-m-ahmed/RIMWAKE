import { useEffect, useState } from 'react';
import type { useObservation } from '../lib/useObservation';
import { date, time } from '../lib/format';
import { Dialog } from './Shell';
import s from './Understanding.module.css';
type Observation = ReturnType<typeof useObservation>;
export function ChooseUTC({ o, onClose }: { o: Observation; onClose: () => void }) {
  const [value, setValue] = useState(o.t.slice(0, 16)),
    [error, setError] = useState(''),
    [nearest, setNearest] = useState<number | null>(null);
  useEffect(() => {
    setValue(o.t.slice(0, 16));
    setError('');
    setNearest(null);
  }, [o.t, o.selection.mode]);
  const choose = (index: number) => {
    o.sample(index);
    onClose();
  };
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const milliseconds = Date.parse(value + 'Z');
    if (!Number.isFinite(milliseconds)) {
      setError('Enter a UTC date and time.');
      return;
    }
    const wanted = new Date(milliseconds).toISOString().replace('.000Z', 'Z'),
      index = o.clock.indexOf(wanted);
    if (index >= 0) {
      choose(index);
      return;
    }
    const closest = o.clock.reduce(
      (best, stamp, i) =>
        Math.abs(Date.parse(stamp) - milliseconds) <
        Math.abs(Date.parse(o.clock[best]) - milliseconds)
          ? i
          : best,
      0,
    );
    setNearest(closest);
    setError(
      'There is no released sample at that UTC. No position has been estimated. You can choose the nearest supported time below.',
    );
  };
  return (
    <Dialog title="Choose UTC time" onClose={onClose}>
      <p className="eyebrow">ONE CLOCK FOR BOTH PLACES</p>
      <h2 className={s.title}>CHOOSE YOUR MOMENT.</h2>
      <p>
        Every time in this view is UTC, regardless of your device timezone. Choose an exact released
        sample.
      </p>
      <form noValidate onSubmit={submit}>
        <label className={s.field}>
          Sampling window
          <select
            aria-label="Time chooser sampling window"
            value={o.selection.mode}
            onChange={(e) => o.changeMode(e.target.value as 'coarse' | 'refined')}
          >
            <option value="coarse">Hourly scan</option>
            <option value="refined" disabled={!o.r!.refined_samples.length}>
              Ten-minute detail
            </option>
          </select>
        </label>
        <label className={s.field}>
          UTC date and time
          <input
            type="datetime-local"
            aria-label="UTC date and time"
            value={value}
            min={o.clock[0].slice(0, 16)}
            max={o.clock.at(-1)!.slice(0, 16)}
            step={o.selection.mode === 'coarse' ? 3600 : 600}
            onChange={(e) => {
              setValue(e.target.value);
              setError('');
              setNearest(null);
            }}
            aria-describedby="utc-range"
          />
        </label>
        <p id="utc-range" className={s.range}>
          {date(o.clock[0])} {time(o.clock[0])} to {date(o.clock.at(-1)!)} {time(o.clock.at(-1)!)}{' '}
          UTC. Steps of {o.selection.mode === 'coarse' ? 'one hour' : 'ten minutes'}.
        </p>
        <button className="primaryButton" type="submit">
          Show this observation <span aria-hidden="true">{String.fromCharCode(8599)}</span>
        </button>
        {error && (
          <div className={s.error} role="status">
            <p>{error}</p>
            {nearest !== null && (
              <button type="button" onClick={() => choose(nearest)}>
                Use nearest sample: {date(o.clock[nearest])} {time(o.clock[nearest])} UTC
              </button>
            )}
          </div>
        )}
      </form>
    </Dialog>
  );
}
export function InstrumentHelp() {
  return (
    <details className={s.help}>
      <summary>How to read these skies</summary>
      <div className={s.helpContent}>
        <div>
          <h3>Start with the horizon.</h3>
          <svg
            viewBox="0 0 380 150"
            role="img"
            aria-label="Concept: a positive elevation is above a flat reference horizon, a negative elevation is below it. This is not a measured observation."
          >
            <line x1="20" y1="80" x2="360" y2="80" stroke="#8c9eaf" />
            <circle cx="110" cy="80" r="4" fill="#edf0eb" />
            <path d="M110 80L285 25M110 80L290 130" stroke="#bac7d4" fill="none" />
            <circle cx="285" cy="25" r="8" fill="#eeb66b" />
            <circle cx="290" cy="130" r="6" fill="#86c7eb" />
            <text x="22" y="65" fill="#c6d0db" fontSize="15">
              0 / HORIZON
            </text>
            <text x="304" y="30" fill="#eeb66b" fontSize="16">
              +
            </text>
            <text x="307" y="135" fill="#86c7eb" fontSize="16">
              -
            </text>
          </svg>
          <small>Concept diagram, not an observation.</small>
        </div>
        <div>
          <h3>Elevation tells you above or below.</h3>
          <p>
            A positive angle is above the local geometric horizon. A negative angle is below it.
            Near zero, the numerical boundary state avoids an artificial yes/no claim. The centre
            dot is the observer. The flat disc is a reference plane, not the lunar ground.
          </p>
          <h3>Bearing tells you where to look.</h3>
          <p>
            Also called azimuth: north is 0 degrees, east 90, south 180 and west 270. The Sun is
            amber and Earth blue. Glyph sizes are illustrative.
          </p>
          <h3>Time and terrain change the question.</h3>
          <p>
            One clock updates both places. Each timeline mark is a supported sample. Outlined cells
            bracket a crossing; its exact instant is unresolved. Terrain is excluded, so these
            angles do not establish available solar power or a working radio link.
          </p>
        </div>
      </div>
    </details>
  );
}
