import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from '@pages/base.page';

export class CartPage extends BasePage {
  readonly cartList = this.page.locator('[data-test="cart-list"]');
  readonly cartItems = this.page.locator('[data-test="inventory-item"]');
  readonly checkoutButton = this.page.locator('[data-test="checkout"]');
  readonly continueShopping = this.page.locator('[data-test="continue-shopping"]');

  constructor(page: Page) {
    super(page);
  }

  override async goto(): Promise<void> {
    await this.page.goto('https://www.saucedemo.com/cart.html');
    await this.page.waitForLoadState('domcontentloaded');
  }

  item(name: string): Locator {
    return this.cartItems.filter({ hasText: name });
  }

  removeButton(name: string): Locator {
    const id = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+$/, '');
    return this.page.locator(`[data-test="remove-${id}"]`);
  }

  async expectLineItem(name: string): Promise<void> {
    await expect
      .configure({ message: `Expected cart to contain "${name}"` })(this.item(name))
      .toBeVisible();
  }

  async removeProduct(name: string): Promise<void> {
    await this.removeButton(name).click();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async expectEmpty(): Promise<void> {
    await expect.configure({ message: 'Expected cart to be empty' })(this.cartItems).toHaveCount(0);
  }
}
