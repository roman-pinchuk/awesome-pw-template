import { test as setup } from '@playwright/test';
import { loginAsCustomer, AUTH_FILE } from '@/business/auth/login';
import { loadEnv } from '@/infrastructure/config/env';
import { logger } from '@/infrastructure/utils/logger';
import fs from 'fs';

const env = loadEnv();
const TTL_MS = 60 * 60 * 1000;

setup('authenticate', async ({ page }) => {
  // eslint-disable-next-line playwright/no-conditional-in-test
  if (fs.existsSync(AUTH_FILE)) {
    const { mtime } = fs.statSync(AUTH_FILE);
    // eslint-disable-next-line playwright/no-conditional-in-test
    if (Date.now() - mtime.getTime() < TTL_MS) {
      logger.info('Using existing authentication state (TTL valid)');
      return;
    }
  }

  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  await loginAsCustomer(page, env.USER_EMAIL, env.USER_PASSWORD);
});
