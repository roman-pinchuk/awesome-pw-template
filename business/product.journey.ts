import { expect, test, type Page } from '@playwright/test';
import { URLS } from '@business/constants';
import type { InventoryPage } from '@pages/inventory.page';
import type { ProductDetailPage } from '@pages/product-detail.page';

export class ProductJourney {
  constructor(
    private readonly page: Page,
    private readonly inventoryPage: InventoryPage,
    private readonly productDetailPage: ProductDetailPage,
  ) {}

  async openProduct(name: string): Promise<void> {
    await test.step(`open product "${name}"`, async () => {
      await this.inventoryPage.goto();
      await this.inventoryPage.openProduct(name);
    });
  }

  async expectLoaded(name: string): Promise<void> {
    await test.step(`expect product detail loaded for "${name}"`, async () => {
      await expect
        .configure({ message: `Expected product detail to be loaded for "${name}"` })(
          this.productDetailPage.itemName,
        )
        .toHaveText(name);
    });
  }

  async addToCart(): Promise<void> {
    await test.step('add to cart from detail page', async () => {
      await this.productDetailPage.addToCart();
    });
  }

  async removeFromCart(): Promise<void> {
    await test.step('remove from cart from detail page', async () => {
      await this.productDetailPage.removeFromCart();
    });
  }

  async expectAddToCartVisible(): Promise<void> {
    await test.step('expect add-to-cart button visible', async () => {
      await expect
        .configure({ message: 'Expected add-to-cart button on detail page' })(
          this.productDetailPage.addToCartButton,
        )
        .toBeVisible();
    });
  }

  async expectRemoveButtonVisible(): Promise<void> {
    await test.step('expect remove button visible', async () => {
      await expect
        .configure({ message: 'Expected remove button to appear after adding to cart' })(
          this.productDetailPage.removeButton,
        )
        .toBeVisible();
    });
  }

  async expectPriceVisible(): Promise<void> {
    await test.step('expect product price visible', async () => {
      await expect
        .configure({ message: 'Expected product price on detail page' })(
          this.productDetailPage.itemPrice,
        )
        .toBeVisible();
    });
  }

  async navigateBackToInventory(): Promise<void> {
    await test.step('navigate back to inventory', async () => {
      await this.productDetailPage.backToProducts.click();
      await expect
        .configure({ message: 'Expected URL to navigate back to inventory' })(this.page)
        .toHaveURL(URLS.INVENTORY);
    });
  }
}
