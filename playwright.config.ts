import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration.
 *
 * - Fully parallel workers, sharded cleanly on CI
 * - Three desktop browser projects (chromium / firefox / webkit)
 * - 2 retries on CI, trace captured on first retry, screenshot on failure
 * - Base URL points at the SauceDemo demo app
 */
export default defineConfig({
  testDir: './tests',
  timeout: 30_000, // per-test timeout
  expect: { timeout: 10_000 }, // per-assertion timeout

  // Run tests in parallel; on CI use 50% of available CPUs for stability
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? '50%' : undefined,

  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],

  use: {
    baseURL: 'https://www.saucedemo.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
