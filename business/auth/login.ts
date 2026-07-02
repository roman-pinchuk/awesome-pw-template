import { expect, type Page } from '@playwright/test';
import { LoginPage } from '@/pages/shop/login.page';

export async function loginAsCustomer(page: Page, email: string, password: string): Promise<void> {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(email, password);
  await expect.configure({ message: 'Expected redirect to /account after successful login' })(page).toHaveURL(/.*\/account/);
  await page.context().storageState({ path: AUTH_FILE });
}

export const AUTH_FILE = '.playwright/auth/user.json';
