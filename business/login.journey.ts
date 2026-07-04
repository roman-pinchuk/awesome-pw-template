import { expect, type Page } from '@playwright/test';
import type { LoginPage } from '@pages/login.page';
import { URLS } from '@business/constants';
import type { TestUser } from '@business/factories/user.factory';

export class LoginJourney {
  constructor(
    private readonly page: Page,
    private readonly loginPage: LoginPage,
  ) {}

  async loginAs(user: TestUser): Promise<void> {
    await this.loginPage.goto();
    await this.loginPage.login(user);
  }

  async expectLoginError(): Promise<void> {
    await expect
      .configure({ message: 'Expected error message on login page' })(
        this.loginPage.errorMessage,
      )
      .toBeVisible();
  }

  async expectRedirectToInventory(): Promise<void> {
    await expect
      .configure({ message: 'Expected redirect to inventory after successful login' })(this.page)
      .toHaveURL(URLS.INVENTORY);
  }

  async expectRedirectDenied(): Promise<void> {
    await expect
      .configure({ message: 'Expected URL to stay on login page' })(this.page)
      .not.toHaveURL(URLS.INVENTORY);
  }
}
