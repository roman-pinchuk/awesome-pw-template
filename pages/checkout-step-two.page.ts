import { expect, type Page } from '@playwright/test';
import { ROUTES } from '@business/constants';
import { BasePage } from '@pages/base.page';

export class CheckoutStepTwoPage extends BasePage {
  readonly finishButton = this.page.locator('[data-test="finish"]');
  readonly cancelButton = this.page.locator('[data-test="cancel"]');
  readonly paymentInfoValue = this.page.locator('[data-test="payment-info-value"]');
  readonly shippingInfoValue = this.page.locator('[data-test="shipping-info-value"]');
  readonly subtotalLabel = this.page.locator('[data-test="subtotal-label"]');
  readonly taxLabel = this.page.locator('[data-test="tax-label"]');
  readonly totalLabel = this.page.locator('[data-test="total-label"]');
  readonly cartItems = this.page.locator('[data-test="inventory-item"]');

  constructor(page: Page) {
    super(page);
  }

  override async goto(): Promise<void> {
    await super.goto(ROUTES.CHECKOUT_STEP_TWO);
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }

  async expectTotal(total: string): Promise<void> {
    await expect
      .configure({ message: `Expected total to be "${total}"` })(this.totalLabel)
      .toHaveText(total);
  }
}
