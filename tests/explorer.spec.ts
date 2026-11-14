import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
const release = JSON.parse(readFileSync('public/data/release.json', 'utf8'));
test('shared UTC, angles, sky markers, both selectors, no-difference state, evidence and refinement', async ({
  page,
}) => {
  await page.goto('/explore');
  await expect(page.getByRole('heading', { name: 'One time. Two horizons.' })).toBeVisible();
  const slider = page.getByRole('slider', { name: 'UTC sample' });
  await slider.fill('150');
  const sample = release.samples.find(
    (r: any) =>
      r.site_id === 'im1' && r.body_id === 10 && r.timestamp_utc === release.timestamps[150],
  );
  await expect(page.getByTestId('A-10-elevation')).toHaveText(
    `${sample.elevation_deg < 0 ? '−' : '+'}${Math.abs(sample.elevation_deg).toFixed(3)}°`,
  );
  await expect(page.getByTestId('A-sun-marker')).toHaveAttribute(
    'data-elevation',
    String(sample.elevation_deg),
  );
  const plotted = await page.getByTestId('A-sun-marker').evaluate((element) => ({
    y: Number(element.getAttribute('data-y')),
    zero: Number(element.getAttribute('data-horizon-y')),
  }));
  expect(sample.elevation_deg < 0 ? plotted.y > plotted.zero : plotted.y < plotted.zero).toBe(true);
  await page.getByRole('button', { name: 'Next sample', exact: true }).click();
  await expect(slider).toHaveValue('151');
  await page.getByRole('button', { name: 'Previous sample', exact: true }).click();
  await expect(slider).toHaveValue('150');
  await page.getByRole('combobox', { name: 'Observation site B' }).selectOption('im1');
  await expect(page.getByRole('status')).toContainText('same site');
  await page.getByRole('combobox', { name: 'Observation site A' }).selectOption('im2');
  await expect(page.getByRole('status')).not.toContainText('same site');
  await page.getByRole('button', { name: 'Next crossing' }).click();
  await expect(slider).not.toHaveValue('150');
  await page.getByRole('button', { name: '10-min detail', exact: true }).click();
  await expect(slider).toHaveAttribute('max', '6');
  await page.getByRole('button', { name: 'Evidence & method' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Horizons API documentation' })).toHaveAttribute(
    'href',
    'https://ssd-api.jpl.nasa.gov/doc/horizons.html',
  );
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'Evidence & method' })).toBeFocused();
  await slider.fill('0');
  await slider.focus();
  await page.keyboard.press('ArrowRight');
  await expect(slider).toHaveValue('1');
});
test('failed releases and unavailable network fail closed', async ({ page }) => {
  await page.route('**/data/release.json', (route) =>
    route.fulfill({ json: { ...release, release_id: 'mismatched' } }),
  );
  await page.goto('/explore');
  await expect(page.getByRole('heading', { name: 'Data unavailable.' })).toBeVisible();
  await expect(page.getByRole('slider')).toHaveCount(0);
  await page.unroute('**/data/release.json');
  await page.getByRole('button', { name: 'Retry data loading' }).click();
  await expect(page.getByRole('slider')).toBeVisible();
  await page.route('**/data/release.json', (route) => route.abort());
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Data unavailable.' })).toBeVisible();
});
for (const size of [
  { width: 1440, height: 900 },
  { width: 768, height: 1024 },
  { width: 360, height: 800 },
])
  test(`responsive ${size.width}`, async ({ page }) => {
    await page.setViewportSize(size);
    await page.goto('/explore');
    await expect(page.getByRole('slider')).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.screenshot({ path: `docs/screenshots/rimwake-${size.width}.png`, fullPage: true });
    if (size.width === 360) {
      await expect(page.getByTestId('A-10-elevation')).toBeVisible();
      await expect(page.getByTestId('B-10-elevation')).not.toBeVisible();
      await page.getByRole('button', { name: 'B / Athena' }).click();
      await expect(page.getByTestId('B-10-elevation')).toBeVisible();
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.getByRole('button', { name: 'Next sample', exact: true }).click();
    await expect(page.getByRole('slider')).toHaveValue('1');
  });
test('scrubbing loaded data makes no API requests and evidence downloads exist', async ({
  page,
}) => {
  await page.goto('/explore');
  await expect(page.getByRole('slider')).toBeVisible();
  await page.waitForLoadState('networkidle');
  const requests: string[] = [];
  page.on('request', (r) => requests.push(r.url()));
  await page.getByRole('slider').fill('340');
  await page.getByRole('slider').fill('700');
  expect(requests).toEqual([]);
  for (const path of ['/data/release.json', '/data/manifest.json', '/data/evidence.zip'])
    expect((await page.request.get(path)).ok()).toBeTruthy();
});
