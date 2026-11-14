import { describe, it, expect } from 'vitest';
import { direction } from './skyVectors';
import { readFileSync } from 'node:fs';
describe('local sky projection', () => {
  it('uses north -Z, east +X, zenith +Y', () => {
    expect(direction(0, 0, 1)).toEqual([0, 0, -1]);
    expect(direction(90, 0, 1)[0]).toBeCloseTo(1);
    expect(direction(0, 90, 1)[1]).toBeCloseTo(1);
  });
  it('preserves actual azimuth and signed elevation for every released reading', () => {
    const r = JSON.parse(readFileSync('public/data/release.json', 'utf8'));
    for (const row of [...r.samples, ...r.refined_samples]) {
      if (row.quality_state !== 'available') continue;
      const [x, y, z] = direction(row.azimuth_deg, row.elevation_deg, 1);
      expect(Math.hypot(x, y, z)).toBeCloseTo(1, 12);
      expect((Math.asin(y) * 180) / Math.PI).toBeCloseTo(row.elevation_deg, 10);
      expect(((Math.atan2(x, -z) * 180) / Math.PI + 360) % 360).toBeCloseTo(row.azimuth_deg, 10);
    }
  });
});
