import { expect, type Page } from '@playwright/test';
import { ROUTES } from '@business/constants';
import { BasePage } from '@pages/base.page';

export class CheckoutCompletePage extends BasePage {
  readonly completeHeader = this.page.locator('[data-test="complete-header"]');
  readonly completeText = this.page.locator('[data-test="complete-text"]');
  readonly backToProducts = this.page.locator('[data-test="back-to-products"]');

  constructor(page: Page) {
    super(page);
  }

  override async goto(): Promise<void> {
    await super.goto(ROUTES.CHECKOUT_COMPLETE);
  }

  async expectSuccess(): Promise<void> {
    await expect
      .configure({ message: 'Expected checkout success message' })(this.completeHeader)
      .toHaveText('Thank you for your order!');
  }
}
