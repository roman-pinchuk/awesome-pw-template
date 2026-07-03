import { BasePage } from '@pages/base.page';
import type { Page } from '@playwright/test';

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

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
