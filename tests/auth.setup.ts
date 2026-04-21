import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/shop/login.page';
import { loadEnv } from '../src/config/env';
import fs from 'fs';

const env = loadEnv();
const authFile = '.playwright/auth/user.json';
const TTL_MS = 60 * 60 * 1000; // 1 hour

setup('authenticate', async ({ page }) => {
  if (fs.existsSync(authFile)) {
    const { mtime } = fs.statSync(authFile);
    if (Date.now() - mtime.getTime() < TTL_MS) {
      console.log('Using existing authentication state (TTL valid)');
      return;
    }
  }

  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(env.USER_EMAIL, env.USER_PASSWORD);

  // Wait for login to be successful (e.g., redirect to account page or profile name visible)
  await expect(page).toHaveURL(/.*\/account/);

  await page.context().storageState({ path: authFile });
});
