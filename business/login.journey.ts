import { expect, test, type Page } from '@playwright/test';
import type { LoginPage } from '@pages/login.page';
import { URLS } from '@business/constants';
import type { TestUser } from '@business/factories/user.factory';

/**
 * Intent-level workflow for SauceDemo authentication behavior.
 *
 * @remarks
 * Wraps login page interactions with redirect and validation assertions so
 * specs can express authentication outcomes instead of form mechanics.
 */
export class LoginJourney {
  constructor(
    private readonly page: Page,
    private readonly loginPage: LoginPage,
  ) {}

  /** Opens the login page and submits the provided user credentials. */
  async loginAs(user: TestUser): Promise<void> {
    await test.step(`login as ${user.username || 'empty credentials'}`, async () => {
      await this.loginPage.goto();
      await this.loginPage.login(user);
    });
  }

  /** Asserts the login page reports an authentication or validation error. */
  async expectLoginError(): Promise<void> {
    await test.step('expect login error message', async () => {
      await expect
        .configure({ message: 'Expected error message on login page' })(
          this.loginPage.errorMessage,
        )
        .toBeVisible();
    });
  }

  /** Asserts successful login redirects to the Product Catalog. */
  async expectRedirectToInventory(): Promise<void> {
    await test.step('expect redirect to inventory', async () => {
      await expect
        .configure({ message: 'Expected redirect to inventory after successful login' })(this.page)
        .toHaveURL(URLS.INVENTORY);
    });
  }

  /** Asserts authentication failure does not allow Product Catalog access. */
  async expectRedirectDenied(): Promise<void> {
    await test.step('expect redirect denied', async () => {
      await expect
        .configure({ message: 'Expected URL to stay on login page' })(this.page)
        .not.toHaveURL(URLS.INVENTORY);
    });
  }
}
