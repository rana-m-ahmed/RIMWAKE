import { useEffect, useRef, useState } from 'react';
import { stateLabel, type Sample, type Site } from '../science';
import { bearing, signed } from '../lib/format';
import { signedPoint, stateFor } from '../lib/selectors';
import s from './SkyInstrument.module.css';

export default function SkyInstrument({
  site,
  records,
  slot,
  limit,
  epsilon,
  active,
}: {
  site: Site;
  records: Sample[];
  slot: 'A' | 'B';
  limit: number;
  epsilon: number;
  active: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null),
    [width, setWidth] = useState(520);
  const height = width >= 370 ? 220 : 250;
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.max(210, Math.round(entry.contentRect.width))),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const points = records.map((row) =>
    row.azimuth_deg !== null && row.elevation_deg !== null && row.quality_state === 'available'
      ? signedPoint(row.azimuth_deg, row.elevation_deg, width, height, limit)
      : null,
  );
  const near =
    points[0] && points[1] && Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y) < 65;
  return (
    <section
      className={`${s.site} ${active ? s.active : ''}`}
      aria-label={`Viewpoint ${slot}: ${site.name}`}
    >
      <div className={s.siteHeading}>
        <span className={s.letter}>{slot}</span>
        <div>
          <h2>{site.name}</h2>
          <p>
            {Math.abs(site.latitude_deg)}° S / {site.longitude_deg_east}° E
          </p>
        </div>
        <span className={s.siteNote}>
          Hypothetical
          <br />
          observer
        </span>
      </div>
      <div ref={ref} className={s.chart}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          height={height}
          role="img"
          aria-label={`${site.name}. Signed elevation versus north-clockwise azimuth. ${records.map((row) => `${row.body_id === 10 ? 'Sun' : 'Earth'} elevation ${signed(row.elevation_deg)}, azimuth ${bearing(row.azimuth_deg)}; ${stateLabel(stateFor(row, epsilon))}`).join('. ')}. Plot includes negative elevations; lunar terrain excluded.`}
        >
          <defs>
            <pattern id={`unknown-${slot}`} width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M0 8L8 0" stroke="#8194a2" strokeWidth="1" />
            </pattern>
          </defs>
          <rect
            x="44"
            y={signedPoint(0, 0, width, height, limit).y}
            width={width - 64}
            height={(height - 68) / 2}
            fill="#ffffff03"
          />
          {[-limit, -limit / 2, 0, limit / 2, limit].map((elevation) => {
            const point = signedPoint(0, elevation, width, height, limit);
            return (
              <g key={elevation}>
                <line
                  x1="44"
                  y1={point.y}
                  x2={width - 20}
                  y2={point.y}
                  stroke={elevation === 0 ? '#e1e5e5' : '#364551'}
                  strokeWidth={elevation === 0 ? 1.4 : 1}
                  strokeDasharray={elevation === 0 ? undefined : '2 5'}
                />
                <text x="35" y={point.y + 4} textAnchor="end" className={s.axis}>
                  {elevation > 0 ? '+' : elevation < 0 ? '−' : ''}
                  {Math.abs(elevation)}°
                </text>
              </g>
            );
          })}
          {[0, 90, 180, 270, 360].map((value, i) => {
            const point = signedPoint(value, 0, width, height, limit);
            return (
              <g key={value}>
                <line x1={point.x} y1="24" x2={point.x} y2={height - 44} stroke="#364551" />
                <text
                  x={point.x}
                  y={height - 23}
                  textAnchor={i === 0 ? 'start' : i === 4 ? 'end' : 'middle'}
                  className={s.axis}
                >
                  {width < 370
                    ? ['N', 'E', 'S', 'W', 'N'][i]
                    : `${['N', 'E', 'S', 'W', 'N'][i]} ${value}°`}
                </text>
              </g>
            );
          })}
          <text x="44" y="12" className={s.axisTitle}>
            ELEVATION / °
          </text>
          <text x={width - 20} y={height - 3} textAnchor="end" className={s.axisTitle}>
            AZIMUTH →
          </text>
          {records.map((row, i) => {
            const p = points[i],
              solar = row.body_id === 10;
            if (!p)
              return (
                <g key={row.body_id}>
                  <rect
                    x={44 + (i * (width - 64)) / 2}
                    y="42"
                    width={(width - 64) / 2}
                    height="125"
                    fill={`url(#unknown-${slot})`}
                    opacity=".18"
                  />
                  <text
                    x={44 + ((width - 64) * (i + 0.5)) / 2}
                    y="95"
                    textAnchor="middle"
                    className={s.axis}
                  >
                    {solar ? 'SUN' : 'EARTH'} UNKNOWN
                  </text>
                </g>
              );
            const labelBelow = near && i === 1;
            return (
              <g
                key={row.body_id}
                className={solar ? 'sun' : 'earth'}
                data-testid={`${slot}-${solar ? 'sun' : 'earth'}-marker`}
                data-azimuth={row.azimuth_deg}
                data-elevation={row.elevation_deg}
                data-x={p.x}
                data-y={p.y}
                data-horizon-y={signedPoint(0, 0, width, height, limit).y}
              >
                <line
                  x1={p.x}
                  x2={p.x}
                  y1={p.y}
                  y2={signedPoint(0, 0, width, height, limit).y}
                  stroke="currentColor"
                  strokeDasharray={solar ? undefined : '3 4'}
                  opacity=".65"
                />
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="8"
                  fill="var(--space)"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                {solar ? (
                  <circle cx={p.x} cy={p.y} r="3" fill="currentColor" />
                ) : (
                  <path
                    d={`M${p.x - 4} ${p.y}h8M${p.x} ${p.y - 4}v8`}
                    stroke="currentColor"
                    strokeWidth="1.1"
                  />
                )}
                <text
                  x={p.x + (p.x > width - 105 ? -14 : 14)}
                  y={Math.max(21, Math.min(height - 52, p.y + (labelBelow ? 25 : -18)))}
                  textAnchor={p.x > width - 105 ? 'end' : 'start'}
                  className={s.markerLabel}
                >
                  {solar ? 'SUN' : 'EARTH'}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <table className={s.readings}>
        <caption className="srOnly">
          Exact sampled angles at {site.name}. Both bodies share the global UTC.
        </caption>
        <thead>
          <tr>
            <th>BODY / STATE</th>
            <th>ELEVATION</th>
            <th>AZIMUTH</th>
          </tr>
        </thead>
        <tbody>
          {records.map((row) => (
            <tr key={row.body_id}>
              <th>
                <span className={row.body_id === 10 ? 'sun' : 'earth'}>
                  {row.body_id === 10 ? 'Sun' : 'Earth'}
                </span>
                <small>{stateLabel(stateFor(row, epsilon))}</small>
              </th>
              <td
                className={row.body_id === 10 ? 'sun' : 'earth'}
                data-testid={`${slot}-${row.body_id}-elevation`}
              >
                {signed(row.elevation_deg)}
              </td>
              <td>{bearing(row.azimuth_deg)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
