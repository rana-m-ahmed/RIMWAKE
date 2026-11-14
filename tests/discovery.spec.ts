import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('polar site picker changes shared observations and remains keyboard accessible', async ({
  page,
}) => {
  await page.goto('/explore');
  await expect(page.getByRole('slider')).toBeVisible();
  await page.getByRole('button', { name: 'Choose places' }).click();
  await page.getByRole('button', { name: 'Place B', exact: true }).click();
  await page.getByRole('button', { name: /Odysseus.*Place B/ }).click();
  await page.getByRole('button', { name: 'Compare these observers' }).click();
  await expect(page.getByTestId('comparison-summary')).toContainText('Same site.');
  await expect(page).toHaveURL(/b=im1/);
});
test('complete guided investigation drives the same UTC and evidence and can resume after free exploration', async ({
  page,
}) => {
  await page.goto('/explore?case=sunrise-im1&guide=1');
  const guide = page.getByRole('region', { name: 'Guided Discovery' });
  await expect(guide).toContainText('The question');
  for (let i = 0; i < 4; i++)
    await guide.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByTestId('selected-utc')).toContainText('03:40');
  await guide.getByRole('button', { name: 'Back', exact: true }).click();
  await expect(page.getByTestId('selected-utc')).toContainText('03:30');
  await page.getByRole('slider').fill('0');
  await expect(guide).toContainText('Your view has changed');
  await guide.getByRole('button', { name: 'Resume this step' }).click();
  await expect(page.getByRole('slider')).toHaveValue('3');
  await guide.getByRole('button', { name: 'Next', exact: true }).click();
  await guide.getByRole('button', { name: 'Next', exact: true }).click();
  await guide.getByRole('button', { name: 'Inspect this evidence' }).click();
  await expect(page.getByRole('dialog')).toContainText('03:40');
  await page.keyboard.press('Escape');
  await guide.getByRole('button', { name: 'Next', exact: true }).click();
  await guide.getByRole('button', { name: 'Continue exploring' }).click();
  await expect(guide).toHaveCount(0);
  await expect(page.getByRole('slider')).toHaveValue('4');
});
test('finder returns real sampled runs, crossing brackets and honest no-match results', async ({
  page,
}) => {
  await page.goto('/explore');
  await page.getByRole('button', { name: 'Find a moment', exact: true }).click();
  const finder = page.getByRole('region', { name: 'Find a moment' });
  await expect(finder).toContainText('matching samples');
  await finder.getByRole('button', { name: 'Next matching run' }).click();
  await expect(page.getByRole('slider')).not.toHaveValue('0');
  await finder.getByRole('combobox', { name: 'Observation condition' }).selectOption('crossing');
  await expect(finder).toContainText('Exact crossing times are unresolved');
  await finder.getByRole('button').filter({ hasText: 'Odysseus' }).first().click();
  await expect(page.getByText('Crossing bracket:', { exact: false }).first()).toBeVisible();
  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(axe.violations).toEqual([]);
});
test('canonical URL survives refresh; invalid times are rejected and CSV matches the selected state', async ({
  page,
}) => {
  await page.goto('/explore');
  await page.getByRole('slider').fill('150');
  await page.getByRole('button', { name: 'Swap A and B' }).click();
  await page.getByRole('button', { name: 'Calibrated 2D view' }).click();
  await expect(page).toHaveURL(/view=calibrated/);
  const url = page.url(),
    reading = await page.getByTestId('A-10-elevation').innerText();
  await page.reload();
  await expect(page.getByTestId('A-10-elevation')).toHaveText(reading);
  await expect(page.getByRole('slider')).toHaveValue('150');
  expect(page.url()).toBe(url);
  await page.getByRole('button', { name: 'Share & export', exact: true }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download CSV', exact: true }).click();
  const download = await downloadPromise;
  const stream = await download.createReadStream();
  const parts: Buffer[] = [];
  for await (const chunk of stream!) parts.push(chunk);
  const csv = Buffer.concat(parts).toString();
  expect(csv).toContain('"im2"');
  expect(csv).toContain('"A"');
  expect(csv).toContain('"2026-11-20T06:00:00Z"');
  expect(csv).toContain('terrain, power and RF excluded');
  await page.keyboard.press('Escape');
  const broken = new URL(url);
  broken.searchParams.set('t', '2026-11-14T00:01:00Z');
  await page.goto(broken.href);
  await expect(
    page.getByText('This UTC is not a supported sample.', { exact: false }),
  ).toBeVisible();
  await expect(page.getByRole('slider')).toHaveValue('0');
});
test('discovery, export and map dialogs remain accessible at phone width', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/explore');
  await page.getByRole('button', { name: 'Share & export', exact: true }).click();
  let result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(result.violations).toEqual([]);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Choose places' }).click();
  result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(result.violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('changing observers clears stale crossing context', async ({ page }) => {
  await page.goto('/explore?case=sunrise-im1');
  await page.getByRole('button', { name: 'Next crossing', exact: false }).click();
  await expect(
    page.getByText('Exact crossing time is unresolved.', { exact: false }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Choose places' }).click();
  await page.getByRole('combobox', { name: 'Observation site A' }).selectOption('im2');
  await page.getByRole('button', { name: 'Compare these observers' }).click();
  await expect(page.getByRole('button', { name: 'No crossings', exact: true })).toBeDisabled();
  await expect(page.getByText('Exact crossing time is unresolved.', { exact: false })).toHaveCount(
    0,
  );
});

test('continuous scrubbing coalesces URL writes and shares the latest exact sample', async ({
  page,
}) => {
  await page.goto('/explore');
  await expect(page).toHaveURL(/r=rimwake/);
  await page.evaluate(() => {
    (window as any).__urlWrites = 0;
    const original = history.replaceState.bind(history);
    history.replaceState = (...args) => {
      (window as any).__urlWrites++;
      return original(...args);
    };
  });
  await page.evaluate(async () => {
    const input = document.querySelector('input[type=range]') as HTMLInputElement;
    for (let i = 0; i < 80; i++) {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(
        input,
        String(i),
      );
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise((r) => setTimeout(r, 10));
    }
  });
  await expect(page.getByRole('slider')).toHaveValue('79');
  await expect.poll(() => new URL(page.url()).searchParams.get('t')).toBe('2026-11-17T07:00:00Z');
  expect(await page.evaluate(() => (window as any).__urlWrites)).toBeLessThan(6);
});
test('denied clipboard access exposes exact link and summary text for manual copying', async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async () => {
          throw Error('Injected clipboard denial');
        },
      },
    }),
  );
  await page.goto('/explore');
  await page.getByRole('button', { name: 'Share & export', exact: true }).click();
  await page.getByRole('button', { name: 'Copy observation link', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Copy manually' })).toHaveValue(
    /r=rimwake-p0-20261114-v1/,
  );
  await page.getByRole('button', { name: 'Copy scientific summary' }).click();
  await expect(page.getByRole('textbox', { name: 'Copy manually' })).toContainText(
    'Hypothetical observers',
  );
});
