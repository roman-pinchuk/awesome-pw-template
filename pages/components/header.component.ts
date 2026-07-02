import { expect, type Locator, type Page } from '@playwright/test';

export class HeaderComponent {
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly menuButton: Locator;
  readonly appLogo: Locator;

  constructor(private readonly page: Page) {
    this.cartLink = this.page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = this.page.locator('[data-test="shopping-cart-badge"]');
    this.menuButton = this.page.locator('[data-test="open-menu"]');
    this.appLogo = this.page.locator('.app_logo');
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async expectCartQuantity(expected: number): Promise<void> {
    if (expected > 0) {
      await expect.configure({ message: `Expected cart badge to show ${expected}` })(this.cartBadge).toHaveText(String(expected));
    } else {
      await expect.configure({ message: 'Expected cart badge to not exist when cart is empty' })(this.cartBadge).not.toBeVisible();
    }
  }
}
