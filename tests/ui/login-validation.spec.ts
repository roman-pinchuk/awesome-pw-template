import { test, expect } from '@infrastructure/fixtures/ui.fixture';
import { LoginPage } from '@pages/login.page';
import { URLS } from '@business/constants';

test.describe('SauceDemo login validation', () => {
  test(
    'rejects locked out user with an error message',
    { tag: '@smoke', annotation: { type: 'feature', description: 'Login' } },
    async ({ page, logger }) => {
      logger.info(`Starting test: ${test.info().title}`);
      const loginPage = new LoginPage(page);

      await loginPage.goto();
      await loginPage.login('locked_out_user', 'secret_sauce');

      await expect
        .configure({ message: 'Expected error message for locked out user' })(
          loginPage.errorMessage,
        )
        .toBeVisible();
      await expect
        .configure({ message: 'Expected URL to stay on login page' })(page)
        .not.toHaveURL(URLS.INVENTORY);
    },
  );

  test(
    'requires both username and password fields',
    { tag: '@smoke', annotation: { type: 'feature', description: 'Login' } },
    async ({ page, logger }) => {
      logger.info(`Starting test: ${test.info().title}`);
      const loginPage = new LoginPage(page);

      await loginPage.goto();
      await loginPage.login('', '');

      await expect
        .configure({ message: 'Expected error for empty credentials' })(loginPage.errorMessage)
        .toBeVisible();
    },
  );

  test(
    'rejects wrong password with an error',
    { annotation: { type: 'feature', description: 'Login' } },
    async ({ page, logger }) => {
      logger.info(`Starting test: ${test.info().title}`);
      const loginPage = new LoginPage(page);

      await loginPage.goto();
      await loginPage.login('standard_user', 'wrong_password');

      await expect
        .configure({ message: 'Expected error for wrong password' })(loginPage.errorMessage)
        .toBeVisible();
      await expect
        .configure({ message: 'Expected URL to stay on login page' })(page)
        .not.toHaveURL(URLS.INVENTORY);
    },
  );

  test(
    'successful login for standard user',
    { tag: '@smoke', annotation: { type: 'feature', description: 'Login' } },
    async ({ page, logger }) => {
      logger.info(`Starting test: ${test.info().title}`);
      const loginPage = new LoginPage(page);

      await loginPage.goto();
      await loginPage.login('standard_user', 'secret_sauce');

      await expect
        .configure({ message: 'Expected redirect to inventory after successful login' })(page)
        .toHaveURL(URLS.INVENTORY);
    },
  );
});
