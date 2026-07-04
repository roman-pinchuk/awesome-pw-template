import { type Locator, type Page } from '@playwright/test';

/**
 * Shared SauceDemo header component.
 *
 * @remarks
 * Centralizes header selectors used across page objects, especially cart badge
 * state and cart navigation for Cart Journey setup and assertions.
 */
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

  /** Opens the cart from any page that renders the shared header. */
  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}
