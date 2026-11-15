import { memo, Suspense, useEffect, useRef, type RefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useTexture, Line } from '@react-three/drei';
import { SRGBColorSpace, Vector3, type Group } from 'three';
import type { Site } from './model';
import { moonPoint } from './geography';
function Globe({
  sites,
  a,
  b,
  focus,
  onChoose,
  reset,
  reduced,
  overlay,
}: {
  sites: Site[];
  a: string;
  b: string;
  focus: Site;
  onChoose: (id: string) => void;
  reset: number;
  reduced: boolean;
  overlay: RefObject<SVGSVGElement | null>;
}) {
  const texture = useTexture('/assets/lroc-color-2k.jpg');
  texture.colorSpace = SRGBColorSpace;
  const group = useRef<Group>(null),
    controls = useRef<any>(null),
    target = useRef(new Vector3()),
    moving = useRef(true);
  const flight = useRef({ from: new Vector3(), started: 0 });
  const { camera, invalidate, gl, size } = useThree();
  useEffect(() => {
    const v = new Vector3(...moonPoint(focus.latitude_deg, focus.longitude_deg_east, 6.1));
    target.current.copy(v);
    flight.current = { from: camera.position.clone(), started: performance.now() };
    moving.current = true;
    gl.domElement.dataset.flight = 'moving';
    if (reduced) camera.position.copy(v);
    invalidate();
  }, [focus.id, reset, reduced]);
  useFrame(() => {
    if (moving.current) {
      const t = Math.min(1, (performance.now() - flight.current.started) / 750);
      camera.position.lerpVectors(flight.current.from, target.current, 1 - Math.pow(1 - t, 3));
      camera.lookAt(0, 0, 0);
      if (t >= 1) {
        moving.current = false;
        gl.domElement.dataset.flight = 'settled';
      } else invalidate();
      controls.current?.update();
    }
    camera.updateMatrixWorld();
    for (const [slot, id] of [
      ['A', a],
      ['B', b],
    ]) {
      const label = overlay.current?.querySelector<SVGGElement>(`[data-label="${slot}"]`),
        site = sites.find((s) => s.id === id);
      if (!label || !site) continue;
      const normal = new Vector3(...moonPoint(site.latitude_deg, site.longitude_deg_east, 1)),
        point = new Vector3(...moonPoint(site.latitude_deg, site.longitude_deg_east, 2.05)).project(
          camera,
        );
      const visible =
        normal.dot(camera.position) > 2.01 &&
        point.z < 1 &&
        Math.abs(point.x) < 1 &&
        Math.abs(point.y) < 1 &&
        !(slot === 'B' && a === b);
      label.style.display = visible ? '' : 'none';
      label.setAttribute(
        'transform',
        `translate(${(point.x * 0.5 + 0.5) * size.width},${(-point.y * 0.5 + 0.5) * size.height})`,
      );
    }
  });
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[4, 6, 5]} intensity={1.25} />
      <group ref={group}>
        <mesh
          rotation={[0, -Math.PI / 2, 0]}
          onClick={(event) => event.stopPropagation()}
          onPointerOver={(event) => event.stopPropagation()}
        >
          <sphereGeometry args={[2, 96, 64]} />
          <meshStandardMaterial map={texture} roughness={1} />
        </mesh>
        <mesh scale={1.012}>
          <sphereGeometry args={[2, 64, 48]} />
          <meshBasicMaterial color="#a5bfd2" wireframe transparent opacity={0.018} />
        </mesh>
        {[-60, -30, 0, 30, 60].map((lat) => (
          <Line
            key={lat}
            points={Array.from({ length: 181 }, (_, i) => moonPoint(lat, i * 2, 2.008))}
            color="#abc0ce"
            transparent
            opacity={0.15}
            lineWidth={0.5}
          />
        ))}
        {Array.from({ length: 12 }, (_, i) => (
          <Line
            key={i}
            points={Array.from({ length: 91 }, (_, j) => moonPoint(j * 2 - 90, i * 30, 2.008))}
            color="#abc0ce"
            transparent
            opacity={0.13}
            lineWidth={0.5}
          />
        ))}
        {sites.map((site) => {
          const assigned = site.id === a || site.id === b;
          return (
            <group
              key={site.id}
              position={moonPoint(site.latitude_deg, site.longitude_deg_east, 2.035)}
            >
              <mesh
                onClick={(event) => {
                  event.stopPropagation();
                  moving.current = false;
                  onChoose(site.id);
                }}
                onPointerOver={() => {
                  document.body.style.cursor = 'pointer';
                }}
                onPointerOut={() => {
                  document.body.style.cursor = '';
                }}
              >
                <sphereGeometry args={[assigned ? 0.055 : 0.035, 20, 16]} />
                <meshBasicMaterial
                  color={site.id === a ? '#f5efe4' : site.id === b ? '#a7c5d5' : '#b3bdc4'}
                />
              </mesh>
              {assigned && (
                <mesh>
                  <sphereGeometry args={[0.09, 20, 16]} />
                  <meshBasicMaterial color="#f6e7c4" transparent opacity={0.2} depthWrite={false} />
                </mesh>
              )}
            </group>
          );
        })}
      </group>
      <OrbitControls
        ref={controls}
        enablePan={false}
        enableDamping={false}
        minDistance={4.6}
        maxDistance={9}
        rotateSpeed={0.5}
        zoomSpeed={0.6}
        onStart={() => {
          moving.current = false;
          document.body.style.cursor = 'grabbing';
        }}
        onEnd={() => {
          document.body.style.cursor = '';
        }}
      />
    </>
  );
}
function AtlasScene(props: {
  sites: Site[];
  a: string;
  b: string;
  focus: Site;
  onChoose: (id: string) => void;
  reset: number;
  reduced: boolean;
  onFailure: () => void;
}) {
  const overlay = useRef<SVGSVGElement>(null);
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Canvas
        frameloop="demand"
        dpr={[1, 1.5]}
        camera={{ position: [1, -5.8, 2], fov: 42, near: 0.1, far: 50 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
        onCreated={({ gl }) => {
          gl.domElement.setAttribute('aria-hidden', 'true');
          gl.domElement.addEventListener(
            'webglcontextlost',
            (event) => {
              event.preventDefault();
              props.onFailure();
            },
            { once: true },
          );
        }}
      >
        <Suspense fallback={null}>
          <Globe {...props} overlay={overlay} />
        </Suspense>
      </Canvas>
      <svg
        ref={overlay}
        width="100%"
        height="100%"
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      >
        {(['A', 'B'] as const).map((slot) => (
          <g
            key={slot}
            data-label={slot}
            style={{ display: 'none', pointerEvents: 'auto', cursor: 'pointer' }}
            onClick={() => props.onChoose(slot === 'A' ? props.a : props.b)}
          >
            <circle r="22" fill="transparent" />
            <circle
              r="12"
              fill={slot === 'A' ? '#f0e7d1' : '#a5c9db'}
              stroke="#13212b"
              strokeWidth="2"
            />
            <text
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={props.a === props.b ? 9 : 12}
              fontFamily="IBM Plex Mono, monospace"
              fill="#10202b"
            >
              {slot === 'A' && props.a === props.b ? 'A/B' : slot}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
// The globe is geographic context, so time scrubbing must not rebuild its geometry.
export default memo(
  AtlasScene,
  (a, b) =>
    a.a === b.a &&
    a.b === b.b &&
    a.focus.id === b.focus.id &&
    a.reset === b.reset &&
    a.reduced === b.reduced,
);
