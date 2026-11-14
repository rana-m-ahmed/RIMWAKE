import { useState } from 'react';
import { shortName } from '../lib/format';
import type { Site } from '../science';
import { polarPoint } from '../lib/observations';
import s from './Discovery.module.css';
export default function PolarMap({
  sites,
  a,
  b,
  onAssign,
}: {
  sites: Site[];
  a: string;
  b: string;
  onAssign: (slot: 'A' | 'B', id: string) => void;
}) {
  const [slot, setSlot] = useState<'A' | 'B'>('A');
  return (
    <section className={s.mapSection} aria-label="Lunar geographic context">
      <div className={s.mapIntro}>
        <p className="eyebrow">THE SOUTHERN MOON</p>
        <p>Choose the observer to place, then select a documented location on the map.</p>
        <div className={s.segment}>
          <button aria-pressed={slot === 'A'} onClick={() => setSlot('A')}>
            Place A
          </button>
          <button aria-pressed={slot === 'B'} onClick={() => setSlot('B')}>
            Place B
          </button>
        </div>
        <p className={s.mapNote}>
          Approximate published coordinates. South-polar orthographic projection; 75&deg; S outer
          circle. Longitudes are degrees east. Geographic context, without terrain analysis.
        </p>
      </div>
      <div className={s.map}>
        <svg
          viewBox="0 0 600 560"
          role="img"
          aria-label="South polar lunar graticule, zero degrees east at the top, east ninety to the right"
        >
          <defs>
            <radialGradient id="polar-shade">
              <stop stopColor="#253344" />
              <stop offset="1" stopColor="#101923" />
            </radialGradient>
          </defs>
          <circle cx="300" cy="285" r="205" fill="url(#polar-shade)" stroke="#6d7e90" />
          {[-80, -85].map((lat) => (
            <circle
              key={lat}
              cx="300"
              cy="285"
              r={285 - polarPoint(lat, 0).y}
              fill="none"
              stroke="#4b5b6c"
              strokeDasharray="3 6"
            />
          ))}
          {Array.from({ length: 12 }, (_, i) => {
            const p = polarPoint(-75, i * 30);
            return <line key={i} x1="300" y1="285" x2={p.x} y2={p.y} stroke="#344455" />;
          })}
          <circle cx="300" cy="285" r="3" fill="#adbaca" />
          {[
            ['0 E', 300, 55],
            ['90 E', 550, 290],
            ['180 E', 300, 525],
            ['270 E', 50, 290],
            ['90 S', 300, 310],
          ].map(([label, x, y]) => (
            <text key={label} x={x} y={y} fill="#b9c6d3" textAnchor="middle" fontSize="28">
              {label}
            </text>
          ))}
        </svg>
        {sites.map((site) => {
          const p = polarPoint(site.latitude_deg, site.longitude_deg_east),
            assigned = [a === site.id ? 'A' : '', b === site.id ? 'B' : '']
              .filter(Boolean)
              .join(' / ');
          return (
            <button
              key={site.id}
              className={s.mapMarker}
              style={{ left: p.x / 6 + '%', top: p.y / 5.6 + '%' }}
              onClick={() => onAssign(slot, site.id)}
            >
              <span>{assigned || '+'}</span> <strong>{shortName(site.name)}</strong>
              <small className="srOnly"> / Place {slot}</small>
            </button>
          );
        })}
      </div>
    </section>
  );
}
