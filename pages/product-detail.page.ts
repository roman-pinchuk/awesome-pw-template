import { type Page } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import { HeaderComponent } from '@pages/components/header.component';

/**
 * Page object for a single Product Catalog detail screen.
 *
 * @remarks
 * Owns product-detail selectors and direct add/remove actions. Cross-page
 * product behavior is expressed through {@link ProductJourney}.
 */
export class ProductDetailPage extends BasePage {
  readonly header = new HeaderComponent(this.page);
  readonly itemName = this.page.locator('[data-test="inventory-item-name"]');
  readonly itemDescription = this.page.locator('[data-test="inventory-item-desc"]');
  readonly itemPrice = this.page.locator('[data-test="inventory-item-price"]');
  readonly addToCartButton = this.page.locator('[data-test="add-to-cart"]');
  readonly removeButton = this.page.locator('[data-test="remove"]');
  readonly backToProducts = this.page.locator('[data-test="back-to-products"]');

  constructor(page: Page) {
    super(page);
  }

  /** Adds the currently displayed product to the cart. */
  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  /** Removes the currently displayed product from the cart. */
  async removeFromCart(): Promise<void> {
    await this.removeButton.click();
  }
}
