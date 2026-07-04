import { type Page } from '@playwright/test';
import { ROUTES } from '@business/constants';
import { BasePage } from '@pages/base.page';

/**
 * Page object for the checkout completion screen.
 *
 * @remarks
 * Provides stable access to the order-complete confirmation state used by
 * Checkout Journey assertions and completion smoke coverage.
 */
export class CheckoutCompletePage extends BasePage {
  readonly completeHeader = this.page.locator('[data-test="complete-header"]');
  readonly completeText = this.page.locator('[data-test="complete-text"]');
  readonly backToProducts = this.page.locator('[data-test="back-to-products"]');

  constructor(page: Page) {
    super(page);
  }

  /** Opens the checkout completion route. */
  override async goto(): Promise<void> {
    await super.goto(ROUTES.CHECKOUT_COMPLETE);
  }
}
