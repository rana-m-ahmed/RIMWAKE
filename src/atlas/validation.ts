import { ATLAS_RELEASE, type Index, type Series } from './model';
const require = (value: unknown, message: string) => {
  if (!value) throw Error(message);
};
export function validateIndex(value: unknown): Index {
  const x = value as Index;
  require(x?.release_id === ATLAS_RELEASE &&
    x.schema_version === '2.0.0' &&
    x.model === 'tangent_plane_center_airless' &&
    x.epsilon_deg === 1e-6 &&
    x.validation?.status === 'provisional', 'Unrecognized archive identity or model');
  require(Array.isArray(x.sites) &&
    x.sites.length === 6 &&
    new Set(x.sites.map((s) => s.id)).size === 6, 'Invalid site catalog');
  require(Array.isArray(x.timestamps) &&
    x.timestamps.length === 2161 &&
    x.cadence_seconds === 3600 &&
    x.timestamps[0] === x.start_utc &&
    x.timestamps.at(-1) === x.end_utc, 'Invalid archive clock');
  require(x.timestamps.every(
    (t, i) =>
      Number.isFinite(Date.parse(t)) &&
      (!i || Date.parse(t) - Date.parse(x.timestamps[i - 1]) === 3600000),
  ), 'Non-hourly source clock');
  for (const s of x.sites)
    require(Number.isFinite(s.latitude_deg) &&
      Math.abs(s.latitude_deg) <= 90 &&
      Number.isFinite(s.longitude_deg_east) &&
      s.longitude_deg_east >= 0 &&
      s.longitude_deg_east < 360 &&
      s.observer_height_km === 0 &&
      s.observer_is_hypothetical === true &&
      /^\/data\/atlas\/[a-z0-9]+\.json$/.test(s.url) &&
      /^[a-f0-9]{64}$/.test(s.sha256), 'Invalid observer or bundle identity');
  return x;
}
export function validateSeries(value: unknown, index: Index, id: string): Series {
  const x = value as Series;
  require(x?.release_id === index.release_id &&
    x.schema_version === '2.0.0' &&
    x.site_id === id &&
    x.model === index.model &&
    x.epsilon_deg === index.epsilon_deg, 'Site/release mismatch');
  require(Array.isArray(x.runs) &&
    x.runs.length === 2 &&
    new Set(x.runs.map((r) => r.body_id)).size === 2 &&
    x.runs.every(
      (r) =>
        [10, 399].includes(r.body_id) &&
        r.site_id === id &&
        r.api_version === '1.2' &&
        /^[a-f0-9]{64}$/.test(r.raw_sha256) &&
        r.request_url.startsWith('https://ssd.jpl.nasa.gov/api/horizons.api?'),
    ), 'Invalid source run identity');
  require(Array.isArray(x.records) &&
    x.records.length === index.timestamps.length * 2, 'Incomplete source matrix');
  const clock = new Set(index.timestamps),
    seen = new Set<string>();
  for (const r of x.records) {
    const k = r.body_id + '/' + r.timestamp_utc;
    require(!seen.has(k) &&
      clock.has(r.timestamp_utc) &&
      r.site_id === id &&
      r.release_id === index.release_id &&
      x.runs.some(
        (run) => run.run_id === r.run_id && run.body_id === r.body_id,
      ), 'Duplicate, stale or mismatched source record');
    seen.add(k);
    require(['available', 'unknown'].includes(r.quality_state), 'Unsupported quality state');
    require(r.quality_state === 'available'
      ? r.azimuth_deg !== null &&
          Number.isFinite(r.azimuth_deg) &&
          r.azimuth_deg >= 0 &&
          r.azimuth_deg < 360 &&
          r.elevation_deg !== null &&
          Number.isFinite(r.elevation_deg) &&
          Math.abs(r.elevation_deg) <= 90
      : r.azimuth_deg === null && r.elevation_deg === null, 'Invalid or fabricated angle');
  }
  return x;
}
