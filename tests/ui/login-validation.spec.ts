import { test } from '@infrastructure/fixtures/ui.fixture';

test.describe('SauceDemo login validation', () => {
  test(
    'rejects locked out user with an error message',
    { tag: ['@smoke', '@CASE-017'], annotation: { type: 'feature', description: 'Login' } },
    async ({ loginJourney, users }) => {
      await loginJourney.loginAs(users.lockedOut);
      await loginJourney.expectLoginError();
      await loginJourney.expectRedirectDenied();
    },
  );

  test(
    'requires both username and password fields',
    { tag: ['@smoke', '@CASE-018'], annotation: { type: 'feature', description: 'Login' } },
    async ({ loginJourney }) => {
      await loginJourney.loginAs({ username: '', password: '' });
      await loginJourney.expectLoginError();
    },
  );

  test(
    'rejects wrong password with an error',
    { tag: '@CASE-019', annotation: { type: 'feature', description: 'Login' } },
    async ({ loginJourney, users }) => {
      await loginJourney.loginAs({ username: users.standard.username, password: 'wrong_password' });
      await loginJourney.expectLoginError();
      await loginJourney.expectRedirectDenied();
    },
  );

  test(
    'successful login for standard user',
    { tag: ['@smoke', '@CASE-020'], annotation: { type: 'feature', description: 'Login' } },
    async ({ loginJourney, users }) => {
      await loginJourney.loginAs(users.standard);
      await loginJourney.expectRedirectToInventory();
    },
  );
});
