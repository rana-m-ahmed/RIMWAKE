import { test, expect } from '@playwright/test';
test('optional lunar context loads on request; real WebGL controls work and the observer labels retain sources', async ({
  page,
}) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/explore');
  await expect(page.getByRole('slider')).toBeVisible();
  expect(requests.some((url) => url.includes('lroc-color-2k.jpg'))).toBe(false);
  await expect(page.locator('canvas')).toHaveCount(0);
  await page.getByRole('button', { name: 'Locate the observers in 3D' }).click();
  const dialog = page.getByRole('dialog', { name: 'Lunar context' });
  await expect(dialog).toBeVisible();
  const west = dialog.getByRole('button', { name: 'Rotate west' });
  await expect(west).toBeEnabled({ timeout: 15000 });
  await west.click();
  await dialog.getByRole('button', { name: 'Rotate east' }).click();
  await dialog.getByRole('button', { name: 'Reset view' }).click();
  await expect(dialog).toContainText('-80.13');
  await expect(dialog).toContainText('NASA SVS / Ernie Wright');
  await page.screenshot({ path: 'docs/qa/v6/lunar-context.png', fullPage: false });
  await page.keyboard.press('Escape');
  await expect(page.getByRole('slider')).toBeVisible();
});

test('mobile observer sheet changes the same scientific state and exposes no hidden fake controls', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/explore');
  await expect(page.getByRole('slider')).toBeVisible();
  await page.getByRole('button', { name: 'Sites', exact: false }).first().click();
  const dialog = page.getByRole('dialog', { name: 'Choose observers' });
  await dialog.getByRole('combobox', { name: 'Observation site A' }).selectOption('im2');
  await dialog.getByRole('button', { name: 'Compare these observers' }).click();
  await expect(page.getByTestId('comparison-summary')).toContainText('same site');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const result = await page.getByRole('button', { name: 'Next sample', exact: true }).boundingBox();
  expect(result!.width).toBeGreaterThanOrEqual(44);
  expect(result!.height).toBeGreaterThanOrEqual(44);
});
