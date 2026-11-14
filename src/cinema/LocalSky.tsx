import { Line } from '@react-three/drei';
import { useMemo, useEffect } from 'react';
import { CanvasTexture, SRGBColorSpace } from 'three';
import type { Sample } from '../science';

import { direction } from '../lib/skyVectors';
export default function LocalSky({
  records,
  labels = true,
}: {
  records: Sample[];
  labels?: boolean;
}) {
  const ring = Array.from({ length: 97 }, (_, i) => direction((i / 96) * 360, 0));
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.55, 96]} />
        <meshBasicMaterial color="#17202c" transparent opacity={0.42} side={2} depthWrite={false} />
      </mesh>
      <Line points={ring} color="#778490" lineWidth={1} />
      <Line
        points={[
          [-2.6, 0, 0],
          [2.6, 0, 0],
        ]}
        color="#485562"
        lineWidth={0.6}
      />
      <Line
        points={[
          [0, 0, -2.6],
          [0, 0, 2.6],
        ]}
        color="#485562"
        lineWidth={0.6}
      />
      {labels &&
        [
          ['N', 0],
          ['E', 90],
          ['S', 180],
          ['W', 270],
        ].map(([name, az]) => (
          <SceneLabel
            key={name}
            position={direction(Number(az), 0, 2.85)}
            text={String(name)}
            color="#aab5c1"
          />
        ))}
      <mesh>
        <sphereGeometry args={[0.055, 16, 12]} />
        <meshBasicMaterial color="#ecebe6" />
      </mesh>
      {records.map((row) => {
        if (
          row.quality_state !== 'available' ||
          row.azimuth_deg === null ||
          row.elevation_deg === null
        )
          return null;
        const p = direction(row.azimuth_deg, row.elevation_deg),
          floor = direction(row.azimuth_deg, 0),
          sun = row.body_id === 10,
          color = sun ? '#f2be78' : '#8fc8e6';
        return (
          <group key={row.body_id}>
            <Line
              points={[[0, 0, 0], p]}
              color={color}
              lineWidth={1}
              dashed
              dashSize={0.07}
              gapSize={0.07}
            />
            <Line points={[floor, p]} color={color} lineWidth={1} />
            <mesh position={p}>
              <sphereGeometry args={[sun ? 0.09 : 0.065, 24, 16]} />
              <meshBasicMaterial color={color} />
            </mesh>
            <mesh position={p}>
              <sphereGeometry args={[sun ? 0.15 : 0.12, 24, 16]} />
              <meshBasicMaterial color={color} transparent opacity={0.12} depthWrite={false} />
            </mesh>
            {labels && (
              <SceneLabel
                position={[p[0] + 0.38, p[1] + 0.32, p[2]]}
                text={sun ? 'SUN' : 'EARTH'}
                color={color}
              />
            )}
          </group>
        );
      })}
    </group>
  );
}

// Renderer-owned sprites avoid DOM portals and remain decorative; exact text readings live in HTML.
function SceneLabel({
  text,
  color,
  position,
}: {
  text: string;
  color: string;
  position: [number, number, number];
}) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const context = canvas.getContext('2d')!;
    context.font = '28px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = color;
    context.fillText(text, 128, 32);
    const map = new CanvasTexture(canvas);
    map.colorSpace = SRGBColorSpace;
    return map;
  }, [text, color]);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <sprite position={position} scale={[1.4, 0.35, 1]}>
      <spriteMaterial map={texture} transparent depthTest={false} toneMapped={false} />
    </sprite>
  );
}
