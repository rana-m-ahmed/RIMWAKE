import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const ready = async (page: any) => {
  await expect(page.getByTestId('atlas-utc')).toHaveAttribute('data-utc', /.+Z/);
};
test('complete delayed-mission comparison, exact shared clock, link refresh and source export', async ({
  page,
}) => {
  await page.goto('/explore');
  await ready(page);
  await expect(page.getByRole('region', { name: 'Comparison outcome' })).toContainText(
    '28.4 percentage points',
  );
  await expect(
    page.getByRole('region', { name: 'Original and delayed window comparison' }),
  ).toContainText('117/169 original');
  await page.getByRole('button', { name: 'Apply 72-hour delay' }).click();
  await expect(page.getByTestId('atlas-utc')).toHaveAttribute('data-utc', '2026-11-17T00:00:00Z');
  await expect(page.getByRole('region', { name: 'Comparison outcome' })).toContainText(
    'same share',
  );
  await page.getByRole('slider', { name: 'Inspection hour', exact: true }).fill('52');
  await expect(page.getByTestId('atlas-utc')).toHaveAttribute('data-utc', '2026-11-19T04:00:00Z');
  await expect(page).toHaveURL(/scenario=delayed/);
  await expect(page).toHaveURL(/e=52/);
  await page.reload();
  await expect(page.getByTestId('atlas-utc')).toHaveAttribute('data-utc', '2026-11-19T04:00:00Z');
  await page.getByRole('button', { name: 'Share & export' }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download source samples CSV' }).click();
  const download = await downloadPromise,
    stream = await download.createReadStream(),
    chunks: Buffer[] = [];
  for await (const chunk of stream!) chunks.push(chunk);
  const csv = Buffer.concat(chunks).toString();
  expect(csv.split('\r\n')).toHaveLength(1354);
  expect(csv).toContain('"2026-11-24T00:00:00Z"');
  expect(csv).toContain('"delayed"');
  expect(csv).toContain('raw_sha256');
});
test('all six sites work including far-side Earth-below and source identities', async ({
  page,
}) => {
  await page.goto('/explore');
  await ready(page);
  await page.getByRole('combobox', { name: 'Viewpoint A', exact: true }).selectOption('ce4');
  await ready(page);
  await expect(page.getByTestId('reading-399')).toContainText('\u2212');
  await expect(
    page.getByRole('region', { name: 'Original and delayed window comparison' }),
  ).toContainText('Von Karman');
  await page.getByRole('combobox', { name: 'Viewpoint B', exact: true }).selectOption('ap11');
  await expect(
    page.getByRole('region', { name: 'Original and delayed window comparison' }),
  ).toContainText('Tranquility Base');
  await page.getByRole('button', { name: 'Evidence & limits' }).click();
  await expect(page.getByRole('dialog')).toContainText('atlas-ce4-399');
  await expect(page.getByRole('dialog')).toContainText('atlas-ap11-10');
});
test('unsupported windows are explained without changing the last verified comparison', async ({
  page,
}) => {
  await page.goto('/explore');
  await ready(page);
  await page.getByLabel('Mission start UTC', { exact: true }).fill('2027-02-10T00:00');
  await page.getByRole('button', { name: 'Update window' }).click();
  await expect(page.getByRole('alert')).toContainText('beyond');
  await expect(page.getByTestId('atlas-utc')).toHaveAttribute('data-utc', '2026-11-14T00:00:00Z');
});
test('exact UTC chooser rejects unavailable times and restores keyboard focus', async ({
  page,
}) => {
  await page.goto('/explore');
  await ready(page);
  const trigger = page.getByRole('button', { name: /UTC \/ change time/ });
  await trigger.click();
  await page.getByLabel('Inspection UTC', { exact: true }).fill('2026-11-15T00:01');
  await page.getByRole('button', { name: 'Inspect this sample' }).click();
  await expect(page.getByRole('dialog')).toContainText('No position has been estimated');
  await page.getByRole('button', { name: /Use nearest supported sample/ }).click();
  await expect(page.getByTestId('atlas-utc')).toHaveAttribute('data-utc', '2026-11-15T00:00:00Z');
  await expect(trigger).toBeFocused();
});
test('release corruption fails closed; retry restores the authentic comparison', async ({
  page,
}) => {
  await page.route('**/data/atlas/im1.json', async (route) => {
    const response = await route.fetch();
    const value = await response.json();
    value.records[0].elevation_deg = 80;
    await route.fulfill({ json: value });
  });
  await page.goto('/explore');
  await expect(page.getByRole('alert')).toContainText('integrity');
  await expect(page.getByTestId('atlas-utc')).toHaveCount(0);
  await page.unroute('**/data/atlas/im1.json');
  await page.getByRole('button', { name: 'Retry verification' }).click();
  await ready(page);
  await expect(page.getByTestId('reading-10')).toContainText('4.126');
});
test('rapid site changes discard stale worker results and scrub without network', async ({
  page,
}) => {
  await page.goto('/explore');
  await ready(page);
  await page.getByRole('combobox', { name: 'Viewpoint A', exact: true }).selectOption('ap11');
  await page.getByRole('combobox', { name: 'Viewpoint A', exact: true }).selectOption('ce4');
  await page.getByRole('combobox', { name: 'Viewpoint A', exact: true }).selectOption('im1');
  await ready(page);
  await expect(page.getByTestId('reading-10')).toContainText('4.126');
  const requests: string[] = [];
  page.on('request', (r) => {
    if (r.url().includes('/data/')) requests.push(r.url());
  });
  await page.getByRole('slider', { name: 'Inspection hour', exact: true }).fill('150');
  await expect(page.getByTestId('atlas-utc')).toHaveAttribute('data-utc', '2026-11-20T06:00:00Z');
  expect(requests).toEqual([]);
});
for (const width of [1440, 1024, 768, 390, 360, 320])
  test(`atlas responsive workflow ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/explore');
    await ready(page);
    await expect(page.getByRole('button', { name: 'Apply 72-hour delay' })).toBeVisible();
    await page.getByRole('button', { name: 'Apply 72-hour delay' }).click();
    await expect(page.getByTestId('atlas-utc')).toHaveAttribute('data-utc', '2026-11-17T00:00:00Z');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    if (width === 390 || width === 1440) {
      const axe = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      expect(
        axe.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
      ).toEqual([]);
      await page.getByRole('button', { name: 'Evidence & limits' }).click();
      const dialogAxe = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      expect(dialogAxe.violations).toEqual([]);
    }
  });
test('reduced motion retains the full atlas analysis without downloading 3D', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const downloads: string[] = [];
  page.on('request', (r) => {
    if (/\.glb|lroc-color|AtlasScene-/.test(r.url())) downloads.push(r.url());
  });
  await page.goto('/explore');
  await ready(page);
  await expect(page.locator('canvas')).toHaveCount(0);
  await page.getByRole('button', { name: 'Apply 72-hour delay' }).click();
  await expect(page.getByTestId('atlas-utc')).toHaveAttribute('data-utc', '2026-11-17T00:00:00Z');
  expect(downloads).toEqual([]);
});
test('invalid release links show no substitute scientific result', async ({ page }) => {
  await page.goto('/explore?v=2&r=missing');
  await expect(page.getByRole('alert')).toContainText('unsupported release');
  await expect(page.getByTestId('atlas-utc')).toHaveCount(0);
  await page.getByRole('button', { name: 'Reset to archived example' }).click();
  await ready(page);
});

test('phone window editing, custom zero delay and same-site analysis preserve supported boundaries', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/explore');
  await ready(page);
  await page.getByRole('button', { name: /Edit window/ }).click();
  await page.getByLabel('Mission start UTC', { exact: true }).fill('2027-01-10T03:00');
  await page
    .getByRole('combobox', { name: 'Mission duration', exact: true })
    .selectOption('custom');
  await page.getByLabel('Custom duration hours', { exact: true }).fill('120');
  await page.getByRole('combobox', { name: 'Mission delay', exact: true }).selectOption('custom');
  await page.getByLabel('Custom delay hours', { exact: true }).fill('0');
  await page.getByRole('button', { name: 'Update window' }).click();
  await expect(page.getByTestId('atlas-utc')).toHaveAttribute('data-utc', '2027-01-10T03:00:00Z');
  await expect(
    page.getByRole('region', { name: 'Original and delayed window comparison' }),
  ).toContainText('No change');
  await page.getByRole('combobox', { name: 'Viewpoint B', exact: true }).selectOption('im1');
  await expect(page.getByRole('region', { name: 'Comparison outcome' })).toContainText(
    'same place',
  );
});
test('site photography remains historical context and timeline filtering keeps an exact source clock', async ({
  page,
}) => {
  await page.goto('/explore');
  await ready(page);
  await page.getByRole('button', { name: 'LROC site image', exact: true }).click();
  await expect(page.getByRole('img', { name: /Historical LROC context/ })).toBeVisible();
  await expect(
    page.getByText("Historical image. Not the selected date's lighting or a terrain calculation.", {
      exact: true,
    }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Close LROC image', exact: true }).click();
  await page.getByRole('slider', { name: 'Inspection hour', exact: true }).fill('52');
  await expect(page.getByTestId('atlas-utc')).toHaveAttribute('data-utc', '2026-11-16T04:00:00Z');
  await page
    .getByRole('combobox', { name: 'Timeline condition', exact: true })
    .selectOption('earth');
  await page.getByRole('button', { name: 'Zoom around cursor' }).click();
  await expect(page.getByTestId('atlas-utc')).toHaveAttribute('data-utc', '2026-11-16T04:00:00Z');
});
