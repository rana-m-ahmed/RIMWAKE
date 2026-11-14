import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import type { Release } from '../science';
import type { Selection } from './selection';
import {
  clockFor,
  observationURL,
  parseObservation,
  findMoments,
  polarPoint,
  elevationDifference,
  observationCSV,
  observationText,
} from './observations';
const r = JSON.parse(readFileSync('public/data/release.json', 'utf8')) as Release;
const s: Selection = {
  a: 'im1',
  b: 'im2',
  mode: 'coarse',
  index: 150,
  mobile: 'A',
  view: 'calibrated',
};
const records = ['im1', 'im2'].flatMap((id) =>
  [10, 399].map((body) =>
    r.samples.find(
      (row) =>
        row.site_id === id && row.body_id === body && row.timestamp_utc === r.timestamps[150],
    )!,
  ),
);
describe('reproducible observations', () => {
  it('roundtrips sites, exact UTC, release and view in both windows', () => {
    for (const mode of ['coarse', 'refined'] as const) {
      const selection = { ...s, mode, index: mode === 'coarse' ? 150 : 4 };
      expect(
        parseObservation(
          r,
          new URL(observationURL(r, selection), 'https://example.test').searchParams,
        ),
      ).toMatchObject({
        explicit: true,
        selection: { a: s.a, b: s.b, mode, index: selection.index, view: s.view },
      });
    }
  });
  it('rejects unsupported times, stale releases, partial states, sites and views without snapping', () => {
    for (const [key, value] of [
      ['t', '2026-11-14T00:01:00Z'],
      ['r', 'old'],
      ['a', 'unreleased'],
      ['view', 'terrain'],
      ['m', 'continuous'],
    ]) {
      const query = new URL(observationURL(r, s), 'https://example.test').searchParams;
      query.set(key, value);
      expect(parseObservation(r, query).error).toBeTruthy();
    }
    expect(parseObservation(r, new URLSearchParams('a=im1')).error).toBeTruthy();
    expect(parseObservation(r, new URLSearchParams('case=sunrise-im1')).explicit).toBe(false);
  });
  it('groups only consecutive matching samples, retaining exact run endpoints', () => {
    for (const condition of ['joint', 'sun-only', 'earth-only', 'different'] as const) {
      const result = findMoments(r, 'im1', 'im2', 'coarse', condition, 'A');
      expect(result.count).toBe(result.runs.reduce((n, x) => n + x.count, 0));
      for (const run of result.runs) {
        expect(run.count).toBe(run.end - run.start + 1);
        expect(result.matches.slice(run.start, run.end + 1).every(Boolean)).toBe(true);
        expect(result.matches[run.start - 1] ?? false).toBe(false);
        expect(result.matches[run.end + 1] ?? false).toBe(false);
      }
    }
  });
  it('reports zero same-site contrast and excludes unknown samples from discovery', () => {
    expect(findMoments(r, 'im1', 'im1', 'coarse', 'different', 'A').count).toBe(0);
    const fault = structuredClone(r);
    const row = fault.samples.find(
      (row) => row.site_id === 'im1' && row.timestamp_utc === r.timestamps[0],
    )!;
    row.quality_state = 'unknown';
    row.elevation_deg = null;
    row.azimuth_deg = null;
    const result = findMoments(fault, 'im1', 'im2', 'coarse', 'different', 'A');
    expect(result.unknown).toBe(1);
    expect(result.matches[0]).toBe(false);
  });
  it('preserves geographic conventions at pole and cardinal meridians', () => {
    expect(polarPoint(-90, 0).x).toBeCloseTo(300);
    expect(polarPoint(-90, 0).y).toBeCloseTo(285);
    expect(polarPoint(-75, 0).y).toBeCloseTo(80);
    expect(polarPoint(-75, 90).x).toBeCloseTo(505);
    expect(polarPoint(-75, 180).y).toBeCloseTo(490);
    expect(polarPoint(-75, 270).x).toBeCloseTo(95);
  });
  it('computes body-specific differences without inventing unavailable values', () => {
    expect(elevationDifference(records[0], records[2])).toBe(
      records[2].elevation_deg! - records[0].elevation_deg!,
    );
    expect(elevationDifference({ ...records[0], quality_state: 'unknown' }, records[2])).toBe(null);
    expect(elevationDifference(records[1], records[3])).not.toBe(null);
  });
  it('exports four exact rows with qualifications, source lineage and precise numbers', () => {
    const csv = observationCSV(r, records, 'coarse'),
      text = observationText(r, records, 'coarse');
    expect(csv.trim().split('\r\n')).toHaveLength(5);
    expect(csv).toContain(String(records[0].elevation_deg));
    expect(csv).toContain('raw_sha256');
    expect(csv).toContain('independent ephemeris validation not run');
    expect(text).toContain(r.release_id);
    expect(text).toContain(records[0].timestamp_utc);
    expect(text).toContain('terrain, finite discs');
  });
});
