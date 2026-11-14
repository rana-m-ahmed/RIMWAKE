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
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.25]}
      camera={{ position: [4, 3.8, 4.7], fov: 43 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
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
    >
      <LocalSky records={records} />
    </Canvas>
  );
}
