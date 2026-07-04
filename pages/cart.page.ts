import { type Locator, type Page } from '@playwright/test';
import { ROUTES } from '@business/constants';
import { BasePage } from '@pages/base.page';

/**
 * Page object for the SauceDemo cart screen.
 *
 * @remarks
 * Owns cart selectors and single-page cart actions. Multi-product setup and
 * cart assertions belong in {@link CartJourney} so specs stay behavior-focused.
 */
export class CartPage extends BasePage {
  readonly cartList = this.page.locator('[data-test="cart-list"]');
  readonly cartItems = this.page.locator('[data-test="inventory-item"]');
  readonly checkoutButton = this.page.locator('[data-test="checkout"]');
  readonly continueShopping = this.page.locator('[data-test="continue-shopping"]');

  constructor(page: Page) {
    super(page);
  }

  /** Opens the cart route. */
  override async goto(): Promise<void> {
    await super.goto(ROUTES.CART);
  }

  /** Returns a cart row for the requested product name. */
  item(name: string): Locator {
    return this.cartItems.filter({ hasText: name });
  }

  /** Builds the SauceDemo remove selector for a cart item. */
  removeButton(name: string): Locator {
    const id = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+$/, '');
    return this.page.locator(`[data-test="remove-${id}"]`);
  }

  /** Removes one product from the cart without asserting the resulting state. */
  async removeProduct(name: string): Promise<void> {
    await this.removeButton(name).click();
  }

  /** Moves from cart review into the checkout customer information step. */
  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
