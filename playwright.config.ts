import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for Compose Anywhere testing
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Test directory
  testDir: './tests',

  // Test match pattern
  testMatch: ['**/*.spec.ts'],

  // Timeout for each test
  timeout: 30 * 1000,

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use
  reporter: [
    ['html', { outputFolder: 'test-results/html-report', open: 'never' }],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }]
  ],

  // Artifacts folder where screenshots, videos, and traces are stored
  outputDir: 'test-results/artifacts',

  // Shared settings for all the projects below
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: 'http://localhost:8080',

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Screenshot settings
    screenshot: {
      mode: 'only-on-failure',
      fullPage: true
    },

    // Video recording
    video: process.env.CI ? 'retain-on-failure' : 'off',

    // Browser viewport
    viewport: { width: 1280, height: 720 },

    // Emulate device capabilities
    deviceScaleFactor: 1,
    hasTouch: false,
    isMobile: false,

    // Locale and timezone
    locale: 'en-US',
    timezoneId: 'America/New_York',

    // Permissions
    permissions: [],

    // Offline mode
    offline: false,

    // HTTP credentials
    httpCredentials: undefined,

    // Ignore HTTPS errors
    ignoreHTTPSErrors: true,
  },

  // Configure projects for major browsers
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

    // Test on mobile viewports
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },

    // Test on different viewport sizes
    {
      name: 'chromium-wide',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },
  ],

  // Run your local dev server before starting the tests
  webServer: {
    command: 'pnpm run serve',
    port: 8080,
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});