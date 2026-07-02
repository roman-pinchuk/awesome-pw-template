import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from '@/pages/base.page';

export class CartPage extends BasePage {
  readonly checkoutHeading: Locator;
  readonly cartTable: Locator;
  readonly totalValue: Locator;
  readonly proceedToCheckoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.checkoutHeading = page.locator('li:has-text("Cart")').first();
    this.cartTable = page.getByRole('table');
    this.totalValue = page.locator('tr').filter({ hasText: 'Total' }).locator('td').nth(3);
    this.proceedToCheckoutButton = page.getByRole('button', { name: 'Proceed to checkout' });
  }

  async expectLineItem(productName: string, quantity: number): Promise<void> {
    const row = this.cartTable.getByRole('row').filter({ hasText: productName });
    await expect.configure({ message: `Expected row to contain "${productName}"` })(row).toContainText(productName);
    await expect.configure({ message: `Expected quantity for "${productName}" to be ${quantity}` })(row.getByRole('spinbutton', { name: `Quantity for ${productName}` })).toHaveValue(
      String(quantity),
    );
  }

  async expectTotal(total: string): Promise<void> {
    await expect.configure({ message: `Expected cart total to be "${total}"` })(this.totalValue).toHaveText(total);
  }

  async proceedToCheckout(): Promise<void> {
    await this.proceedToCheckoutButton.click();
  }

  async expectLoaded(): Promise<void> {
    await expect.configure({ message: 'Expected checkout heading on cart page' })(this.checkoutHeading).toBeVisible();
    await expect.configure({ message: 'Expected cart table on cart page' })(this.cartTable).toBeVisible();
  }
}
