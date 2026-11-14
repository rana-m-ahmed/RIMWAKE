import { test, expect } from '@playwright/test';
test('six native-scroll chapters carry an exact refined sample into Explorer', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('WHERE');
  await page.getByRole('button', { name: 'Chapter 05: Move time' }).click();
  await page.getByRole('button', { name: '03:40 UTC', exact: true }).click();
  await expect(page.getByRole('button', { name: '03:40 UTC', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.getByRole('link', { name: 'Enter the Explorer', exact: false }).click();
  await expect(page).toHaveURL(/\/explore$/);
  await expect(page.getByRole('slider')).toHaveValue('4');
  await expect(page.getByTestId('selected-utc')).toContainText('03:40');
});
test('all destinations, browser history, selection retention, refresh and legacy routes work', async ({
  page,
}) => {
  await page.goto('/explore');
  await page.getByRole('slider').fill('25');
  const value = await page.getByTestId('A-10-elevation').innerText();
  const nav = page.getByRole('navigation', { name: 'Primary', exact: true });
  await nav.getByRole('link', { name: 'Field Guide' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('A LITTLE CONTEXT');
  await nav.getByRole('link', { name: 'Explorer', exact: true }).click();
  await expect(page.getByRole('slider')).toHaveValue('25');
  await expect(page.getByTestId('A-10-elevation')).toHaveText(value);
  await page.goBack();
  await expect(page).toHaveURL(/field-guide$/);
  await page.goto('/method');
  await expect(page).toHaveURL(/sources$/);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('AN EVIDENCE TRAIL');
  await page.goto('/#instrument');
  await expect(page).toHaveURL(/explore$/);
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
  await page.goto('/explore?case=missing');
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
