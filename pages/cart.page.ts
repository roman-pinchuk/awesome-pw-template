import { type Locator, type Page } from '@playwright/test';
import { ROUTES } from '@business/constants';

/**
 * Page object for the SauceDemo cart screen.
 *
 * @remarks
 * Owns cart selectors and single-page cart actions. Multi-product setup and
 * cart assertions belong in {@link CartJourney} so specs stay behavior-focused.
 */
export class CartPage {
  readonly cartList: Locator;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShopping: Locator;

  constructor(private readonly page: Page) {
    this.cartList = page.locator('[data-test="cart-list"]');
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShopping = page.locator('[data-test="continue-shopping"]');
  }

  /** Opens the cart route. */
  async goto(): Promise<void> {
    await this.page.goto(ROUTES.CART);
    await this.page.waitForLoadState('domcontentloaded');
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
