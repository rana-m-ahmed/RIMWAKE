export const ATLAS_RELEASE = 'rimwake-p0-atlas-20261115-v1';
export type State = 'visible' | 'blocked' | 'boundary' | 'unknown';
export type Layer = 'sun' | 'earth' | 'joint';
export type Scenario = 'baseline' | 'delayed';
export type Request = {
  a: string;
  b: string;
  start: string;
  hours: number;
  delay: number;
  scenario: Scenario;
  elapsed: number;
  focus: 'A' | 'B';
  layer: Layer;
  view: 'atlas' | 'sky';
};
export const DEFAULT: Request = {
  a: 'im1',
  b: 'im2',
  start: '2026-11-14T00:00:00Z',
  hours: 168,
  delay: 72,
  scenario: 'baseline',
  elapsed: 0,
  focus: 'A',
  layer: 'joint',
  view: 'atlas',
};
export type Site = {
  id: string;
  name: string;
  mission: string;
  region: string;
  latitude_deg: number;
  longitude_deg_east: number;
  url: string;
  sha256: string;
  source_url: string;
  observer_height_km: number;
  observer_is_hypothetical: boolean;
};
export type Index = {
  schema_version: string;
  release_id: string;
  start_utc: string;
  end_utc: string;
  cadence_seconds: number;
  timestamps: string[];
  sites: Site[];
  epsilon_deg: number;
  model: string;
  limitations: string[];
  source: { url: string; raw_sha256: string; raw_url: string; frame: string };
  validation: { status: string; independent_ephemeris_check: string; frame_reconciliation: string };
};
export type Row = {
  timestamp_utc: string;
  azimuth_deg: number | null;
  elevation_deg: number | null;
  quality_state: string;
  body_id: number;
  site_id: string;
  run_id: string;
  release_id: string;
};
export type Run = {
  run_id: string;
  body_id: number;
  site_id: string;
  raw_url: string;
  raw_path: string;
  raw_sha256: string;
  request_url: string;
  retrieved_at_utc: string;
  api_version: string;
};
export type Series = {
  schema_version: string;
  release_id: string;
  site_id: string;
  model: string;
  epsilon_deg: number;
  records: Row[];
  runs: Run[];
};
export type Bracket = {
  body: 'Sun' | 'Earth';
  start: string;
  end: string;
  before: State;
  after: State;
};
export type Metric = {
  above: number;
  unknown: number;
  boundary: number;
  expected: number;
  longest: { start: string; end: string; count: number; hours: number } | null;
};
export type Summary = {
  site: string;
  scenario: Scenario;
  start: string;
  end: string;
  sun: Metric;
  earth: Metric;
  joint: Metric;
  complete: boolean;
  minimumSun: number | null;
  minimumEarth: number | null;
  crossings: Bracket[];
};
export type Track = { slot: 'A' | 'B'; scenario: Scenario; start: string; states: State[] };
export type Analysis = {
  request: Request;
  utc: string;
  records: [Row[], Row[]];
  summaries: Summary[];
  tracks: Track[];
  overview: [State[], State[]];
  runs: Run[];
  csv: string;
  explanation: string;
  changes: [string, string];
};
export const addHours = (stamp: string, hours: number) =>
  new Date(Date.parse(stamp) + hours * 3600000).toISOString().replace('.000Z', 'Z');
export const utcLabel = (stamp: string, short = false) =>
  new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    ...(short ? {} : { year: 'numeric' }),
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
    hourCycle: 'h23',
  }).format(new Date(stamp));
export const angle = (v: number | null | undefined) =>
  v == null ? 'Unknown' : `${v < 0 ? '\u2212' : '+'}${Math.abs(v).toFixed(3)}\u00b0`;
