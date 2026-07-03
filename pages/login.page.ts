import { BasePage } from '@pages/base.page';
import type { Page } from '@playwright/test';

import type { TestUser } from '@business/factories/user.factory';

export class LoginPage extends BasePage {
  readonly usernameInput = this.page.locator('[data-test="username"]');
  readonly passwordInput = this.page.locator('[data-test="password"]');
  readonly loginButton = this.page.locator('[data-test="login-button"]');
  readonly errorMessage = this.page.locator('[data-test="error"]');

  constructor(page: Page) {
    super(page);
  }

  override async goto(): Promise<void> {
    await this.page.goto('https://www.saucedemo.com');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async login(user: TestUser): Promise<void> {
    await this.usernameInput.fill(user.username);
    await this.passwordInput.fill(user.password);
    await this.loginButton.click();
  }
}
