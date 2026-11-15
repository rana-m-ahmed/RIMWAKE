import { test, expect } from '@playwright/test';

for (const width of [1440, 390]) {
  test(`Globe-Sky-Globe keeps a rendered Moon through repeated switches at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/explore');
    await expect(page.getByTestId('atlas-utc')).toHaveAttribute('data-utc', '2026-11-14T00:00:00Z');
    await expect(page.locator('canvas')).toHaveAttribute('data-flight', 'settled');
    for (let cycle = 0; cycle < 5; cycle++) {
      await page.getByRole('button', { name: 'Sky', exact: true }).click();
      await expect(page.locator('canvas')).toHaveCount(0);
      // R3F disposes the old renderer asynchronously; include that teardown.
      await page.waitForTimeout(cycle % 2 === 0 ? 650 : 0);
      await page.getByRole('button', { name: 'Globe', exact: true }).click();
      await expect(page.locator('canvas')).toHaveCount(1);
      await expect(page.locator('canvas')).toHaveAttribute('data-flight', 'settled');
      await expect(page.getByTestId('atlas-utc')).toHaveAttribute('data-utc', '2026-11-14T00:00:00Z');
    }
    await page.getByRole('combobox', { name: 'Viewpoint A', exact: true }).selectOption('ap11');
    await expect(page.getByRole('region', { name: 'Original and delayed window comparison' })).toContainText('Tranquility Base');
    await expect(page.locator('canvas')).toHaveAttribute('data-flight', 'settled');
    expect(errors).toEqual([]);
  });
}
