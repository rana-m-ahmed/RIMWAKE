import { test, expect } from '@playwright/test';
for (const mode of ['reduced', 'no-webgl'] as const)
  test(`${mode}: complete story and real Explorer remain usable without 3D`, async ({ page }) => {
    if (mode === 'reduced') await page.emulateMedia({ reducedMotion: 'reduce' });
    else
      await page.addInitScript(() => {
        const original = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function (type, ...args) {
          if (String(type).includes('webgl')) return null;
          return original.apply(this, [type, ...args] as any);
        } as typeof original;
      });
    const requests: string[] = [];
    page.on('request', (r) => requests.push(r.url()));
    await page.goto('/');
    await page.getByRole('button', { name: 'Chapter 04: Compare' }).click();
    await expect(page.locator('#chapter-3')).toContainText('\u22124.126\u00b0');
    await expect(page.locator('canvas')).toHaveCount(0);
    expect(requests.some((r) => r.endsWith('.glb'))).toBe(false);
    await page.getByRole('link', { name: 'Inspect this exact moment' }).click();
    await expect(page.getByRole('slider')).toBeVisible();
    await expect(page.getByTestId('A-sun-marker')).toBeVisible();
    await page.getByRole('slider').fill('150');
    await expect(page.getByTestId('A-10-elevation')).not.toHaveText('Unavailable');
  });
test('WebGL context loss switches Explorer to calibrated SVG without changing measurements', async ({
  page,
}) => {
  await page.goto('/explore');
  await expect(page.locator('canvas')).toHaveCount(2);
  await page.waitForLoadState('networkidle');
  const reading = await page.getByTestId('A-10-elevation').innerText();
  await page
    .locator('canvas')
    .first()
    .evaluate((c) => c.dispatchEvent(new Event('webglcontextlost', { cancelable: true })));
  await expect(page.locator('canvas')).toHaveCount(0);
  await expect(page.getByTestId('A-10-elevation')).toHaveText(reading);
  await expect(page.getByTestId('A-sun-marker')).toBeVisible();
});
test('failed lunar model retains the illustrated poster and working story links', async ({
  page,
}) => {
  await page.route('**/assets/moon-cinema.glb', (r) => r.abort());
  await page.goto('/');
  await expect(page.locator('img[src="/assets/moon-opening-desktop.webp"]')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Go straight to Explorer' })).toBeVisible();
  await page.getByRole('link', { name: 'Go straight to Explorer' }).click();
  await expect(page.getByRole('slider')).toBeVisible();
});
test('repeated navigation releases story scenes and restores exactly two Explorer views', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  for (let i = 0; i < 3; i++) {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.getByRole('link', { name: 'Go straight to Explorer' }).click();
    await expect(page.locator('canvas')).toHaveCount(2);
    await page
      .getByRole('navigation', { name: 'Primary', exact: true })
      .getByRole('link', { name: 'Field Guide' })
      .click();
    await expect(page.locator('canvas')).toHaveCount(0);
  }
  expect(errors).toEqual([]);
});
