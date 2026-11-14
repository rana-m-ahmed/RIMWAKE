import { useEffect, useState } from 'react';
export function useMedia(query: string) {
  const [matches, setMatches] = useState(() => matchMedia(query).matches);
  useEffect(() => {
    const media = matchMedia(query);
    const update = () => setMatches(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [query]);
  return matches;
}
let cachedCapability: boolean | undefined;
export function supportsWebGL() {
  if (cachedCapability !== undefined) return cachedCapability;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    if (!gl) return (cachedCapability = false);
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return (cachedCapability = true);
  } catch {
    return (cachedCapability = false);
  }
}

// GPU capability checks can block. Run them after the first document paint, never during render.
export function useWebGLCapability(enabled = true) {
  const [capable, setCapable] = useState<boolean | null>(null);
  useEffect(() => {
    if (!enabled) return;
    let live = true;
    const timer = setTimeout(
      () => {
        if (live) setCapable(supportsWebGL());
      },
      cachedCapability === undefined ? 1500 : 0,
    );
    return () => {
      live = false;
      clearTimeout(timer);
    };
  }, [enabled]);
  return enabled ? capable : false;
}
