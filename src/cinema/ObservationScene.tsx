import { useLayoutEffect, useRef, useState, useMemo } from 'react';
import { PerspectiveCamera, Vector3 } from 'three';
import { direction } from '../lib/skyVectors';
import { Canvas } from '@react-three/fiber';
import LocalSky from './LocalSky';
import type { Sample } from '../science';
export default function ObservationScene({
  records,
  onFailure,
}: {
  records: Sample[];
  onFailure: () => void;
}) {
  const host = useRef<HTMLDivElement>(null),
    [size, setSize] = useState({ width: 500, height: 285 });
  useLayoutEffect(() => {
    const el = host.current!;
    const observer = new ResizeObserver(() =>
      setSize({ width: el.clientWidth, height: el.clientHeight }),
    );
    observer.observe(el);
    setSize({ width: el.clientWidth, height: el.clientHeight });
    return () => observer.disconnect();
  }, []);
  const labels = useMemo(() => {
    const camera = new PerspectiveCamera(35, size.width / Math.max(1, size.height), 0.1, 100);
    camera.position.set(4, 3.8, 4.7);
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld();
    const inputs = [
      ...(
        [
          ['N', 0],
          ['E', 90],
          ['S', 180],
          ['W', 270],
        ] as const
      ).map(([text, az]) => ({ text, color: '#b8c4d0', point: direction(az, 0, 2.9) })),
      ...records
        .filter(
          (row) =>
            row.quality_state === 'available' &&
            row.azimuth_deg !== null &&
            row.elevation_deg !== null,
        )
        .map((row) => ({
          text: row.body_id === 10 ? 'SUN' : 'EARTH',
          color: row.body_id === 10 ? '#eeb66b' : '#86c7eb',
          point: direction(row.azimuth_deg!, row.elevation_deg!),
        })),
    ];
    const placed: { x: number; y: number }[] = [];
    return inputs.map((input) => {
      const p = new Vector3(...input.point).project(camera),
        anchorX = (p.x * 0.5 + 0.5) * size.width,
        anchorY = (-p.y * 0.5 + 0.5) * size.height;
      let x = Math.max(25, Math.min(size.width - 25, anchorX)),
        y = anchorY + (input.text.length > 1 ? -18 : 6);
      for (
        let i = 0;
        i < 6 && placed.some((p) => Math.abs(p.x - x) < 48 && Math.abs(p.y - y) < 21);
        i++
      )
        y -= 22;
      y = Math.max(18, Math.min(size.height - 24, y));
      placed.push({ x, y });
      return { ...input, x, y, anchorX, anchorY };
    });
  }, [records, size]);
  return (
    <div ref={host} style={{ position: 'absolute', inset: 0 }}>
      <Canvas
        frameloop="demand"
        dpr={[1, 1.25]}
        camera={{ position: [4, 3.8, 4.7], fov: 35 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
        onCreated={({ gl, camera, invalidate }) => {
          camera.lookAt(0, 0, 0);
          camera.updateMatrixWorld();
          invalidate();
          gl.domElement.setAttribute('aria-hidden', 'true');
          gl.domElement.addEventListener(
            'webglcontextlost',
            (event) => {
              event.preventDefault();
              onFailure();
            },
            { once: true },
          );
        }}
      >
        <LocalSky records={records} labels={false} />
      </Canvas>
      <svg
        aria-hidden="true"
        viewBox={`0 0 ${size.width} ${size.height}`}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        {labels.map((label) => (
          <g key={label.text}>
            {label.text.length > 1 && (
              <line
                x1={label.anchorX}
                y1={label.anchorY}
                x2={label.x}
                y2={label.y + 5}
                stroke={label.color}
                strokeOpacity=".5"
              />
            )}
            <text
              x={label.x}
              y={label.y}
              fill={label.color}
              textAnchor="middle"
              fontSize="12"
              fontFamily="IBM Plex Sans, sans-serif"
            >
              {label.text}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
