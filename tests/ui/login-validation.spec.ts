import { test, expect } from '@infrastructure/fixtures/ui.fixture';
import { USERS, PASSWORD, URLS } from '@business/constants';

test.describe('SauceDemo login validation', () => {
  test(
    'rejects locked out user with an error message',
    { tag: '@smoke', annotation: { type: 'feature', description: 'Login' } },
    async ({ loginPage, page, logger }) => {
      logger.info(`Starting test: ${test.info().title}`);

      await loginPage.goto();
      await loginPage.login(USERS.LOCKED_OUT, PASSWORD);

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
    async ({ loginPage, logger }) => {
      logger.info(`Starting test: ${test.info().title}`);

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
    async ({ loginPage, page, logger }) => {
      logger.info(`Starting test: ${test.info().title}`);

      await loginPage.goto();
      await loginPage.login(USERS.STANDARD, 'wrong_password');

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
    async ({ loginPage, page, logger }) => {
      logger.info(`Starting test: ${test.info().title}`);

      await loginPage.goto();
      await loginPage.login(USERS.STANDARD, PASSWORD);

      await expect
        .configure({ message: 'Expected redirect to inventory after successful login' })(page)
        .toHaveURL(URLS.INVENTORY);
    },
  );
});
