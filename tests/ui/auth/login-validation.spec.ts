import { test, expect } from '@/infrastructure/fixtures/ui.fixture';
import { LoginPage } from '@/pages/shop/login.page';

test.describe('Login validation', () => {
  test('rejects invalid credentials with an error message', async ({ page, logger }) => {
    logger.info(`Starting test: ${test.info().title}`);
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('invalid@test.com', 'wrong-password');

    await expect.configure({ message: 'Expected error message for invalid credentials' })(page.getByText('Invalid email or password')).toBeVisible();
    await expect.configure({ message: 'Expected URL to NOT navigate to /account with invalid credentials' })(page).not.toHaveURL(/\/account/);
  });

  test('requires both email and password fields', async ({ page, logger }) => {
    logger.info(`Starting test: ${test.info().title}`);
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('', '');

    await expect.configure({ message: 'Expected email validation when login fields are empty' })(page.getByText('Email is required')).toBeVisible();
    await expect.configure({ message: 'Expected password validation when login fields are empty' })(page.getByText('Password is required')).toBeVisible();
  });
});
