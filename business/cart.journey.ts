import { expect, test } from '@playwright/test';
import type { CartPage } from '@pages/cart.page';
import type { InventoryPage } from '@pages/inventory.page';

export class CartJourney {
  constructor(
    private readonly inventoryPage: InventoryPage,
    private readonly cartPage: CartPage,
  ) {}

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

  async expectEmpty(): Promise<void> {
    await test.step('expect cart is empty', async () => {
      await expect
        .configure({ message: 'Expected cart to be empty' })(this.cartPage.cartItems)
        .toHaveCount(0);
    });
  }
}
