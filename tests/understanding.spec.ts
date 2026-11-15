import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('choose a UTC directly, keep both places synchronized and restore focus', async ({ page }) => {
  await page.goto('/explore?legacy=1');
  const trigger = page.getByRole('button', { name: /Change UTC/ });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Choose UTC time' });
  await dialog.getByLabel('UTC date and time', { exact: true }).fill('2026-11-20T06:00');
  await dialog.getByRole('button', { name: 'Show this observation' }).click();
  await expect(page.getByRole('slider')).toHaveValue('150');
  await expect(page.getByTestId('selected-utc')).toHaveAttribute(
    'data-utc',
    '2026-11-20T06:00:00Z',
  );
  await expect(trigger).toBeFocused();
});
test('unsupported UTC is explained and only an explicitly chosen nearest sample is used', async ({
  page,
}) => {
  await page.goto('/explore?legacy=1');
  await page.getByRole('button', { name: /Change UTC/ }).click();
  const dialog = page.getByRole('dialog', { name: 'Choose UTC time' });
  await dialog.getByLabel('UTC date and time', { exact: true }).fill('2026-11-20T06:01');
  await dialog.getByRole('button', { name: 'Show this observation' }).click();
  await expect(dialog).toContainText('No position has been estimated');
  await expect(page.getByRole('slider', { includeHidden: true })).toHaveValue('0');
  await dialog.getByRole('button', { name: /Use nearest sample/ }).click();
  await expect(page.getByRole('slider')).toHaveValue('150');
});
test('UTC chooser exposes supported refinement and remains accessible', async ({ page }) => {
  await page.goto('/explore?legacy=1');
  await page.getByRole('button', { name: /Change UTC/ }).click();
  const dialog = page.getByRole('dialog', { name: 'Choose UTC time' });
  await dialog
    .getByRole('combobox', { name: 'Time chooser sampling window' })
    .selectOption('refined');
  await expect(dialog).toContainText('Steps of ten minutes');
  await dialog.getByLabel('UTC date and time', { exact: true }).fill('2026-11-16T03:40');
  const axe = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(axe.violations).toEqual([]);
  await dialog.getByRole('button', { name: 'Show this observation' }).click();
  await expect(page.getByRole('slider')).toHaveValue('4');
});
test('phone tabs show both horizon patterns and contextual help explains the model', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/explore?legacy=1');
  const a = page.getByRole('button', { name: /A \/ Odysseus/ }),
    b = page.getByRole('button', { name: /B \/ Athena/ });
  await expect(a).toContainText('Sun below');
  await expect(b).toContainText('Sun above');
  await page.getByText('How to read these skies', { exact: true }).click();
  await expect(page.getByRole('img', { name: /Concept: a positive elevation/ })).toBeVisible();
  await expect(
    page.getByText('The flat disc is a reference plane, not the lunar ground.', { exact: false }),
  ).toBeVisible();
  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(axe.violations).toEqual([]);
});
test('finder explains same-place empty results and the comparison can be restored without changing UTC', async ({
  page,
}) => {
  await page.goto('/explore?legacy=1');
  await page.getByRole('slider').fill('150');
  await page.getByRole('button', { name: 'Choose places' }).click();
  await page.getByRole('combobox', { name: 'Observation site B' }).selectOption('im1');
  await page.getByRole('button', { name: 'Compare these observers' }).click();
  await page.getByRole('button', { name: 'Find a moment', exact: true }).click();
  const finder = page.getByRole('region', { name: 'Find a moment' });
  await expect(finder).toContainText('Both views use the same place');
  await finder.getByRole('button', { name: 'Choose two different places' }).click();
  await page.getByRole('button', { name: 'Restore Odysseus + Athena' }).click();
  await page.getByRole('button', { name: 'Compare these observers' }).click();
  await expect(page.getByRole('slider')).toHaveValue('150');
  await expect(finder).not.toContainText('Both views use the same place');
  await finder.getByRole('button', { name: 'View selected skies' }).click();
  await expect(page.locator('#sky-workspace')).toBeFocused();
});

test('both investigations are reachable on phones and switching starts the supported case', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/explore?legacy=1');
  await page.getByRole('button', { name: 'Guided discovery', exact: true }).click();
  const guide = page.getByRole('region', { name: 'Guided Discovery' });
  await guide
    .getByRole('combobox', { name: 'Investigation', exact: true })
    .selectOption('sunrise-im1');
  await expect(guide).toContainText('The question');
  await expect(page.getByTestId('selected-utc')).toHaveAttribute(
    'data-utc',
    '2026-11-16T03:30:00Z',
  );
  await guide.getByRole('button', { name: 'Next', exact: true }).click();
  await guide
    .getByRole('combobox', { name: 'Investigation', exact: true })
    .selectOption('two-skies-one-instant');
  await expect(guide).toContainText('The question');
  await expect(page.getByTestId('selected-utc')).toHaveAttribute(
    'data-utc',
    '2026-11-14T00:00:00Z',
  );
  await guide.getByRole('button', { name: 'Exit discovery' }).click();
  await expect(page.getByRole('button', { name: 'Guided discovery', exact: true })).toBeVisible();
});
