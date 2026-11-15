import { test, expect } from '@playwright/test';
for (const mode of ['reduced', 'no-webgl'] as const)
  test(`${mode}: the complete mission story and comparison remain usable without 3D`, async ({
    page,
  }) => {
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
    await page.locator('#story-3').scrollIntoViewIfNeeded();
    await expect(page.locator('#story-3')).toContainText('69.2%');
    await expect(page.locator('canvas')).toHaveCount(0);
    expect(requests.some((u) => u.endsWith('.glb'))).toBe(false);
    await page.getByRole('link', { name: 'Inspect the original window' }).click();
    await expect(page.getByTestId('atlas-utc')).toHaveAttribute('data-utc', '2026-11-14T00:00:00Z');
    await page.getByRole('slider', { name: 'Inspection hour', exact: true }).fill('150');
    await expect(page.getByTestId('atlas-utc')).toHaveAttribute('data-utc', '2026-11-20T06:00:00Z');
  });
test('WebGL context loss retains map, exact sky and window calculations', async ({ page }) => {
  await page.goto('/explore');
  await expect(page.locator('canvas')).toHaveCount(1);
  await page.waitForLoadState('networkidle');
  const reading = await page.getByTestId('reading-10').innerText();
  await page
    .locator('canvas')
    .evaluate((c) => c.dispatchEvent(new Event('webglcontextlost', { cancelable: true })));
  await expect(page.locator('canvas')).toHaveCount(0);
  await expect(page.getByTestId('reading-10')).toHaveText(reading);
  await expect(page.getByRole('img', { name: /Lunar longitude/ })).toBeVisible();
});
test('failed lunar model retains poster and working mission comparison', async ({ page }) => {
  await page.route('**/assets/moon-cinema.glb', (r) => r.abort());
  await page.goto('/');
  await expect(page.locator('img[src="/assets/moon-opening-desktop.webp"]')).toBeVisible();
  await page.getByRole('link', { name: 'Open the mission atlas' }).first().click();
  await expect(page.getByTestId('atlas-utc')).toHaveAttribute('data-utc', /.+Z/);
});
test('repeated navigation releases scenes and restores one atlas canvas', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  for (let i = 0; i < 3; i++) {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.getByRole('link', { name: 'Open the mission atlas' }).first().click();
    await expect(page.locator('canvas')).toHaveCount(1);
    await page
      .getByRole('navigation', { name: 'Primary', exact: true })
      .getByRole('link', { name: 'Field Guide' })
      .click();
    await expect(page.locator('canvas')).toHaveCount(0);
  }
  expect(errors).toEqual([]);
});
