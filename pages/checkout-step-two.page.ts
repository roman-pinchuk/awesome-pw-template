import { type Page } from '@playwright/test';
import { ROUTES } from '@business/constants';
import { BasePage } from '@pages/base.page';

/**
 * Page object for the checkout overview step.
 *
 * @remarks
 * Exposes the user-visible payment, shipping, and pricing summary fields used
 * by checkout assertions while leaving purchase orchestration to journeys.
 */
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

  /** Opens the checkout overview route. */
  override async goto(): Promise<void> {
    await super.goto(ROUTES.CHECKOUT_STEP_TWO);
  }

  /** Completes the checkout from the overview step. */
  async finish(): Promise<void> {
    await this.finishButton.click();
  }
}
