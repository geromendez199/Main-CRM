import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  use: {
    baseURL: process.env.WEB_BASE_URL ?? 'http://localhost:3000',
    headless: true
  },
  webServer: process.env.PLAYWRIGHT_WEB_SERVER
    ? {
        command: process.env.PLAYWRIGHT_WEB_SERVER,
        url: process.env.WEB_BASE_URL ?? 'http://localhost:3000',
        reuseExistingServer: !process.env.CI
      }
    : undefined
});
