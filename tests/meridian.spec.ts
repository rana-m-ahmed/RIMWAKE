import { test, expect } from '@playwright/test';
test('six native-scroll chapters carry the real delayed window into the atlas', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('THE PLACE.');
  await expect(page.locator('section[id^="story-"]')).toHaveCount(6);
  await page.locator('#story-4').scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: 'Apply the 72-hour delay' }).click();
  await expect(page.locator('#story-4')).toContainText('100.0%');
  await page.getByRole('link', { name: 'Explore this comparison' }).click();
  await expect(page.getByTestId('atlas-utc')).toHaveAttribute('data-utc', '2026-11-17T00:00:00Z');
});
test('routes, history, comparison retention and compatibility aliases work', async ({ page }) => {
  await page.goto('/explore');
  await page.getByRole('slider', { name: 'Inspection hour', exact: true }).fill('25');
  await expect(page).toHaveURL(/e=25/);
  const value = await page.getByTestId('reading-10').innerText();
  const nav = page.getByRole('navigation', { name: 'Primary', exact: true });
  await nav.getByRole('link', { name: 'Field Guide' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('A LITTLE CONTEXT');
  await nav.getByRole('link', { name: 'Explorer', exact: true }).click();
  await expect(page.getByRole('slider', { name: 'Inspection hour', exact: true })).toHaveValue(
    '25',
  );
  await expect(page.getByTestId('reading-10')).toHaveText(value);
  await page.goBack();
  await expect(page).toHaveURL(/field-guide$/);
  await page.goto('/method');
  await expect(page).toHaveURL(/sources$/);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('AN EVIDENCE TRAIL');
  await page.goto('/#instrument');
  await expect(page).toHaveURL(/explore/);
  await page.goto('/unknown');
  await expect(page.getByRole('heading', { name: 'A different path.' })).toBeVisible();
});
test('curated cases set the actual sample and crossing remains a bracket', async ({ page }) => {
  await page.goto('/explore?case=two-skies-one-instant');
  await expect(page.getByRole('slider')).toHaveValue('0');
  await expect(page.getByTestId('A-10-elevation')).toHaveText('\u22124.126\u00b0');
  await page.goto('/explore?case=sunrise-im1');
  await expect(page.getByRole('slider')).toHaveValue('3');
  await page.getByRole('button', { name: 'Next crossing' }).click();
  await expect(page.getByTestId('selected-utc')).toContainText('03:40');
  await expect(
    page.getByText('Exact crossing time is unresolved.', { exact: false }),
  ).toBeVisible();
  await page.goto('/explore?legacy=1&case=missing');
  await expect(page.getByText('This case is unavailable', { exact: false })).toBeVisible();
  await expect(page.getByRole('slider')).toBeVisible();
});
test('Field Guide concept interaction is explicitly separate from observations', async ({
  page,
}) => {
  await page.goto('/field-guide');
  await page.getByRole('button', { name: 'Below the plane', exact: true }).click();
  await expect(page.getByRole('img', { name: /Conceptual below/ })).toBeVisible();
  await expect(page.getByText('This diagram explains a concept.', { exact: false })).toBeVisible();
});
