import { type Locator, type Page } from '@playwright/test';
import { ROUTES } from '@business/constants';
import { HeaderComponent } from '@components';

/**
 * Page object for a single Product Catalog detail screen.
 *
 * @remarks
 * Owns product-detail selectors and direct add/remove actions. Cross-page
 * product behavior is expressed through {@link ProductJourney}.
 */
export class ProductDetailPage {
  readonly header: HeaderComponent;
  readonly itemName: Locator;
  readonly itemDescription: Locator;
  readonly itemPrice: Locator;
  readonly addToCartButton: Locator;
  readonly removeButton: Locator;
  readonly backToProducts: Locator;

  constructor(private readonly page: Page) {
    this.header = new HeaderComponent(page);
    this.itemName = page.locator('[data-test="inventory-item-name"]');
    this.itemDescription = page.locator('[data-test="inventory-item-desc"]');
    this.itemPrice = page.locator('[data-test="inventory-item-price"]');
    this.addToCartButton = page.locator('[data-test="add-to-cart"]');
    this.removeButton = page.locator('[data-test="remove"]');
    this.backToProducts = page.locator('[data-test="back-to-products"]');
  }

  /** Opens a product-detail route and waits for the initial DOM. */
  async goto(path = ROUTES.LOGIN): Promise<void> {
    await this.page.goto(path);
    await this.page.waitForLoadState('domcontentloaded');
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
