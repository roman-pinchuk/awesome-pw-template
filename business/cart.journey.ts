import { expect } from '@playwright/test';
import type { CartPage } from '@pages/cart.page';
import type { InventoryPage } from '@pages/inventory.page';

export class CartJourney {
  constructor(
    private readonly inventoryPage: InventoryPage,
    private readonly cartPage: CartPage,
  ) {}

  async openCartWithProducts(...products: string[]): Promise<void> {
    await this.inventoryPage.goto();

    for (const product of products) {
      await this.inventoryPage.addProductToCart(product);
    }

    await this.expectCartQuantity(products.length);
    await this.inventoryPage.header.openCart();
  }

  async expectCartQuantity(expected: number): Promise<void> {
    if (expected > 0) {
      await expect
        .configure({ message: `Expected cart badge to show ${expected}` })(
          this.inventoryPage.header.cartBadge,
        )
        .toHaveText(String(expected));
    } else {
      await expect
        .configure({ message: 'Expected cart badge to not exist when cart is empty' })(
          this.inventoryPage.header.cartBadge,
        )
        .not.toBeVisible();
    }
  }

  async expectCartContains(...products: string[]): Promise<void> {
    for (const product of products) {
      await expect
        .configure({ message: `Expected cart to contain "${product}"` })(
          this.cartPage.item(product),
        )
        .toBeVisible();
    }
  }

  async expectEmpty(): Promise<void> {
    await expect
      .configure({ message: 'Expected cart to be empty' })(this.cartPage.cartItems)
      .toHaveCount(0);
  }
}
