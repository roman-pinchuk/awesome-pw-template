import { type Locator, type Page } from '@playwright/test';
import { ROUTES } from '@business/constants';
import { BasePage } from '@pages/base.page';
import { HeaderComponent } from '@pages/components/header.component';

export class InventoryPage extends BasePage {
  readonly header = new HeaderComponent(this.page);
  readonly sortSelect = this.page.locator('[data-test="product-sort-container"]');
  readonly inventoryItems = this.page.locator('[data-test="inventory-item"]');
  readonly itemNameElements = this.page.locator('[data-test="inventory-item-name"]');

  constructor(page: Page) {
    super(page);
  }

  override async goto(): Promise<void> {
    await super.goto(ROUTES.INVENTORY);
  }

  item(name: string): Locator {
    return this.inventoryItems.filter({ hasText: name });
  }

  itemName(name: string): Locator {
    return this.itemNameElements.filter({ hasText: name });
  }

  addToCartButton(name: string): Locator {
    const id = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+$/, '');
    return this.page.locator(`[data-test="add-to-cart-${id}"]`);
  }

  async openProduct(name: string): Promise<void> {
    await this.itemName(name).click();
  }

  async addProductToCart(name: string): Promise<void> {
    await this.addToCartButton(name).click();
  }
}
