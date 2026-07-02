import { expect, type Page } from '@playwright/test';
import { BasePage } from '@/pages/base.page';
import { HeaderComponent } from '@/pages/components/header.component';

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

  async expectLoaded(name: string): Promise<void> {
    await expect.configure({ message: `Expected product detail to be loaded for "${name}"` })(this.itemName).toHaveText(name);
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async removeFromCart(): Promise<void> {
    await this.removeButton.click();
  }
}
