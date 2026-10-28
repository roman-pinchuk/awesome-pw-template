import { type Locator, type Page } from '@playwright/test';
import { ROUTES } from '@business/constants';

/**
 * Page object for the checkout overview step.
 *
 * @remarks
 * Exposes the user-visible payment, shipping, and pricing summary fields used
 * by checkout assertions while leaving purchase orchestration to journeys.
 */
export class CheckoutStepTwoPage {
  readonly finishButton: Locator;
  readonly cancelButton: Locator;
  readonly paymentInfoValue: Locator;
  readonly shippingInfoValue: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly cartItems: Locator;

  constructor(private readonly page: Page) {
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.paymentInfoValue = page.locator('[data-test="payment-info-value"]');
    this.shippingInfoValue = page.locator('[data-test="shipping-info-value"]');
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
    this.cartItems = page.locator('[data-test="inventory-item"]');
  }

  /** Opens the checkout overview route. */
  async goto(): Promise<void> {
    await this.page.goto(ROUTES.CHECKOUT_STEP_TWO);
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Completes the checkout from the overview step. */
  async finish(): Promise<void> {
    await this.finishButton.click();
  }
}
