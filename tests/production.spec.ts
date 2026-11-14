import { test, expect } from '@playwright/test';
test('static route content appears without JavaScript and production hydration has no errors', async ({
  browser,
  page,
}) => {
  test.skip(!process.env.RIMWAKE_BASE_URL, 'Production pre-render checks use the built preview');
  const context = await browser.newContext({ javaScriptEnabled: false }),
    staticPage = await context.newPage();
  for (const [path, text] of [
    ['/', 'WHERE'],
    ['/explore', 'COMPARE THE SKIES'],
    ['/field-guide', 'A LITTLE CONTEXT'],
    ['/sources', 'AN EVIDENCE TRAIL'],
  ]) {
    await staticPage.goto(process.env.RIMWAKE_BASE_URL + path);
    await expect(staticPage.getByRole('heading', { level: 1 })).toContainText(text);
  }
  await context.close();
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error' && m.text().includes('hydration')) errors.push(m.text());
  });
  for (const path of ['/', '/explore', '/field-guide', '/sources', '/method', '/unknown']) {
    await page.goto(path);
    await page.waitForLoadState('networkidle');
    if (path === '/explore') await expect(page.getByRole('slider')).toBeVisible();
  }
  expect(errors).toEqual([]);
});
test('local sky renders on changes and stops drawing when idle', async ({ page }) => {
  await page.addInitScript(() => {
    (window as any).__draws = 0;
    for (const name of [
      'drawArrays',
      'drawElements',
      'drawArraysInstanced',
      'drawElementsInstanced',
    ]) {
      const proto = WebGL2RenderingContext.prototype as any,
        original = proto[name];
      proto[name] = function (...args: any[]) {
        (window as any).__draws++;
        return original.apply(this, args);
      };
    }
  });
  await page.goto('/explore');
  await expect(page.locator('canvas')).toHaveCount(2);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(400);
  const before = await page.evaluate(() => (window as any).__draws);
  await page.waitForTimeout(600);
  expect(await page.evaluate(() => (window as any).__draws)).toBe(before);
  await page.getByRole('button', { name: 'Next sample', exact: true }).click();
  await expect.poll(() => page.evaluate(() => (window as any).__draws)).toBeGreaterThan(before);
});
