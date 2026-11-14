import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { releaseSchema, type Release } from '../science';

type DataState = {
  release: Release | null;
  status: 'loading' | 'ready' | 'error';
  retry: () => void;
};
const DataContext = createContext<DataState>({ release: null, status: 'loading', retry: () => {} });
export function DataProvider({ children }: { children: ReactNode }) {
  const [release, setRelease] = useState<Release | null>(null),
    [status, setStatus] = useState<DataState['status']>('loading'),
    [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setStatus('loading');
    Promise.all([
      fetch('/data/release.json', { signal: controller.signal }),
      fetch('/data/manifest.json', { signal: controller.signal }),
    ])
      .then(async ([response, manifestResponse]) => {
        if (!response.ok || !manifestResponse.ok) throw Error('Archive unavailable');
        const [bytes, manifest] = await Promise.all([
          response.arrayBuffer(),
          manifestResponse.json(),
        ]);
        const hash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))]
          .map((v) => v.toString(16).padStart(2, '0'))
          .join('');
        const data = releaseSchema.parse(JSON.parse(new TextDecoder().decode(bytes)));
        if (
          hash !== manifest.release_sha256 ||
          data.release_id !== manifest.release_id ||
          data.schema_version !== manifest.schema_version
        )
          throw Error('Release integrity failed');
        if (!controller.signal.aborted) {
          setRelease(data);
          setStatus('ready');
        }
      })
      .catch((e) => {
        if (e.name !== 'AbortError') {
          setRelease(null);
          setStatus('error');
        }
      });
    return () => controller.abort();
  }, [attempt]);
  const value = useMemo(
    () => ({ release, status, retry: () => setAttempt((n) => n + 1) }),
    [release, status],
  );
  return <DataContext value={value}>{children}</DataContext>;
}
export const useData = () => useContext(DataContext);
