import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from '@/pages/base.page';
import { HeaderComponent } from '@/pages/components/header.component';

export class ProductPage extends BasePage {
  readonly header: HeaderComponent;
  readonly title: Locator;
  readonly price: Locator;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly successAlert: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.title = page.getByRole('heading', { level: 1 });
    this.price = page.locator('[data-test="unit-price"]');
    this.quantityInput = page.getByRole('spinbutton', { name: 'Quantity' });
    this.addToCartButton = page.locator('[data-test="add-to-cart"]');
    this.successAlert = page.getByRole('alert');
  }

  async expectLoaded(name: string): Promise<void> {
    await expect.configure({ message: `Expected product title to be "${name}"` })(this.title).toHaveText(name);
    await expect.configure({ message: `Expected add-to-cart button on product page for "${name}"` })(this.addToCartButton).toBeVisible();
  }

  async setQuantity(quantity: number): Promise<void> {
    await this.quantityInput.fill(String(quantity));
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async expectAddedToCart(): Promise<void> {
    await expect.configure({ message: 'Expected success alert after adding product to cart' })(this.successAlert).toContainText('Product added to shopping cart');
  }
}
