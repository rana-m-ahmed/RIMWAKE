import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('accessible explorer and modal; focus containment and return', async ({ page }) => {
  await page.goto('/explore');
  await expect(page.getByRole('slider')).toBeVisible();
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(result.violations).toEqual([]);
  await page.getByRole('button', { name: 'Evidence & method' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  const drawer = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(drawer.violations).toEqual([]);
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press('Tab');
    const focus = await page.evaluate(() => ({
      inside: document.querySelector('dialog')!.contains(document.activeElement),
      active: document.activeElement?.outerHTML.slice(0, 150),
    }));
    expect(focus.inside, JSON.stringify(focus)).toBe(true);
  }
  await page.screenshot({ path: 'docs/screenshots/rimwake-evidence.png', fullPage: false });
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Evidence & method' })).toBeFocused();
});

test('selected sites with no crossing have an explicit neutral state', async ({ page }) => {
  await page.goto('/explore');
  await expect(page.getByRole('slider')).toBeVisible();
  await page.getByRole('button', { name: '10-min detail', exact: true }).click();
  await page.getByRole('combobox', { name: 'Observation site A' }).selectOption('im2');
  await expect(page.getByRole('button', { name: 'No crossings', exact: true })).toBeDisabled();
  await expect(
    page.getByText('No crossing brackets were detected in this window', { exact: false }),
  ).toBeVisible();
  await expect(page.getByRole('status')).toContainText('same site');
});
