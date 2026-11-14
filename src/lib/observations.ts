import type { Release, Sample } from '../science';
import type { Selection } from './selection';
import { stateFor, sampleIndex, sampleKey } from './selectors';
import { signed } from './format';
export const clockFor = (r: Release, mode: Selection['mode']) =>
  mode === 'coarse'
    ? r.timestamps
    : [...new Set(r.refined_samples.map((s) => s.timestamp_utc))].sort();
export function observationURL(r: Release, s: Selection) {
  return (
    '/explore?' +
    new URLSearchParams({
      r: r.release_id,
      a: s.a,
      b: s.b,
      m: s.mode,
      t: clockFor(r, s.mode)[s.index],
      view: s.view,
    }).toString()
  );
}
export function parseObservation(
  r: Release,
  query: URLSearchParams,
): { selection?: Partial<Selection>; error?: string; explicit: boolean } {
  const explicit = ['r', 'a', 'b', 'm', 't', 'view'].some((k) => query.has(k));
  if (!explicit) return { explicit: false };
  const a = query.get('a'),
    b = query.get('b'),
    mode = query.get('m'),
    view = query.get('view') ?? 'spatial';
  if (
    query.get('r') !== r.release_id ||
    !r.sites.some((s) => s.id === a) ||
    !r.sites.some((s) => s.id === b) ||
    !['coarse', 'refined'].includes(mode ?? '') ||
    !['spatial', 'calibrated'].includes(view)
  )
    return {
      explicit: true,
      error:
        'This shared observation does not match the supported release or locations. Showing the current supported selection.',
    };
  const index = clockFor(r, mode as Selection['mode']).indexOf(query.get('t') ?? '');
  if (index < 0)
    return {
      explicit: true,
      error:
        'This UTC is not a supported sample. No position has been interpolated. Showing the current supported selection.',
    };
  return {
    explicit: true,
    selection: {
      a: a!,
      b: b!,
      mode: mode as Selection['mode'],
      index,
      view: view as Selection['view'],
    },
  };
}
export function elevationDifference(a: Sample | undefined, b: Sample | undefined) {
  return a?.quality_state === 'available' &&
    b?.quality_state === 'available' &&
    a.elevation_deg !== null &&
    b.elevation_deg !== null
    ? b.elevation_deg - a.elevation_deg
    : null;
}
export type Condition = 'joint' | 'sun-only' | 'earth-only' | 'different';
export function findMoments(
  r: Release,
  a: string,
  b: string,
  mode: Selection['mode'],
  condition: Condition,
  slot: 'A' | 'B',
) {
  const rows = mode === 'coarse' ? r.samples : r.refined_samples,
    clock = clockFor(r, mode),
    index = sampleIndex(rows);
  let unknown = 0;
  const matches = clock.map((t) => {
    const read = (id: string) =>
      [10, 399].map((body) => stateFor(index.get(sampleKey(id, body, t)), r.epsilon_deg));
    const x = read(a),
      y = read(b),
      states = condition === 'different' ? [...x, ...y] : slot === 'A' ? x : y;
    if (states.includes('unknown')) {
      unknown++;
      return false;
    }
    if (condition === 'different') return x.some((state, i) => state !== y[i]);
    return condition === 'joint'
      ? states.every((s) => s === 'visible')
      : condition === 'sun-only'
        ? states[0] === 'visible' && states[1] === 'blocked'
        : states[0] === 'blocked' && states[1] === 'visible';
  });
  const runs: { start: number; end: number; count: number }[] = [];
  matches.forEach((match, i) => {
    if (!match) return;
    const last = runs.at(-1);
    if (last && last.end === i - 1) {
      last.end = i;
      last.count++;
    } else runs.push({ start: i, end: i, count: 1 });
  });
  return { runs, unknown, count: matches.filter(Boolean).length, matches };
}
export function polarPoint(latitude: number, longitude: number) {
  const phi = (latitude * Math.PI) / 180,
    lambda = (longitude * Math.PI) / 180,
    scale = 205 / Math.cos((75 * Math.PI) / 180);
  return {
    x: 300 + scale * Math.cos(phi) * Math.sin(lambda),
    y: 285 - scale * Math.cos(phi) * Math.cos(lambda),
  };
}
export function observationCSV(r: Release, records: Sample[], mode: Selection['mode']) {
  const headers = [
    'release_id',
    'model',
    'utc',
    'slot',
    'site_id',
    'site_name',
    'latitude_deg',
    'longitude_deg_east',
    'height_km',
    'horizontal_frame',
    'body',
    'azimuth_deg',
    'elevation_deg',
    'quality_state',
    'classification',
    'cadence_seconds',
    'run_id',
    'raw_sha256',
    'source_url',
    'epsilon_deg',
    'validation',
    'limitations',
  ];
  const rows = records.map((row, i) => {
    const site = r.sites.find((s) => s.id === row.site_id)!,
      run = r.runs.find((s) => s.run_id === row.run_id)!;
    return [
      r.release_id,
      r.model,
      row.timestamp_utc,
      i < 2 ? 'A' : 'B',
      site.id,
      site.name,
      site.latitude_deg,
      site.longitude_deg_east,
      site.observer_model.height_km,
      site.horizontal_frame,
      row.body_id === 10 ? 'Sun' : 'Earth',
      row.quality_state === 'available' ? row.azimuth_deg : null,
      row.quality_state === 'available' ? row.elevation_deg : null,
      row.quality_state,
      stateFor(row, r.epsilon_deg),
      mode === 'coarse' ? 3600 : 600,
      row.run_id,
      run.raw_sha256,
      run.request_url,
      r.epsilon_deg,
      r.validation.status,
      'Hypothetical ellipsoid observer; approximate coordinates; terrain, power and RF excluded; independent ephemeris validation not run',
    ];
  });
  const cell = (v: unknown) => '"' + String(v ?? '').replaceAll('"', '""') + '"';
  return [headers, ...rows].map((row) => row.map(cell).join(',')).join('\r\n') + '\r\n';
}
export function observationText(r: Release, records: Sample[], mode: Selection['mode']) {
  return [
    'RIMWAKE / ONE MOON. TWO SITES. ONE MOMENT.',
    `Release: ${r.release_id}`,
    `Model: ${r.model}`,
    `UTC: ${records[0]?.timestamp_utc}`,
    `Cadence: ${mode === 'coarse' ? 'hourly' : 'ten-minute'} samples`,
    ...records.map((row, i) => {
      const site = r.sites.find((s) => s.id === row.site_id)!,
        run = r.runs.find((s) => s.run_id === row.run_id)!;
      return `${i < 2 ? 'A' : 'B'} / ${site.name} / ${site.latitude_deg}, ${site.longitude_deg_east} E / height ${site.observer_model.height_km} km above reference ellipsoid\n${row.body_id === 10 ? 'Sun' : 'Earth'}: elevation ${signed(row.quality_state === 'available' ? row.elevation_deg : null)}, azimuth ${row.azimuth_deg ?? 'unknown'} / ${stateFor(row, r.epsilon_deg)}\n${run.run_id} / ${run.raw_sha256}\n${run.request_url}`;
    }),
    `Numerical tolerance: ${r.epsilon_deg} degrees; not an accuracy estimate.`,
    `Hypothetical observers at approximate published coordinates. Geometric centre-of-disc; terrain, finite discs, eclipses, power and RF performance excluded. Science provisional; independent ephemeris/frame checks remain open.`,
  ].join('\n\n');
}
