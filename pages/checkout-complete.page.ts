import { type Locator, type Page } from '@playwright/test';
import { ROUTES } from '@business/constants';

/**
 * Page object for the checkout completion screen.
 *
 * @remarks
 * Provides stable access to the order-complete confirmation state used by
 * Checkout Journey assertions and completion smoke coverage.
 */
export class CheckoutCompletePage {
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly backToProducts: Locator;

  constructor(private readonly page: Page) {
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');
    this.backToProducts = page.locator('[data-test="back-to-products"]');
  }

  /** Opens the checkout completion route. */
  async goto(): Promise<void> {
    await this.page.goto(ROUTES.CHECKOUT_COMPLETE);
    await this.page.waitForLoadState('domcontentloaded');
  }
}
