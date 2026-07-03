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

    await this.inventoryPage.header.expectCartQuantity(products.length);
    await this.inventoryPage.header.openCart();
  }

  async expectCartContains(...products: string[]): Promise<void> {
    for (const product of products) {
      await this.cartPage.expectLineItem(product);
    }
  }
}
