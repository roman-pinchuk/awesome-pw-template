import { type Locator, type Page } from '@playwright/test';
import { ROUTES } from '@business/constants';
import { HeaderComponent } from '@components';

/**
 * Page object for the SauceDemo inventory screen.
 *
 * @remarks
 * Keeps Product Catalog selectors and direct inventory actions at the page
 * boundary. Cart and product-detail workflows should be expressed through
 * journey modules when the intent spans multiple pages.
 */
export class InventoryPage {
  readonly header: HeaderComponent;
  readonly sortSelect: Locator;
  readonly inventoryItems: Locator;
  readonly itemNameElements: Locator;

  constructor(private readonly page: Page) {
    this.header = new HeaderComponent(page);
    this.sortSelect = page.locator('[data-test="product-sort-container"]');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.itemNameElements = page.locator('[data-test="inventory-item-name"]');
  }

  /** Opens the Product Catalog route. */
  async goto(): Promise<void> {
    await this.page.goto(ROUTES.INVENTORY);
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Returns the inventory card for a visible product name. */
  item(name: string): Locator {
    return this.inventoryItems.filter({ hasText: name });
  }

  /** Returns the clickable product name entry for detail-page navigation. */
  itemName(name: string): Locator {
    return this.itemNameElements.filter({ hasText: name });
  }

  /** Returns the detail link for a visible product name. */
  productLink(name: string): Locator {
    return this.item(name).locator('a[data-test$="-title-link"]');
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
    await this.productLink(name).click();
  }

  /** Adds one Product Catalog item to the cart without asserting cart state. */
  async addProductToCart(name: string): Promise<void> {
    await this.addToCartButton(name).click();
  }
}
