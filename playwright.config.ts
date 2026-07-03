import { defineConfig, devices } from '@playwright/test';
import { loadEnv } from '@infrastructure/config/env';

const env = loadEnv();
const isCI = env.CI;

export default defineConfig({
  tsconfig: './tsconfig.json',
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  timeout: 45_000,
  expect: {
    timeout: 7_500,
  },
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['allure-playwright'],
    ...(process.env.CTRF_REPORT_FILE
      ? [['playwright-ctrf-json-reporter', { outputFile: process.env.CTRF_REPORT_FILE }] as [string, unknown]]
      : []),
  ],
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
        baseURL: env.BASE_URL,
      },
    },
    {
      name: 'chromium',
      testMatch: /tests\/ui\/.*\.spec\.ts/,
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        baseURL: env.BASE_URL,
        storageState: '.playwright/auth/user.json',
      },
    },
    {
      name: 'firefox',
      testMatch: /tests\/ui\/.*\.spec\.ts/,
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Firefox'],
        baseURL: env.BASE_URL,
        storageState: '.playwright/auth/user.json',
      },
    },
    {
      name: 'webkit',
      testMatch: /tests\/ui\/.*\.spec\.ts/,
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Safari'],
        baseURL: env.BASE_URL,
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
          Prefer: 'return=representation',
        },
      },
    },
  ],
});
