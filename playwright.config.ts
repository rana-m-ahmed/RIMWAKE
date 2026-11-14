import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 2,
  use: {
    baseURL: process.env.RIMWAKE_BASE_URL || 'http://127.0.0.1:5173',
    browserName: 'chromium',
    channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome',
  },
  webServer: {
    command: 'npm run dev -- --port 5173',
    url: process.env.RIMWAKE_BASE_URL || 'http://127.0.0.1:5173',
    reuseExistingServer: true,
  },
  reporter: [['list'], ['html', { open: 'never' }]],
});
