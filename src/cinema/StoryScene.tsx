import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import type { Sample } from '../science';
import LocalSky from './LocalSky';
export type StoryMotion = { progress: number; invalidate: () => void };

function TextureMoon({ onReady }: { onReady: () => void }) {
  const texture = useTexture('/assets/lroc-color-2k.jpg');
  texture.colorSpace = THREE.SRGBColorSpace;
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    invalidate();
    requestAnimationFrame(() => {
      invalidate();
      onReady();
    });
  }, []);
  return (
    <mesh rotation={[0.12, -Math.PI / 2, 0]}>
      <sphereGeometry args={[1, 64, 48]} />
      <meshStandardMaterial map={texture} roughness={1} />
    </mesh>
  );
}
function ModelMoon({ onReady }: { onReady: () => void }) {
  const { scene } = useGLTF('/assets/moon-cinema.glb');
  const model = useMemo(() => {
    const copy = scene.clone(true);
    const box = new THREE.Box3().setFromObject(copy);
    const size = box.getSize(new THREE.Vector3());
    const sphere = {
      center: box.getCenter(new THREE.Vector3()),
      radius: Math.max(size.x, size.y, size.z) / 2,
    };
    copy.position.sub(sphere.center);
    const group = new THREE.Group();
    group.add(copy);
    group.scale.setScalar(1 / sphere.radius);
    return group;
  }, [scene]);
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    invalidate();
    requestAnimationFrame(() => {
      invalidate();
      onReady();
    });
  }, []);
  return <primitive object={model} rotation={[0, -0.1, -0.12]} />;
}
function Contents({
  motion,
  records,
  compact,
  onReady,
  localActive,
}: {
  motion: MutableRefObject<StoryMotion>;
  records: Sample[][];
  compact: boolean;
  onReady: () => void;
  localActive: boolean;
}) {
  const moon = useRef<THREE.Group>(null),
    local = useRef<THREE.Group>(null);
  const { invalidate, camera } = useThree();
  useEffect(() => {
    motion.current.invalidate = invalidate;
    invalidate();
    return () => {
      motion.current.invalidate = () => {};
    };
  }, [invalidate, motion]);
  useFrame(() => {
    const p = motion.current.progress;
    const approach = THREE.MathUtils.smoothstep(p, 1.1, 1.75);
    camera.position.set(0, 2.4 * approach, 5.5 + 1.5 * approach);
    camera.lookAt(0, 0, 0);
    if (moon.current) {
      moon.current.visible = p < 2.15;
      moon.current.position.set(compact ? 0.45 : 1.65, compact ? 0.9 : -0.1, -0.75);
      const scale = THREE.MathUtils.lerp(compact ? 1.7 : 2.25, 3.8, Math.min(p / 1.8, 1));
      moon.current.scale.setScalar(scale);
      moon.current.rotation.y = p * 0.6;
      moon.current.rotation.x = p * 0.26;
      moon.current.position.y -= Math.max(0, p - 1.4) * 2.3;
    }
    if (local.current) {
      const scale = compact ? 0.18 : 0.34;
      local.current.scale.setScalar(scale);
      local.current.rotation.x = compact ? 0.55 : 0;
      local.current.position.set(compact ? 0 : 2.1, compact ? 1.55 : -0.3, 0);
    }
  });
  return (
    <>
      <ambientLight intensity={0.09} />
      <directionalLight position={[-3, 2.5, 4]} intensity={3.4} />
      <group
        ref={moon}
        position={[compact ? 0.45 : 1.65, compact ? 0.9 : -0.1, -0.75]}
        scale={compact ? 1.7 : 2.25}
      >
        <Suspense fallback={null}>
          {compact ? <TextureMoon onReady={onReady} /> : <ModelMoon onReady={onReady} />}
        </Suspense>
      </group>
      {localActive && (
        <group ref={local}>
          <group position={[-2.8, 0, 0]} rotation={[0, 0.1, 0]}>
            <LocalSky records={records[0] ?? []} labels={!compact} />
          </group>
          <group position={[2.8, 0, 0]} rotation={[0, 0.1, 0]}>
            <LocalSky records={records[1] ?? []} labels={!compact} />
          </group>
        </group>
      )}
    </>
  );
}
export default function StoryScene({
  motion,
  records,
  compact,
  onFailure,
  onReady,
  localActive,
}: {
  motion: MutableRefObject<StoryMotion>;
  records: Sample[][];
  compact: boolean;
  onFailure: () => void;
  onReady: () => void;
  localActive: boolean;
}) {
  return (
    <Canvas
      frameloop="demand"
      dpr={compact ? 1 : [1, 1.5]}
      camera={{ position: [0, 0, 5.5], fov: 40 }}
      gl={{ antialias: !compact, alpha: true, powerPreference: 'low-power' }}
      onCreated={({ gl }) => {
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
      style={{ pointerEvents: 'none' }}
    >
      <Contents
        motion={motion}
        records={records}
        compact={compact}
        onReady={onReady}
        localActive={localActive}
      />
    </Canvas>
  );
}
