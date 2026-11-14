import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { classify, both, releaseSchema, skyPoint } from './science';
const raw = JSON.parse(readFileSync('public/data/release.json', 'utf8'));
describe('scientific contract', () => {
  it('loads authentic release', () => expect(releaseSchema.parse(raw).samples).toHaveLength(3364));
  it.each([null, NaN, Infinity])('propagates unknown %s', (value) =>
    expect(classify(value)).toBe('unknown'),
  );
  it('retains signed states and numerical boundary', () => {
    expect(classify(-1)).toBe('blocked');
    expect(classify(1)).toBe('visible');
    expect(classify(0)).toBe('boundary');
  });
  it('implements all combined states', () => {
    for (const a of ['visible', 'blocked', 'boundary', 'unknown'] as const)
      for (const b of ['visible', 'blocked', 'boundary', 'unknown'] as const)
        expect(both(a, b)).toBe(
          [a, b].includes('blocked')
            ? 'blocked'
            : [a, b].includes('unknown')
              ? 'unknown'
              : [a, b].includes('boundary')
                ? 'boundary'
                : 'visible',
        );
  });
  it('projects north and east clockwise and zenith at center', () => {
    expect(skyPoint(0, 0)).toEqual({ x: 200, y: 65 });
    expect(skyPoint(90, 0).x).toBe(335);
    expect(skyPoint(40, 90)).toEqual({ x: 200, y: 200 });
  });
  it.each(['release', 'site', 'source', 'null', 'azimuth', 'order', 'run', 'matrix'])(
    'rejects %s fault',
    (fault) => {
      const r = structuredClone(raw);
      if (fault === 'release') r.samples[0].release_id = 'wrong';
      if (fault === 'site') r.samples[0].site_id = 'im2';
      if (fault === 'source') r.sources = [];
      if (fault === 'null') r.samples[0].elevation_deg = null;
      if (fault === 'azimuth') r.samples[0].azimuth_deg = 360;
      if (fault === 'order') [r.samples[0], r.samples[1]] = [r.samples[1], r.samples[0]];
      if (fault === 'run') r.runs[0].release_id = 'wrong';
      if (fault === 'matrix') r.samples.pop();
      expect(releaseSchema.safeParse(r).success).toBe(false);
    },
  );
});
