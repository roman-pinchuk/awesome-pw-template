import { type Page } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  /**
   * Navigates through the shared page boundary and waits for the initial DOM.
   *
   * @remarks
   * Page objects should route navigation through this method so route knowledge
   * stays centralized and tests do not duplicate Playwright navigation details.
   */
  async goto(path = '/'): Promise<void> {
    await this.page.goto(path);
    await this.page.waitForLoadState('domcontentloaded');
  }
}
