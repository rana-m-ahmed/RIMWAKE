import { analyze } from './engine';
import { ATLAS_RELEASE, type Index, type Request, type Series } from './model';
import { validateIndex, validateSeries } from './validation';
const digest = async (bytes: ArrayBuffer) =>
  [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))]
    .map((v) => v.toString(16).padStart(2, '0'))
    .join('');
let indexPromise: Promise<Index> | undefined;
const bundles = new Map<string, Promise<Series>>();
async function archive() {
  if (!indexPromise)
    indexPromise = (async () => {
      const [response, manifestResponse] = await Promise.all([
        fetch('/data/atlas/index.json'),
        fetch('/data/atlas/manifest.json'),
      ]);
      if (!response.ok || !manifestResponse.ok) throw Error('Archive unavailable');
      const [bytes, manifest] = await Promise.all([
        response.arrayBuffer(),
        manifestResponse.json(),
      ]);
      if (manifest.release_id !== ATLAS_RELEASE || (await digest(bytes)) !== manifest.index_sha256)
        throw Error('Archive integrity failed');
      return validateIndex(JSON.parse(new TextDecoder().decode(bytes)));
    })();
  return indexPromise;
}
async function bundle(index: Index, id: string) {
  if (!bundles.has(id))
    bundles.set(
      id,
      (async () => {
        const site = index.sites.find((s) => s.id === id);
        if (!site) throw Error('Unsupported site');
        const response = await fetch(site.url);
        if (!response.ok) throw Error('Site data unavailable');
        const bytes = await response.arrayBuffer();
        if ((await digest(bytes)) !== site.sha256) throw Error('Site integrity failed');
        return validateSeries(JSON.parse(new TextDecoder().decode(bytes)), index, id);
      })(),
    );
  return bundles.get(id)!;
}
self.onmessage = async (event: MessageEvent<{ id: number; request: Request }>) => {
  const { id, request } = event.data;
  try {
    const index = await archive(),
      series = await Promise.all([bundle(index, request.a), bundle(index, request.b)]);
    const analysis = analyze(index, series as [Series, Series], request);
    self.postMessage({ id, index, analysis });
  } catch (error) {
    indexPromise = undefined;
    bundles.clear();
    self.postMessage({
      id,
      error: error instanceof Error ? error.message : 'Archive could not be verified',
    });
  }
};
