import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
// Fault injection is isolated to this browser context. No scientific archive is changed.
const source = JSON.parse(readFileSync('public/data/release.json', 'utf8'));
const manifest = JSON.parse(readFileSync('public/data/manifest.json', 'utf8'));
for (const fault of ['unknown', 'boundary'] as const)
  test(`honest ${fault} scientific UI state`, async ({ page }) => {
    const release = structuredClone(source);
    const row = release.samples.find(
      (sample: any) =>
        sample.site_id === 'im1' &&
        sample.body_id === 10 &&
        sample.timestamp_utc === release.timestamps[0],
    );
    row.elevation_deg = fault === 'unknown' ? null : 0;
    row.azimuth_deg = fault === 'unknown' ? null : row.azimuth_deg;
    row.quality_state = fault === 'unknown' ? 'unknown' : 'available';
    const bytes = JSON.stringify(release);
    const hash = createHash('sha256').update(bytes).digest('hex');
    await page.route('**/data/release.json', (route) =>
      route.fulfill({ body: bytes, contentType: 'application/json' }),
    );
    await page.route('**/data/manifest.json', (route) =>
      route.fulfill({ json: { ...manifest, release_sha256: hash } }),
    );
    await page.goto('/explore?legacy=1');
    await expect(page.getByRole('slider')).toBeVisible();
    if (fault === 'unknown') {
      await expect(page.getByTestId('A-10-elevation')).toHaveText('Unavailable');
      await expect(page.getByTestId('A-sun-marker')).toHaveCount(0);
      await expect(page.getByTestId('comparison-summary')).toContainText('unknown');
    } else {
      await expect(page.getByTestId('A-10-elevation')).toHaveText('+0.000°');
      await expect(page.getByText('At numerical boundary', { exact: true })).toBeVisible();
      await page.getByRole('button', { name: 'Calibrated 2D view' }).click();
      const marker = page.getByTestId('A-sun-marker');
      expect(await marker.getAttribute('data-y')).toBe(await marker.getAttribute('data-horizon-y'));
    }
  });
