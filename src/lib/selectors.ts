import { both, classify, type Release, type Sample } from '../science';
export function sampleKey(site: string, body: number, timestamp: string) {
  return `${site}/${body}/${timestamp}`;
}
export function sampleIndex(rows: Sample[]) {
  return new Map(rows.map((row) => [sampleKey(row.site_id, row.body_id, row.timestamp_utc), row]));
}
export function signedPoint(
  azimuth: number,
  elevation: number,
  width: number,
  height: number,
  limit: number,
) {
  return {
    x: 44 + ((width - 64) * azimuth) / 360,
    y: 24 + ((height - 68) * (limit - elevation)) / (2 * limit),
  };
}
export function stateFor(row: Sample | undefined, epsilon: number) {
  return row?.quality_state === 'available' ? classify(row.elevation_deg, epsilon) : 'unknown';
}
export function seriesStates(
  rows: Sample[],
  site: string,
  body: number | 'both',
  clock: string[],
  epsilon: number,
) {
  const index = sampleIndex(rows);
  return clock.map((t) =>
    body === 'both'
      ? both(
          stateFor(index.get(sampleKey(site, 10, t)), epsilon),
          stateFor(index.get(sampleKey(site, 399, t)), epsilon),
        )
      : stateFor(index.get(sampleKey(site, body, t)), epsilon),
  );
}
export function plotLimit(release: Release) {
  return Math.min(
    90,
    Math.max(
      10,
      Math.ceil(
        (Math.max(...release.samples.map((row) => Math.abs(row.elevation_deg ?? 0))) + 2) / 10,
      ) * 10,
    ),
  );
}
export function sphereVector(lat: number, lon: number, radius = 1) {
  const p = (lat * Math.PI) / 180,
    l = (lon * Math.PI) / 180;
  return {
    x: radius * Math.cos(p) * Math.sin(l),
    y: radius * Math.sin(p),
    z: radius * Math.cos(p) * Math.cos(l),
  };
}
