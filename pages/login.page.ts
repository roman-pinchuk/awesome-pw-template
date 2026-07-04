import { BasePage } from '@pages/base.page';
import type { Page } from '@playwright/test';

import { ROUTES } from '@business/constants';
import type { TestUser } from '@business/factories/user.factory';

/**
 * Page object for the SauceDemo login screen.
 *
 * @remarks
 * Owns login form selectors and direct form interaction. Higher-level tests
 * should prefer {@link LoginJourney} when validating authentication behavior.
 */
export class LoginPage extends BasePage {
  readonly usernameInput = this.page.locator('[data-test="username"]');
  readonly passwordInput = this.page.locator('[data-test="password"]');
  readonly loginButton = this.page.locator('[data-test="login-button"]');
  readonly errorMessage = this.page.locator('[data-test="error"]');

  constructor(page: Page) {
    super(page);
  }

  /** Opens the login route through the shared page navigation contract. */
  override async goto(): Promise<void> {
    await super.goto(ROUTES.LOGIN);
  }

  /** Submits the supplied SauceDemo credentials without asserting the outcome. */
  async login(user: TestUser): Promise<void> {
    await this.usernameInput.fill(user.username);
    await this.passwordInput.fill(user.password);
    await this.loginButton.click();
  }
}
