import type { Locator, Page } from '@playwright/test';

import { ROUTES } from '@business/constants';
import type { TestUser } from '@business/factories/user.factory';

/**
 * Page object for the SauceDemo login screen.
 *
 * @remarks
 * Owns login form selectors and direct form interaction. Higher-level tests
 * should prefer {@link LoginJourney} when validating authentication behavior.
 */
export class LoginPage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(private readonly page: Page) {
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  /** Opens the login route and waits for the initial DOM. */
  async goto(): Promise<void> {
    await this.page.goto(ROUTES.LOGIN);
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Submits the supplied SauceDemo credentials without asserting the outcome. */
  async login(user: TestUser): Promise<void> {
    await this.usernameInput.fill(user.username);
    await this.passwordInput.fill(user.password);
    await this.loginButton.click();
  }
}
