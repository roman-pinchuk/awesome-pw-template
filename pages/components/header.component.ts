import { expect, type Locator, type Page } from '@playwright/test';

export class HeaderComponent {
  readonly logoLink: Locator;
  readonly homeLink: Locator;
  readonly contactLink: Locator;
  readonly signInLink: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;

  constructor(private readonly page: Page) {
    this.logoLink = page.getByRole('link', { name: 'Practice Software Testing - Toolshop' });
    this.homeLink = page.getByRole('link', { name: 'Home' });
    this.contactLink = page.getByRole('link', { name: 'Contact' });
    this.signInLink = page.getByRole('link', { name: 'Sign in' });
    this.cartLink = page.locator('[data-test="nav-cart"]');
    this.cartBadge = this.cartLink.locator('[data-test="cart-quantity"]');
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async expectCartQuantity(quantity: number): Promise<void> {
    await expect.configure({ message: `Expected cart badge to show ${quantity}` })(this.cartBadge).toHaveText(String(quantity));
  }
}
