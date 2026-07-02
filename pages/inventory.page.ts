import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from '@/pages/base.page';
import { HeaderComponent } from '@/pages/components/header.component';

export class InventoryPage extends BasePage {
  readonly header = new HeaderComponent(this.page);
  readonly sortSelect = this.page.locator('[data-test="product-sort-container"]');
  readonly inventoryItems = this.page.locator('[data-test="inventory-item"]');

  constructor(page: Page) {
    super(page);
  }

  override async goto(): Promise<void> {
    await this.page.goto('https://www.saucedemo.com/inventory.html');
    await this.page.waitForLoadState('domcontentloaded');
  }

  item(name: string): Locator {
    return this.inventoryItems.filter({ hasText: name });
  }

  itemName(name: string): Locator {
    return this.page.locator('[data-test="inventory-item-name"]').filter({ hasText: name });
  }

  addToCartButton(name: string): Locator {
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
    return this.page.locator(`[data-test="add-to-cart-${id}"]`);
  }

  async openProduct(name: string): Promise<void> {
    await this.itemName(name).click();
  }

  async addProductToCart(name: string): Promise<void> {
    await this.addToCartButton(name).click();
  }

  async expectVisibleProduct(name: string): Promise<void> {
    await expect.configure({ message: `Expected product "${name}" to be visible in inventory` })(this.itemName(name)).toBeVisible();
  }

  async expectProductCount(count: number): Promise<void> {
    await expect.configure({ message: `Expected inventory to show ${count} products` })(this.inventoryItems).toHaveCount(count);
  }
}
