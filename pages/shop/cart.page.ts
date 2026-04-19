import { expect, type Locator, type Page } from '@playwright/test';

export class CartPage {
  readonly checkoutHeading: Locator;
  readonly cartTable: Locator;
  readonly totalValue: Locator;
  readonly proceedToCheckoutButton: Locator;

  constructor(private readonly page: Page) {
    this.checkoutHeading = page.getByTitle('Checkout');
    this.cartTable = page.getByRole('table');
    this.totalValue = page.locator('tr').filter({ hasText: 'Total' }).locator('td').nth(3);
    this.proceedToCheckoutButton = page.getByRole('button', { name: 'Proceed to checkout' });
  }

  async expectLineItem(productName: string, quantity: number): Promise<void> {
    const row = this.cartTable.getByRole('row').filter({ hasText: productName });
    await expect(row).toContainText(productName);
    await expect(row.getByRole('spinbutton', { name: `Quantity for ${productName}` })).toHaveValue(
      String(quantity),
    );
  }

  async expectTotal(total: string): Promise<void> {
    await expect(this.totalValue).toHaveText(total);
  }
}
