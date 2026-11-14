import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
const release = JSON.parse(readFileSync('public/data/release.json', 'utf8'));
const signed = (n: number) => `${n < 0 ? '\u2212' : '+'}${Math.abs(n).toFixed(3)}\u00b0`;
test('shared UTC drives all four exact source readings; slider, arrows, keyboard and calibrated markers agree', async ({
  page,
}) => {
  await page.goto('/explore');
  await expect(page.getByRole('heading', { name: 'COMPARE THE SKIES.' })).toBeVisible();
  const slider = page.getByRole('slider', { name: 'UTC sample' });
  await slider.fill('150');
  for (const [slot, id] of [
    ['A', 'im1'],
    ['B', 'im2'],
  ])
    for (const body of [10, 399]) {
      const row = release.samples.find(
        (r: any) =>
          r.site_id === id && r.body_id === body && r.timestamp_utc === release.timestamps[150],
      );
      await expect(page.getByTestId(`${slot}-${body}-elevation`)).toHaveText(
        signed(row.elevation_deg),
      );
    }
  await page.getByRole('button', { name: 'Calibrated 2D view' }).click();
  const marker = page.getByTestId('A-sun-marker');
  const sample = release.samples.find(
    (r: any) =>
      r.site_id === 'im1' && r.body_id === 10 && r.timestamp_utc === release.timestamps[150],
  );
  await expect(marker).toHaveAttribute('data-elevation', String(sample.elevation_deg));
  const plotted = await marker.evaluate((e) => ({
    y: Number(e.getAttribute('data-y')),
    zero: Number(e.getAttribute('data-horizon-y')),
  }));
  expect(sample.elevation_deg < 0 ? plotted.y > plotted.zero : plotted.y < plotted.zero).toBe(true);
  await page.getByRole('button', { name: 'Next sample', exact: true }).click();
  await expect(slider).toHaveValue('151');
  await page.getByRole('button', { name: 'Previous sample', exact: true }).click();
  await slider.focus();
  await page.keyboard.press('ArrowRight');
  await expect(slider).toHaveValue('151');
});
test('observer sheet, same-site state, swap, difference and refinement all use shared selection', async ({
  page,
}) => {
  await page.goto('/explore');
  await expect(page.getByRole('slider')).toBeVisible();
  const a = await page.getByTestId('A-10-elevation').innerText(),
    b = await page.getByTestId('B-10-elevation').innerText();
  await page.getByRole('button', { name: 'Swap A and B' }).click();
  await expect(page.getByTestId('A-10-elevation')).toHaveText(b);
  await expect(page.getByTestId('B-10-elevation')).toHaveText(a);
  await page.getByRole('button', { name: 'Understand the difference' }).click();
  await expect(page.getByRole('dialog')).toContainText('B minus elevation at A');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Choose places' }).click();
  await page.getByRole('combobox', { name: 'Observation site A' }).selectOption('im1');
  await page.getByRole('combobox', { name: 'Observation site B' }).selectOption('im1');
  await page.getByRole('button', { name: 'Compare these observers' }).click();
  await expect(page.getByTestId('comparison-summary')).toContainText('Same site.');
  await page.getByRole('button', { name: 'Next crossing' }).click();
  await expect(page.getByRole('slider')).not.toHaveValue('0');
  await page
    .getByRole('combobox', { name: 'Sampling window', exact: true })
    .selectOption('refined');
  await expect(page.getByRole('slider')).toHaveAttribute('max', '6');
  await expect(page.getByRole('button', { name: 'Hide Horizon Loom' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Hide Horizon Loom' })).toBeVisible();
});
test('corrupt release and unavailable network fail closed, retry restores real data', async ({
  page,
}) => {
  await page.route('**/data/release.json', (r) =>
    r.fulfill({ json: { ...release, release_id: 'mismatched' } }),
  );
  await page.goto('/explore');
  await expect(page.getByRole('heading', { name: 'Data unavailable.' })).toBeVisible();
  await expect(page.getByRole('slider')).toHaveCount(0);
  await page.unroute('**/data/release.json');
  await page.getByRole('button', { name: 'Retry data loading' }).click();
  await expect(page.getByRole('slider')).toBeVisible();
  await page.route('**/data/release.json', (r) => r.abort());
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Data unavailable.' })).toBeVisible();
});
test('scrubbing loaded observations makes no external requests and reproduction downloads exist', async ({
  page,
}) => {
  await page.goto('/explore');
  await expect(page.getByRole('slider')).toBeVisible();
  await page.locator('canvas').first().waitFor();
  await page.waitForLoadState('networkidle');
  const requests: string[] = [];
  page.on('request', (r) => requests.push(r.url()));
  await page.getByRole('slider').fill('340');
  await page.getByRole('slider').fill('700');
  expect(requests.filter((url) => !url.endsWith('/favicon.svg'))).toEqual([]);
  for (const path of ['/data/release.json', '/data/manifest.json', '/data/evidence.zip'])
    expect((await page.request.get(path)).ok()).toBeTruthy();
});
for (const width of [1440, 768, 390, 360, 320])
  test(`responsive Explorer ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/explore');
    await expect(page.getByRole('slider')).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    if (width < 700) {
      await expect(page.getByTestId('A-10-elevation')).toBeVisible();
      await expect(page.getByTestId('B-10-elevation')).not.toBeVisible();
      await page.getByRole('button', { name: 'B / Athena' }).click();
      await expect(page.getByTestId('B-10-elevation')).toBeVisible();
    }
  });
