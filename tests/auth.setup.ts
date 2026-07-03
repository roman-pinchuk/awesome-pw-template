/* eslint-disable playwright/no-conditional-in-test */
import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '@pages/login.page';
import { URLS } from '@business/constants';
import { loadEnv } from '@infrastructure/config/env';
import { logger } from '@infrastructure/utils/logger';
import fs from 'fs';

const AUTH_FILE = '.playwright/auth/user.json';
const TTL_MS = 8 * 60 * 1000;
const env = loadEnv();

setup('authenticate to SauceDemo', async ({ page }) => {
  if (fs.existsSync(AUTH_FILE) && Date.now() - fs.statSync(AUTH_FILE).mtime.getTime() < TTL_MS) {
    logger.info('Using existing SauceDemo auth state (TTL valid)');
    return;
  }

  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login({ username: env.SAUCE_USERNAME, password: env.SAUCE_PASSWORD });
  await expect
    .configure({ message: 'Expected redirect to inventory after login' })(page)
    .toHaveURL(URLS.INVENTORY);
  await page.context().storageState({ path: AUTH_FILE });
});