export const pct = (m: Metric) => ((100 * m.above) / m.expected).toFixed(1);
export function classify(row: Row | undefined, epsilon = 1e-6): State {
  if (
    !row ||
    row.quality_state !== 'available' ||
    row.elevation_deg === null ||
    !Number.isFinite(row.elevation_deg) ||
    row.azimuth_deg === null ||
    !Number.isFinite(row.azimuth_deg)
  )
    return 'unknown';
  return row.elevation_deg > epsilon
    ? 'visible'
    : row.elevation_deg < -epsilon
      ? 'blocked'
      : 'boundary';
}
export const joint = (a: State, b: State): State =>
  a === 'unknown' || b === 'unknown'
    ? 'unknown'
    : a === 'blocked' || b === 'blocked'
      ? 'blocked'
      : a === 'boundary' || b === 'boundary'
        ? 'boundary'
        : 'visible';
export const stateWords = (s: State) =>
  ({
    visible: 'Above horizon',
    blocked: 'Below horizon',
    boundary: 'At numerical boundary',
    unknown: 'Unknown',
  })[s];
export function requestError(index: Index, r: Request): string | null {
  if (![r.a, r.b].every((id) => index.sites.some((s) => s.id === id)))
    return 'Choose two documented sites from this archive.';
  if (!index.timestamps.includes(r.start))
    return 'Choose an exact hourly UTC within the archive. No positions are estimated.';
  if (!Number.isInteger(r.hours) || r.hours < 24 || r.hours > 336)
    return 'Choose a window from 24 to 336 whole hours.';
  if (!Number.isInteger(r.delay) || r.delay < 0 || r.delay > 336)
    return 'Choose a delay from 0 to 336 whole hours.';
  if (addHours(r.start, r.hours + r.delay) > index.end_utc)
    return 'The delayed window extends beyond this archive. Choose an earlier start, shorter duration or smaller delay.';
  if (!Number.isInteger(r.elapsed) || r.elapsed < 0 || r.elapsed > r.hours)
    return 'The inspection cursor is outside this mission window.';
  if (
    !['baseline', 'delayed'].includes(r.scenario) ||
    !['A', 'B'].includes(r.focus) ||
    !['sun', 'earth', 'joint'].includes(r.layer) ||
    !['atlas', 'sky'].includes(r.view)
  )
    return 'This comparison contains an unsupported view setting.';
  return null;
}
export function comparisonURL(r: Request) {
  return (
    '/explore?' +
    new URLSearchParams({
      v: '2',
      r: ATLAS_RELEASE,
      a: r.a,
      b: r.b,
      ws: r.start,
      h: String(r.hours),
      dh: String(r.delay),
      scenario: r.scenario,
      e: String(r.elapsed),
      focus: r.focus,
      layer: r.layer,
      view: r.view,
    })
  );
}
export function readRequest(search: string): { request: Request; error?: string } {
  const q = new URLSearchParams(search);
  if (!q.size || (q.get('case') === 'delay-72h' && !q.has('r') && !q.has('v')))
    return { request: { ...DEFAULT } };
  if (q.get('v') !== '2' || q.get('r') !== ATLAS_RELEASE)
    return {
      request: { ...DEFAULT },
      error:
        'This comparison refers to an unsupported release. Reset to the current archived example.',
    };
  const required = ['a', 'b', 'ws', 'h', 'dh', 'scenario', 'e', 'focus', 'layer', 'view'];
  if (required.some((k) => !q.has(k)))
    return {
      request: { ...DEFAULT },
      error: 'This comparison link is incomplete. Reset to the archived example.',
    };
  return {
    request: {
      a: q.get('a')!,
      b: q.get('b')!,
      start: q.get('ws')!,
      hours: Number(q.get('h')),
      delay: Number(q.get('dh')),
      scenario: q.get('scenario') as Scenario,
      elapsed: Number(q.get('e')),
      focus: q.get('focus') as Request['focus'],
      layer: q.get('layer') as Layer,
      view: q.get('view') as Request['view'],
    },
  };
}
