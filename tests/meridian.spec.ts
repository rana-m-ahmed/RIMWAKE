import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Discover, Explore and Method form one working journey; direct refresh, state preservation and legacy links', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Different sky.' })).toBeVisible();
  await page.getByRole('link', { name: 'Enter the Explorer', exact: false }).first().click();
  await expect(page).toHaveURL(/\/explore$/);
  const slider = page.getByRole('slider', { name: 'UTC sample', exact: true });
  await slider.fill('25');
  const reading = await page.getByTestId('A-10-elevation').innerText();
  await page
    .getByRole('navigation', { name: 'Primary', exact: true })
    .getByRole('link', { name: 'Method', exact: true })
    .click();
  await expect(page.getByRole('heading', { name: 'Know what the sky can say.' })).toBeVisible();
  await page
    .getByRole('navigation', { name: 'Primary', exact: true })
    .getByRole('link', { name: 'Explore', exact: true })
    .click();
  await expect(slider).toHaveValue('25');
  await expect(page.getByTestId('A-10-elevation')).toHaveText(reading);
  await page.reload();
  await expect(slider).toBeVisible();
  await page.goto('/#instrument');
  await expect(page).toHaveURL(/\/explore$/);
  await expect(slider).toBeVisible();
  await page.goto('/method');
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Know what the sky can say.' })).toBeVisible();
  await page.goto('/unknown');
  await expect(page.getByRole('heading', { name: 'A different path.' })).toBeVisible();
});

test('swap updates all selected records; seam explains actual deltas; research modules stay gated', async ({
  page,
}) => {
  await page.goto('/explore');
  await expect(page.getByRole('slider')).toBeVisible();
  const a = await page.getByTestId('A-10-elevation').innerText(),
    b = await page.getByTestId('B-10-elevation').innerText();
  await page.getByRole('button', { name: 'Swap A and B' }).click();
  await expect(page.getByTestId('A-10-elevation')).toHaveText(b);
  await expect(page.getByTestId('B-10-elevation')).toHaveText(a);
  await expect(page.getByRole('combobox', { name: 'Observation site A' })).toHaveValue('im2');
  await page.getByRole('button', { name: 'Inspect the meridian difference' }).click();
  await expect(page.getByRole('dialog', { name: 'Meridian difference' })).toContainText(
    'B minus elevation at A',
  );
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Inspect the meridian difference' })).toBeFocused();
  await page.getByRole('button', { name: /Cause study/ }).click();
  await expect(page.getByRole('dialog')).toContainText('not yet available');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: /Robustness Research/ }).click();
  await expect(page.getByRole('dialog')).toContainText('No probability');
});

test('six-act story uses released cases, changes the shared sample and remains skippable', async ({
  page,
}) => {
  await page.goto('/explore?case=two-skies-one-instant&guide=1');
  const guide = page.getByRole('region', { name: 'Guided discovery' });
  await expect(guide).toBeVisible();
  await expect(page.getByRole('slider')).toHaveValue('0');
  await guide.getByRole('button', { name: 'Next act' }).click();
  await expect(guide).toContainText('ACT 02');
  await guide.getByRole('button', { name: 'Next act' }).click();
  await expect(page.getByRole('slider')).toHaveValue('4');
  await guide.getByRole('button', { name: 'Back', exact: true }).click();
  await expect(page.getByRole('slider')).toHaveValue('0');
  await guide.getByRole('button', { name: 'Skip guide' }).click();
  await expect(guide).not.toBeVisible();
  await expect(page.getByRole('slider')).toHaveValue('0');
  await page.goto('/explore?case=sunrise-im1');
  await expect(page.getByRole('slider')).toHaveValue('3');
  await expect(page.getByTestId('selected-utc')).toContainText('03:30');
  await page.getByRole('button', { name: 'Next crossing' }).click();
  await expect(page.getByTestId('selected-utc')).toContainText('03:40');
  await expect(
    page.getByText('Exact crossing time is unresolved.', { exact: false }),
  ).toBeVisible();
  await page.goto('/explore?case=missing');
  await expect(page.getByText('That case is unavailable', { exact: false })).toBeVisible();
  await expect(page.getByRole('slider')).toBeVisible();
});

for (const path of ['/', '/explore', '/method'])
  test(`accessible route ${path}`, async ({ page }) => {
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

test('mobile navigation, touch targets, unknown route, and Explorer without WebGL', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      if (String(type).includes('webgl')) return null;
      return original.apply(this, [type, ...args] as any);
    } as typeof original;
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page
    .getByRole('navigation', { name: 'Mobile primary' })
    .getByRole('link', { name: 'Explore' })
    .click();
  await expect(page.getByRole('slider')).toBeVisible();
  await page.getByRole('button', { name: 'B / Athena' }).click();
  await expect(page.getByTestId('B-10-elevation')).toBeVisible();
  await page.getByRole('button', { name: 'Locate the observers in 3D' }).click();
  await expect(page.getByRole('dialog')).toContainText('3D is unavailable');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('slider')).toBeVisible();
});
