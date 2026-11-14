import { memo, useMemo } from 'react';
import type { State } from '../science';
import s from './HorizonLoom.module.css';

const Track = memo(function Track({
  states,
  selected,
  onSelect,
  kind,
  id,
  brackets = [],
}: {
  states: State[];
  selected: number;
  onSelect: (i: number) => void;
  kind: 'sun' | 'earth' | 'both';
  id: string;
  brackets?: { start: number; end: number }[];
}) {
  const cells = useMemo(() => {
    const paths = new Map<string, string>();
    const rect = (fill: string, x: number, y: number, height: number) =>
      paths.set(fill, (paths.get(fill) ?? '') + `M${x.toFixed(2)} ${y}h.82v${height}h-.82Z`);
    states.forEach((state, index) => {
      const x = index + 0.09;
      if (state === 'visible' && kind === 'both') {
        rect('var(--sun)', x, 1, 5);
        rect('var(--earth)', x, 8, 5);
      } else
        rect(
          state === 'unknown'
            ? `url(#hatch-${id})`
            : state === 'visible'
              ? kind === 'sun'
                ? 'var(--sun)'
                : 'var(--earth)'
              : state === 'boundary'
                ? '#e9e9e2'
                : '#33434e',
          x,
          1,
          12,
        );
    });
    return [...paths].map(([fill, d]) => (
      <path
        key={fill}
        d={d}
        fill={fill}
        stroke={fill === '#e9e9e2' ? '#fff' : undefined}
        strokeDasharray={fill === '#e9e9e2' ? '1 2' : undefined}
      />
    ));
  }, [states, kind, id]);
  return (
    <svg
      className={s.track}
      viewBox={`0 0 ${states.length} 14`}
      preserveAspectRatio="none"
      role="img"
      aria-label={`${id} sampled states. Use the shared UTC slider for keyboard navigation.`}
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        onSelect(
          Math.max(
            0,
            Math.min(
              states.length - 1,
              Math.floor(((event.clientX - rect.left) / rect.width) * states.length),
            ),
          ),
        );
      }}
    >
      <defs>
        <pattern id={`hatch-${id}`} width="4" height="4" patternUnits="userSpaceOnUse">
          <path d="M0 4L4 0" stroke="#b6c4cb" strokeWidth="1" />
        </pattern>
      </defs>
      {cells}
      {brackets.map((band, i) => (
        <rect
          key={i}
          x={band.start + 0.09}
          y="0"
          width={band.end - band.start + 0.82}
          height="14"
          fill="none"
          stroke="#edf0e7"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          data-testid="crossing-band"
        />
      ))}
      <line
        x1={selected + 0.5}
        x2={selected + 0.5}
        y1="0"
        y2="14"
        stroke="#f3f4f0"
        strokeWidth={Math.max(1, states.length / 600)}
      />
    </svg>
  );
});
export default function HorizonLoom({
  tracks,
  selected,
  onSelect,
  clock,
  mode,
  onMode,
  refinedAvailable,
  onEvidence,
  showModes = true,
  crossingBands = [],
}: {
  tracks: { slot: string; kind: 'sun' | 'earth' | 'both'; states: State[] }[];
  selected: number;
  onSelect: (n: number) => void;
  clock: string[];
  mode: 'coarse' | 'refined';
  onMode: (mode: 'coarse' | 'refined') => void;
  refinedAvailable: boolean;
  onEvidence: () => void;
  showModes?: boolean;
  crossingBands?: { slot: string; kind: string; start: number; end: number }[];
}) {
  return (
    <section className={s.loom} aria-label="Horizon Loom">
      <div className={s.head}>
        <div>
          <span className="eyebrow">TIME / SAMPLED AVAILABILITY</span>
          <h2>Horizon Loom</h2>
        </div>
        {showModes && (
          <div className={s.modes}>
            <button aria-pressed={mode === 'coarse'} onClick={() => onMode('coarse')}>
              Hourly scan
            </button>
            <button
              disabled={!refinedAvailable}
              aria-pressed={mode === 'refined'}
              onClick={() => onMode('refined')}
            >
              10-min detail
            </button>
          </div>
        )}
        <button className={s.evidence} onClick={onEvidence}>
          Inspect evidence <span>↗</span>
        </button>
      </div>
      <div className={s.tracks}>
        {tracks.map((track) => (
          <div className={s.row} key={track.slot + track.kind}>
            <span>
              {track.slot} / {track.kind.toUpperCase()}
            </span>
            <Track
              brackets={crossingBands.filter((b) => b.slot === track.slot && b.kind === track.kind)}
              states={track.states}
              selected={selected}
              onSelect={onSelect}
              kind={track.kind}
              id={track.slot + '-' + track.kind}
            />
          </div>
        ))}
      </div>
      <div className={s.foot}>
        <p>
          <span className={s.solid} /> Above <span className={s.empty} /> Below{' '}
          <span className={s.hatched} /> Unknown <span className={s.dotted} /> Boundary
        </p>
        <p>
          {clock.length} samples · {mode === 'coarse' ? '60' : '10'}-minute cadence · no
          interpolation
        </p>
      </div>
      <p className={s.limit}>
        Each block is a sampled state. Outlines mark released crossing brackets, not exact crossing
        instants. The paired Sun/Earth bars mark BOTH above the geometric plane; they do not
        guarantee continuous visibility, usable power or a radio link.
      </p>
    </section>
  );
}
