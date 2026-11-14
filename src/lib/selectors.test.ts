import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { releaseSchema } from '../science';
import {
  plotLimit,
  sampleIndex,
  sampleKey,
  seriesStates,
  signedPoint,
  sphereVector,
  stateFor,
} from './selectors';
import { CASES, verifiedCase } from '../story/cases';
const release = releaseSchema.parse(JSON.parse(readFileSync('public/data/release.json', 'utf8')));
describe('Meridian Cut signed geometry and released cases', () => {
  it('places positive and negative elevations on opposite sides of zero without clamping', () => {
    for (const width of [220, 320, 600]) {
      const zero = signedPoint(90, 0, width, 250, 20);
      expect(signedPoint(90, -4, width, 250, 20).y).toBeGreaterThan(zero.y);
      expect(signedPoint(90, 4, width, 250, 20).y).toBeLessThan(zero.y);
      expect(signedPoint(0, 0, width, 250, 20).x).toBe(44);
      expect(signedPoint(360, 0, width, 250, 20).x).toBe(width - 20);
    }
  });
  it('contains every released elevation in the same fixed signed scale', () => {
    const limit = plotLimit(release);
    for (const row of release.samples) expect(Math.abs(row.elevation_deg!)).toBeLessThan(limit);
  });
  it('propagates unavailable quality even if numeric fields exist', () => {
    expect(stateFor({ ...release.samples[0], quality_state: 'unknown' }, release.epsilon_deg)).toBe(
      'unknown',
    );
    expect(stateFor(undefined, release.epsilon_deg)).toBe('unknown');
  });
  it('selects exact records and computes timeline states with the released tolerance', () => {
    const index = sampleIndex(release.samples);
    expect(index.get(sampleKey('im1', 10, release.timestamps[0]))).toEqual(release.samples[0]);
    expect(
      seriesStates(release.samples, 'im1', 10, [release.timestamps[0]], release.epsilon_deg),
    ).toEqual(['blocked']);
    expect(
      seriesStates(release.samples, 'im2', 'both', [release.timestamps[0]], release.epsilon_deg),
    ).toEqual(['blocked']);
  });
  it('binds every case and both story moments to real records in the right release', () => {
    for (const item of CASES) expect(verifiedCase(release, item.id)).toEqual(item);
    expect(verifiedCase({ ...release, release_id: 'other' }, CASES[0].id)).toBeNull();
    expect(verifiedCase(release, 'fabricated')).toBeNull();
  });
  it('grounds the contrast case in the actual opposite Sun/Earth states', () => {
    const item = verifiedCase(release, CASES[0].id)!;
    const index = sampleIndex(release.samples);
    expect(stateFor(index.get(sampleKey(item.a, 10, item.timestamp)), release.epsilon_deg)).toBe(
      'blocked',
    );
    expect(stateFor(index.get(sampleKey(item.b, 10, item.timestamp)), release.epsilon_deg)).toBe(
      'visible',
    );
    expect(stateFor(index.get(sampleKey(item.a, 399, item.timestamp)), release.epsilon_deg)).toBe(
      'visible',
    );
    expect(stateFor(index.get(sampleKey(item.b, 399, item.timestamp)), release.epsilon_deg)).toBe(
      'blocked',
    );
  });
  it('keeps east-positive context coordinates consistent with the NASA map centre', () => {
    expect(sphereVector(0, 0)).toEqual({ x: 0, y: 0, z: 1 });
    expect(sphereVector(0, 90).x).toBeCloseTo(1);
    expect(sphereVector(90, 0).y).toBeCloseTo(1);
    for (const site of release.sites) {
      const v = sphereVector(site.latitude_deg, site.longitude_deg_east);
      expect(Math.hypot(v.x, v.y, v.z)).toBeCloseTo(1);
      expect((Math.asin(v.y) * 180) / Math.PI).toBeCloseTo(site.latitude_deg);
      expect((Math.atan2(v.x, v.z) * 180) / Math.PI).toBeCloseTo(site.longitude_deg_east);
    }
  });
});
