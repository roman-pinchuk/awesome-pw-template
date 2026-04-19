import { expect, type Locator, type Page } from '@playwright/test';
import { HeaderComponent } from '../components/header.component';

export class ProductPage {
  readonly header: HeaderComponent;
  readonly title: Locator;
  readonly price: Locator;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly successAlert: Locator;

  constructor(private readonly page: Page) {
    this.header = new HeaderComponent(page);
    this.title = page.getByRole('heading', { level: 1 });
    this.price = page.locator('[data-test="unit-price"]');
    this.quantityInput = page.getByRole('spinbutton', { name: 'Quantity' });
    this.addToCartButton = page.locator('[data-test="add-to-cart"]');
    this.successAlert = page.getByRole('alert');
  }

  async expectLoaded(name: string): Promise<void> {
    await expect(this.title).toHaveText(name);
    await expect(this.addToCartButton).toBeVisible();
  }

  async setQuantity(quantity: number): Promise<void> {
    await this.quantityInput.fill(String(quantity));
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async expectAddedToCart(): Promise<void> {
    await expect(this.successAlert).toContainText('Product added to shopping cart');
  }
}
