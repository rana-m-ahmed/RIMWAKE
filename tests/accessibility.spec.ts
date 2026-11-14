import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
for (const path of ['/', '/explore', '/field-guide', '/sources'])
  test(`WCAG route ${path}`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState('networkidle');
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(
      result.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
      })),
    ).toEqual([]);
  });
test('evidence dialog has accessible contrast, trapped focus and restores its trigger', async ({
  page,
}) => {
  await page.goto('/explore');
  const trigger = page.getByRole('button', { name: 'Evidence & method' });
  await trigger.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Horizons API documentation' })).toHaveAttribute(
    'href',
    'https://ssd-api.jpl.nasa.gov/doc/horizons.html',
  );
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(result.violations).toEqual([]);
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press('Tab');
    expect(
      await page.evaluate(() => document.querySelector('dialog')!.contains(document.activeElement)),
    ).toBe(true);
  }
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
});
test('mobile menu and observer sheet remain accessible at 320px; primary controls are touch sized', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open navigation menu' }).click();
  await page
    .getByRole('navigation', { name: 'Mobile primary' })
    .getByRole('link', { name: 'Explorer', exact: true })
    .click();
  await page.getByRole('button', { name: 'Choose places' }).click();
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(result.violations).toEqual([]);
  await page.getByRole('combobox', { name: 'Observation site A' }).selectOption('im2');
  await page.getByRole('button', { name: 'Compare these observers' }).click();
  await expect(page.getByTestId('comparison-summary')).toContainText('Same site.');
  const box = await page.getByRole('button', { name: 'Next sample', exact: true }).boundingBox();
  expect(box!.width).toBeGreaterThanOrEqual(44);
  expect(box!.height).toBeGreaterThanOrEqual(44);
});
test('sites without refined events show an explicit neutral state', async ({ page }) => {
  await page.goto('/explore');
  await page.getByRole('button', { name: '10-min detail', exact: true }).click();
  await page.getByRole('button', { name: 'Choose places' }).click();
  await page.getByRole('combobox', { name: 'Observation site A' }).selectOption('im2');
  await page.getByRole('button', { name: 'Compare these observers' }).click();
  await expect(page.getByRole('button', { name: 'No crossings', exact: true })).toBeDisabled();
  await expect(
    page.getByText('No crossing brackets were detected in this window', { exact: false }),
  ).toBeVisible();
});

test('calibrated view and expanded Horizon Loom retain accessible contrast and names', async ({
  page,
}) => {
  await page.goto('/explore');
  await page.getByRole('button', { name: 'Calibrated 2D view' }).click();
  await expect(page.getByRole('button', { name: 'Hide Horizon Loom' })).toBeVisible();
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(
    result.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
    })),
  ).toEqual([]);
});
