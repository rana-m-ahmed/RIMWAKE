import { useEffect, useRef, useState } from 'react';
import { angle, classify, stateWords, type Row } from './model';
import s from './Mission.module.css';
export default function Horizon({
  records,
  name,
  limit = 12,
}: {
  records: Row[];
  name: string;
  limit?: number;
}) {
  const host = useRef<HTMLDivElement>(null),
    [width, setWidth] = useState(320);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.max(250, entry.contentRect.width)),
    );
    if (host.current) observer.observe(host.current);
    return () => observer.disconnect();
  }, []);
  const cap = Math.max(
      limit,
      ...records
        .filter((r) => r.elevation_deg !== null)
        .map((r) => Math.ceil(Math.abs(r.elevation_deg!) / 10) * 10),
    ),
    W = width,
    H = 210,
    left = 36,
    right = width - 16,
    top = 25,
    bottom = 178,
    zero = (top + bottom) / 2;
  const point = (row: Row) => ({
    x: left + ((right - left) * row.azimuth_deg!) / 360,
    y: zero - ((row.elevation_deg! / cap) * (bottom - top)) / 2,
  });
  return (
    <div className={s.horizon} ref={host}>
      <div className={s.chartHead}>
        <span>THE SKY AT {name.toUpperCase()}</span>
        <span>Signed elevation / bearing</span>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`${name}. ${records.map((r) => `${r.body_id === 10 ? 'Sun' : 'Earth'} ${angle(r.elevation_deg)}, ${stateWords(classify(r))}`).join('. ')}. Geometric horizon, terrain excluded.`}
      >
        <rect x={left} y={zero} width={right - left} height={bottom - zero} fill="#b7c7d007" />
        {[-cap, 0, cap].map((v) => (
          <g key={v}>
            <line
              x1={left}
              x2={right}
              y1={zero - ((v / cap) * (bottom - top)) / 2}
              y2={zero - ((v / cap) * (bottom - top)) / 2}
              stroke={v === 0 ? '#b8c6ca' : '#34434b'}
              strokeDasharray={v === 0 ? undefined : '2 5'}
            />
            <text
              x="28"
              y={zero - ((v / cap) * (bottom - top)) / 2 + 4}
              textAnchor="end"
              fill="#a7b7c1"
              fontSize="11"
            >
              {v > 0 ? '+' : ''}
              {v}
            </text>
          </g>
        ))}
        {[0, 90, 180, 270, 360].map((az, i) => (
          <g key={az}>
            <line
              x1={left + ((right - left) * az) / 360}
              x2={left + ((right - left) * az) / 360}
              y1={top}
              y2={bottom}
              stroke="#34434b"
              strokeDasharray="2 5"
            />
            <text
              x={left + ((right - left) * az) / 360}
              y="201"
              textAnchor={i === 0 ? 'start' : i === 4 ? 'end' : 'middle'}
              fill="#b9c5cc"
              fontSize="12"
            >
              {['N', 'E', 'S', 'W', 'N'][i]} {az}
            </text>
          </g>
        ))}
        <text x="44" y={zero - 7} fill="#c1cbd0" fontSize="11">
          0 / HORIZON
        </text>
        {records.map((row) => {
          if (classify(row) === 'unknown') return null;
          const p = point(row),
            sun = row.body_id === 10,
            color = sun ? '#efbe78' : '#9ed0e9';
          return (
            <g
              key={row.body_id}
              data-testid={`atlas-${row.body_id}-marker`}
              data-elevation={row.elevation_deg}
              data-azimuth={row.azimuth_deg}
            >
              <line
                x1={p.x}
                x2={p.x}
                y1={p.y}
                y2={zero}
                stroke={color}
                strokeDasharray={sun ? undefined : '3 4'}
              />
              <circle cx={p.x} cy={p.y} r="6" fill="#0c151c" stroke={color} strokeWidth="2" />
              <circle cx={p.x} cy={p.y} r="2" fill={color} />
              <text
                x={p.x + (p.x > 550 ? -12 : 12)}
                y={Math.max(18, p.y - 13)}
                textAnchor={p.x > 550 ? 'end' : 'start'}
                fill={color}
                fontSize="12"
              >
                {sun ? 'SUN' : 'EARTH'}
              </text>
            </g>
          );
        })}
      </svg>
      <div className={s.angleReadings}>
        {records.map((row) => (
          <div key={row.body_id}>
            <span>
              {row.body_id === 10 ? 'Sun' : 'Earth'} <small>{stateWords(classify(row))}</small>
            </span>
            <strong
              className={row.body_id === 10 ? s.sun : s.earth}
              data-testid={`reading-${row.body_id}`}
            >
              {angle(row.quality_state === 'available' ? row.elevation_deg : null)}
            </strong>
            <span>
              {row.azimuth_deg?.toFixed(2) ?? 'Unknown'}&deg; <small>bearing</small>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
