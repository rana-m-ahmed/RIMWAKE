import type { Release } from '../science';
export const CASES = [
  {
    id: 'two-skies-one-instant',
    release_id: 'rimwake-p0-20261114-v1',
    title: 'Same moment. Different sky.',
    mode: 'coarse' as const,
    a: 'im1',
    b: 'im2',
    timestamp: '2026-11-14T00:00:00Z',
    next_timestamp: '2026-11-14T04:00:00Z',
    description:
      'At one shared instant, the Sun is below the tangent plane at A and above it at B. Earth has the opposite classification.',
  },
  {
    id: 'sunrise-im1',
    release_id: 'rimwake-p0-20261114-v1',
    title: 'Ten minutes around a threshold.',
    mode: 'refined' as const,
    a: 'im1',
    b: 'im2',
    timestamp: '2026-11-16T03:30:00Z',
    next_timestamp: '2026-11-16T03:40:00Z',
    description:
      'A real ten-minute bracket contains the Sun-centre crossing at the IM-1 coordinate observer.',
  },
];
export function verifiedCase(release: Release, id: string) {
  const item = CASES.find((c) => c.id === id);
  if (!item || item.release_id !== release.release_id) return null;
  const rows = item.mode === 'coarse' ? release.samples : release.refined_samples;
  for (const site of [item.a, item.b])
    for (const body of [10, 399])
      for (const timestamp of [item.timestamp, item.next_timestamp])
        if (
          !rows.some(
            (row) =>
              row.site_id === site &&
              row.body_id === body &&
              row.timestamp_utc === timestamp &&
              row.quality_state === 'available',
          )
        )
          return null;
  return item;
}
