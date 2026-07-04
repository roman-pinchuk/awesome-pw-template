import { type Locator, type Page } from '@playwright/test';
import { ROUTES } from '@business/constants';
import { BasePage } from '@pages/base.page';
import { HeaderComponent } from '@pages/components/header.component';

/**
 * Page object for the SauceDemo inventory screen.
 *
 * @remarks
 * Keeps Product Catalog selectors and direct inventory actions at the page
 * boundary. Cart and product-detail workflows should be expressed through
 * journey modules when the intent spans multiple pages.
 */
export class InventoryPage extends BasePage {
  readonly header = new HeaderComponent(this.page);
  readonly sortSelect = this.page.locator('[data-test="product-sort-container"]');
  readonly inventoryItems = this.page.locator('[data-test="inventory-item"]');
  readonly itemNameElements = this.page.locator('[data-test="inventory-item-name"]');

  constructor(page: Page) {
    super(page);
  }

  /** Opens the Product Catalog route. */
  override async goto(): Promise<void> {
    await super.goto(ROUTES.INVENTORY);
  }

  /** Returns the inventory card for a visible product name. */
  item(name: string): Locator {
    return this.inventoryItems.filter({ hasText: name });
  }

  /** Returns the clickable product name entry for detail-page navigation. */
  itemName(name: string): Locator {
    return this.itemNameElements.filter({ hasText: name });
  }

  /** Builds the SauceDemo add-to-cart selector for a Product Catalog item. */
  addToCartButton(name: string): Locator {
    const id = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+$/, '');
    return this.page.locator(`[data-test="add-to-cart-${id}"]`);
  }

  /** Opens the detail page for a Product Catalog item. */
  async openProduct(name: string): Promise<void> {
    await this.itemName(name).click();
  }

  /** Adds one Product Catalog item to the cart without asserting cart state. */
  async addProductToCart(name: string): Promise<void> {
    await this.addToCartButton(name).click();
  }
}
