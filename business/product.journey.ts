import { expect, test, type Page } from '@playwright/test';
import { URLS } from '@business/constants';
import type { InventoryPage } from '@pages/inventory.page';
import type { ProductDetailPage } from '@pages/product-detail.page';

/**
 * Intent-level workflow for Product Catalog detail behavior.
 *
 * @remarks
 * Bridges inventory and product-detail pages so specs can validate product
 * detail behavior without duplicating navigation and URL expectations.
 */
export class ProductJourney {
  constructor(
    private readonly page: Page,
    private readonly inventoryPage: InventoryPage,
    private readonly productDetailPage: ProductDetailPage,
  ) {}

  /** Opens the detail screen for a Product Catalog item. */
  async openProduct(name: string): Promise<void> {
    await test.step(`open product "${name}"`, async () => {
      await this.inventoryPage.goto();
      await this.inventoryPage.openProduct(name);
    });
  }

  /** Asserts the product detail screen is loaded for the requested item. */
  async expectLoaded(name: string): Promise<void> {
    await test.step(`expect product detail loaded for "${name}"`, async () => {
      await expect
        .configure({ message: `Expected product detail to be loaded for "${name}"` })(
          this.productDetailPage.itemName,
        )
        .toHaveText(name);
    });
  }

  /** Adds the currently loaded product detail item to the cart. */
  async addToCart(): Promise<void> {
    await test.step('add to cart from detail page', async () => {
      await this.productDetailPage.addToCart();
    });
  }

  /** Removes the currently loaded product detail item from the cart. */
  async removeFromCart(): Promise<void> {
    await test.step('remove from cart from detail page', async () => {
      await this.productDetailPage.removeFromCart();
    });
  }

  /** Asserts the add-to-cart control is visible on the detail page. */
  async expectAddToCartVisible(): Promise<void> {
    await test.step('expect add-to-cart button visible', async () => {
      await expect
        .configure({ message: 'Expected add-to-cart button on detail page' })(
          this.productDetailPage.addToCartButton,
        )
        .toBeVisible();
    });
  }

  /** Asserts the remove control is visible after adding the product to cart. */
  async expectRemoveButtonVisible(): Promise<void> {
    await test.step('expect remove button visible', async () => {
      await expect
        .configure({ message: 'Expected remove button to appear after adding to cart' })(
          this.productDetailPage.removeButton,
        )
        .toBeVisible();
    });
  }

  /** Asserts the product detail price is user-visible. */
  async expectPriceVisible(): Promise<void> {
    await test.step('expect product price visible', async () => {
      await expect
        .configure({ message: 'Expected product price on detail page' })(
          this.productDetailPage.itemPrice,
        )
        .toBeVisible();
    });
  }

  /** Navigates from product detail back to the Product Catalog. */
  async navigateBackToInventory(): Promise<void> {
    await test.step('navigate back to inventory', async () => {
      await this.productDetailPage.backToProducts.click();
      await expect
        .configure({ message: 'Expected URL to navigate back to inventory' })(this.page)
        .toHaveURL(URLS.INVENTORY);
    });
  }
}
