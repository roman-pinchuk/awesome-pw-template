import { defineConfig, devices } from '@playwright/test';
import { loadEnv } from '@/config/env';

const env = loadEnv();
const isCI = env.CI;

export default defineConfig({
  globalSetup: './src/config/global-setup.ts',
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  timeout: 45_000,
  expect: {
    timeout: 7_500,
  },
  reporter: [['list'], ['html', { open: 'never' }]],
  outputDir: 'test-results',
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
  },
  ...(isCI ? { workers: 2 } : {}),
  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
      use: {
        baseURL: env.UI_BASE_URL,
      },
    },
    {
      name: 'ui-chromium',
      testMatch: /tests\/ui\/.*\.spec\.ts/,
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        baseURL: env.UI_BASE_URL,
        storageState: '.playwright/auth/user.json',
      },
    },
    {
      name: 'ui-firefox',
      testMatch: /tests\/ui\/.*\.spec\.ts/,
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Firefox'],
        baseURL: env.UI_BASE_URL,
        storageState: '.playwright/auth/user.json',
      },
    },
    {
      name: 'api',
      testMatch: /tests\/api\/.*\.spec\.ts/,
      use: {
        baseURL: env.API_BASE_URL,
        extraHTTPHeaders: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'x-api-key': env.API_KEY,
        },
      },
    },
  ],
});
