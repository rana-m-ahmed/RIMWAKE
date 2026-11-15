import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { analyze } from './engine';
import { validateIndex, validateSeries } from './validation';
import { moonPoint } from './geography';
import {
  addHours,
  classify,
  comparisonURL,
  DEFAULT,
  readRequest,
  requestError,
  type Series,
} from './model';
const index = validateIndex(JSON.parse(readFileSync('public/data/atlas/index.json', 'utf8')));
const load = (id: string) =>
  validateSeries(JSON.parse(readFileSync(`public/data/atlas/${id}.json`, 'utf8')), index, id);
const im1 = load('im1'),
  im2 = load('im2');
describe('source-backed mission windows', () => {
  it('globe pins use the documented prime meridian, east and polar orientation', () => {
    expect(moonPoint(0, 0)).toEqual([0, 0, 2]);
    expect(moonPoint(0, 90)[0]).toBeCloseTo(2);
    expect(moonPoint(90, 0)[1]).toBeCloseTo(2);
    expect(moonPoint(-90, 0)[1]).toBeCloseTo(-2);
    for (const site of index.sites) {
      const p = moonPoint(site.latitude_deg, site.longitude_deg_east);
      expect(Math.hypot(...p)).toBeCloseTo(2);
      expect((Math.asin(p[1] / 2) * 180) / Math.PI).toBeCloseTo(site.latitude_deg);
    }
  });
  it('uses 169 inclusive hourly endpoints and actual original/delayed counts', () => {
    const a = analyze(index, [im1, im2], DEFAULT);
    expect(a.summaries.map((s) => s.joint.above)).toEqual([117, 165, 169, 169]);
    expect(a.summaries.every((s) => s.joint.expected === 169)).toBe(true);
    expect(a.changes[0]).toContain('52 more');
    expect(a.explanation).toContain('28.4');
  });
  it('one shared active UTC moves both sites by the exact delay', () => {
    const a = analyze(index, [im1, im2], { ...DEFAULT, scenario: 'delayed', elapsed: 52 });
    expect(a.utc).toBe('2026-11-19T04:00:00Z');
    expect(a.records.flat().every((row) => row.timestamp_utc === a.utc)).toBe(true);
    expect(a.records[0][0]).toEqual(
      im1.records.find((row) => row.body_id === 10 && row.timestamp_utc === a.utc),
    );
  });
  it('does not interpolate crossing instants or call point counts hours', () => {
    const a = analyze(index, [im1, im2], DEFAULT),
      event = a.summaries[0].crossings.find((e) => e.body === 'Sun');
    expect(event).toMatchObject({ start: '2026-11-16T03:00:00Z', end: '2026-11-16T04:00:00Z' });
    expect(a.summaries[0].joint.longest).toMatchObject({ count: 117, hours: 116 });
  });
  it('zero delay and same-site comparisons are honest', () => {
    const a = analyze(index, [im1, im1], { ...DEFAULT, b: 'im1', delay: 0 });
    expect(a.explanation).toContain('same place');
    expect(a.changes.every((c) => c.startsWith('No change'))).toBe(true);
  });
  it('unknown breaks a run and suppresses comparative verdicts', () => {
    const damaged = structuredClone(im1);
    const row = damaged.records.find(
      (r) => r.body_id === 10 && r.timestamp_utc === '2026-11-18T00:00:00Z',
    )!;
    row.quality_state = 'unknown';
    row.elevation_deg = null;
    row.azimuth_deg = null;
    const a = analyze(index, [damaged, im2], DEFAULT);
    expect(a.summaries[0].joint.unknown).toBe(1);
    expect(a.explanation).toContain('Coverage is incomplete');
    expect(a.summaries[0].joint.longest!.count).toBeLessThan(117);
  });
  it('a single visible point has zero endpoint span; boundaries are not above', () => {
    const custom = structuredClone(im1);
    for (const row of custom.records)
      if (row.body_id === 10)
        row.elevation_deg = row.timestamp_utc === '2026-11-14T01:00:00Z' ? 1 : 0;
    const a = analyze(index, [custom, im2], { ...DEFAULT, hours: 24 });
    expect(a.summaries[0].sun.longest).toMatchObject({ count: 1, hours: 0 });
    expect(a.summaries[0].sun.boundary).toBe(24);
    expect(classify({ ...custom.records[0], quality_state: 'available', elevation_deg: 0 })).toBe(
      'boundary',
    );
  });
  it('rejects unsupported time ranges, fractional cadence and stale releases', () => {
    expect(requestError(index, { ...DEFAULT, start: addHours(index.end_utc, -100) })).toContain(
      'beyond',
    );
    expect(requestError(index, { ...DEFAULT, start: '2026-11-14T00:01:00Z' })).toContain(
      'exact hourly',
    );
    expect(requestError(index, { ...DEFAULT, hours: 23 })).toContain('24');
    expect(requestError(index, { ...DEFAULT, delay: -1 })).toContain('0');
    expect(() => analyze(index, [{ ...im1, release_id: 'stale' }, im2], DEFAULT)).toThrow(
      'mismatch',
    );
  });
  it('a canonical link round-trips the entire comparison', () => {
    const r = { ...DEFAULT, a: 'ce4', elapsed: 68, scenario: 'delayed' as const };
    expect(readRequest(comparisonURL(r).split('?')[1]).request).toEqual(r);
    expect(readRequest('?v=2&r=other').error).toBeTruthy();
  });
  it('far-side and northern data obey the same contract', () => {
    for (const id of ['ch3', 'ap11', 'ap17', 'ce4']) expect(load(id).records).toHaveLength(4322);
    const a = analyze(index, [load('ce4'), load('ap11')], { ...DEFAULT, a: 'ce4', b: 'ap11' });
    expect(a.summaries[0].earth.above).toBe(0);
    expect(a.explanation).not.toContain('radio');
  });
  it('CSV contains both scenarios and exact source identity', () => {
    const a = analyze(index, [im1, im2], DEFAULT),
      lines = a.csv.trim().split('\r\n');
    expect(lines).toHaveLength(1 + 169 * 2 * 2 * 2);
    expect(a.csv).toContain(im1.runs[0].raw_sha256);
    expect(a.csv).toContain('"delayed"');
    expect(a.csv).toContain('"2026-11-24T00:00:00Z"');
  });
  it('rejects malformed matrices, quality states and observers before display', () => {
    const x = structuredClone(im1);
    x.records[1] = x.records[0];
    expect(() => validateSeries(x, index, 'im1')).toThrow();
    const y = structuredClone(im2);
    y.records[0].elevation_deg = NaN;
    expect(() => validateSeries(y, index, 'im2')).toThrow();
    const z = structuredClone(index);
    z.sites[0].observer_height_km = 1;
    expect(() => validateIndex(z)).toThrow();
  });
});
