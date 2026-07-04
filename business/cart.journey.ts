import { expect, test } from '@playwright/test';
import type { CartPage } from '@pages/cart.page';
import type { InventoryPage } from '@pages/inventory.page';

/**
 * Intent-level workflow for the SauceDemo Cart Journey.
 *
 * @remarks
 * Keeps repeated cart setup and user-visible cart assertions out of specs so
 * tests describe behavior instead of inventory navigation mechanics.
 */
export class CartJourney {
  constructor(
    private readonly inventoryPage: InventoryPage,
    private readonly cartPage: CartPage,
  ) {}

  /**
   * Opens the cart after adding the requested Product Catalog items.
   *
   * @remarks
   * Owns the repeated add-to-cart setup and cart badge assertion that multiple
   * cart and checkout tests depend on.
   */
  async openCartWithProducts(...products: string[]): Promise<void> {
    await test.step('open cart with products', async () => {
      await this.inventoryPage.goto();

      for (const product of products) {
        await this.inventoryPage.addProductToCart(product);
      }

      await this.expectCartQuantity(products.length);
      await this.inventoryPage.header.openCart();
    });
  }

  /** Asserts the header cart badge reflects the expected item quantity. */
  async expectCartQuantity(expected: number): Promise<void> {
    await test.step(`expect cart badge to show ${expected}`, async () => {
      await expect
        .configure({ message: `Expected cart badge to show ${expected}` })(
          this.inventoryPage.header.cartBadge,
        )
        .toHaveText(String(expected));
      await expect
        .configure({ message: `Expected cart badge to be visible` })(
          this.inventoryPage.header.cartBadge,
        )
        .toBeVisible();
    });
  }

  /** Asserts every requested product is visible in the cart. */
  async expectCartContains(...products: string[]): Promise<void> {
    await test.step('expect cart contains products', async () => {
      for (const product of products) {
        await expect
          .configure({ message: `Expected cart to contain "${product}"` })(
            this.cartPage.item(product),
          )
          .toBeVisible();
      }
    });
  }

  /** Asserts the cart has no visible item rows. */
  async expectEmpty(): Promise<void> {
    await test.step('expect cart is empty', async () => {
      await expect
        .configure({ message: 'Expected cart to be empty' })(this.cartPage.cartItems)
        .toHaveCount(0);
    });
  }
}
