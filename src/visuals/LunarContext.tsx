import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type { Site } from '../science';
import { sphereVector } from '../lib/selectors';
import s from './LunarContext.module.css';

export default function LunarContext({ sites }: { sites: Site[] }) {
  const host = useRef<HTMLDivElement>(null);
  const controls = useRef<{ rotate: (delta: number) => void; reset: () => void }>({
    rotate: () => {},
    reset: () => {},
  });
  const [state, setState] = useState<'loading' | 'ready' | 'fallback'>('loading');
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let stopped = false,
      renderer: THREE.WebGLRenderer | undefined,
      frame = 0;
    let texture: THREE.Texture | undefined;
    const disposables: { dispose: () => void }[] = [];
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'low-power',
      });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
      renderer.setClearColor(0x0b121b, 1);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
    } catch {
      setState('fallback');
      return;
    }
    const view = renderer;
    view.domElement.setAttribute('aria-hidden', 'true');
    element.appendChild(view.domElement);
    const scene = new THREE.Scene(),
      camera = new THREE.PerspectiveCamera(37, 1, 0.1, 20);
    camera.position.set(0, -2.65, 2.7);
    camera.lookAt(0, 0, 0);
    const globe = new THREE.Group();
    scene.add(globe);
    const geometry = new THREE.SphereGeometry(1, 72, 48);
    geometry.rotateY(-Math.PI / 2);
    const material = new THREE.MeshStandardMaterial({ color: 0xe5e5e1, roughness: 1 });
    globe.add(new THREE.Mesh(geometry, material));
    disposables.push(geometry, material);
    scene.add(new THREE.AmbientLight(0xffffff, 1.1));
    const key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(-3, 1, 4);
    scene.add(key);
    const markers = sites.map((site, i) => {
      const position = sphereVector(site.latitude_deg, site.longitude_deg_east, 1.012);
      const shape = new THREE.SphereGeometry(0.014, 12, 8),
        paint = new THREE.MeshBasicMaterial({ color: i === 0 ? 0xeeb66b : 0x86c7eb });
      disposables.push(shape, paint);
      const mesh = new THREE.Mesh(shape, paint);
      mesh.position.set(position.x, position.y, position.z);
      globe.add(mesh);
      const label = document.createElement('span');
      label.className = s.pointLabel;
      label.textContent = i === 0 ? 'A' : 'B';
      label.setAttribute('aria-hidden', 'true');
      element.appendChild(label);
      return { mesh, label };
    });
    const render = () => {
      if (stopped) return;
      view.render(scene, camera);
      for (const { mesh, label } of markers) {
        const world = mesh.getWorldPosition(new THREE.Vector3());
        const visible = world.dot(camera.position) > 1.04;
        const p = world.clone().project(camera);
        label.hidden = !visible;
        label.style.left = `${(p.x * 0.5 + 0.5) * element.clientWidth}px`;
        label.style.top = `${(-p.y * 0.5 + 0.5) * element.clientHeight}px`;
      }
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(render);
    };
    const resize = () => {
      const width = element.clientWidth,
        height = element.clientHeight;
      view.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      schedule();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    const loader = new THREE.TextureLoader();
    loader.load(
      '/assets/lroc-color-2k.jpg',
      (map) => {
        texture = map;
        if (stopped) {
          map.dispose();
          return;
        }
        map.colorSpace = THREE.SRGBColorSpace;
        material.map = map;
        material.needsUpdate = true;
        setState('ready');
        schedule();
      },
      undefined,
      () => {
        if (!stopped) setState('fallback');
      },
    );
    controls.current = {
      rotate: (delta) => {
        globe.rotation.y += delta;
        schedule();
      },
      reset: () => {
        globe.rotation.set(0, 0, 0);
        schedule();
      },
    };
    let lastX: number | null = null;
    const down = (event: PointerEvent) => {
      lastX = event.clientX;
      view.domElement.setPointerCapture(event.pointerId);
    };
    const move = (event: PointerEvent) => {
      if (lastX === null) return;
      globe.rotation.y += (event.clientX - lastX) * 0.008;
      lastX = event.clientX;
      schedule();
    };
    const up = () => {
      lastX = null;
    };
    const lost = (event: Event) => {
      event.preventDefault();
      if (!stopped) setState('fallback');
    };
    view.domElement.addEventListener('pointerdown', down);
    view.domElement.addEventListener('pointermove', move);
    view.domElement.addEventListener('pointerup', up);
    view.domElement.addEventListener('pointercancel', up);
    view.domElement.addEventListener('webglcontextlost', lost);
    resize();
    return () => {
      stopped = true;
      observer.disconnect();
      cancelAnimationFrame(frame);
      view.domElement.removeEventListener('pointerdown', down);
      view.domElement.removeEventListener('pointermove', move);
      view.domElement.removeEventListener('pointerup', up);
      view.domElement.removeEventListener('pointercancel', up);
      view.domElement.removeEventListener('webglcontextlost', lost);
      texture?.dispose();
      disposables.forEach((resource) => resource.dispose());
      view.dispose();
      view.forceContextLoss();
      view.domElement.remove();
      markers.forEach((marker) => marker.label.remove());
      controls.current = { rotate: () => {}, reset: () => {} };
    };
  }, [sites.map((site) => site.id).join('/')]);
  return (
    <section className={s.context}>
      <p className="eyebrow">OPTIONAL / SPATIAL CONTEXT</p>
      <h2>
        Two places.
        <br />
        <em>On one world.</em>
      </h2>
      <p>
        The source coordinates are placed on an ideal sphere for geographic orientation. This
        texture and lighting never determine the Sun/Earth readings.
      </p>
      <div
        className={s.canvas}
        ref={host}
        role="img"
        aria-label="Optional ideal-sphere lunar context, viewed toward the south. The coordinate markers correspond to selected observers; texture and lighting are illustrative."
      >
        {state === 'fallback' && (
          <div className={s.fallback}>
            <img
              src="/assets/moon-context.webp"
              alt="NASA color map on an ideal sphere, with illustrative lighting"
            />
            <p>
              3D is unavailable on this device.
              <br />
              The scientific Explorer remains fully functional.
            </p>
          </div>
        )}
        {state === 'loading' && <span className={s.loading}>Loading optional 3D context…</span>}
      </div>
      <div className={s.actions}>
        <button disabled={state !== 'ready'} onClick={() => controls.current.rotate(-Math.PI / 8)}>
          Rotate west ←
        </button>
        <button disabled={state !== 'ready'} onClick={() => controls.current.reset()}>
          Reset view
        </button>
        <button disabled={state !== 'ready'} onClick={() => controls.current.rotate(Math.PI / 8)}>
          Rotate east →
        </button>
      </div>
      <div className={s.siteList}>
        {sites.map((site, i) => (
          <p key={site.id + '-' + i}>
            <span>{i === 0 ? 'A' : 'B'}</span>
            <strong>{site.name}</strong>
            <small>
              {site.latitude_deg}° latitude / {site.longitude_deg_east}° east
            </small>
          </p>
        ))}
      </div>
      <p className={s.caption}>
        NASA SVS / Ernie Wright · LRO / LROC / LOLA. Aesthetics-optimized color map, no relief mesh
        or terrain obstruction calculation. Pole regions include lower-resolution albedo fill.
        Lighting is illustrative, not time-dependent.
      </p>
    </section>
  );
}
