import { expect, type Page } from '@playwright/test';
import type { CustomerInfo } from '@business/checkout';
import { URLS } from '@business/constants';
import type { CartJourney } from '@business/cart.journey';
import type { CartPage } from '@pages/cart.page';
import type { CheckoutStepOnePage } from '@pages/checkout-step-one.page';
import type { CheckoutStepTwoPage } from '@pages/checkout-step-two.page';

export class CheckoutJourney {
  constructor(
    private readonly page: Page,
    private readonly cartJourney: CartJourney,
    private readonly cartPage: CartPage,
    private readonly checkoutStepOnePage: CheckoutStepOnePage,
    private readonly checkoutStepTwoPage: CheckoutStepTwoPage,
  ) {}

  async startCheckout(...products: string[]): Promise<void> {
    await this.cartJourney.openCartWithProducts(...products);
    await this.cartJourney.expectCartContains(...products);
    await this.cartPage.proceedToCheckout();
    await expect
      .configure({ message: 'Expected URL to navigate to checkout step one' })(this.page)
      .toHaveURL(URLS.CHECKOUT_STEP_ONE);
  }

  async completePurchase(product: string, customerInfo: CustomerInfo): Promise<void> {
    await this.startCheckout(product);
    await this.checkoutStepOnePage.submitCheckout(customerInfo);
    await expect
      .configure({ message: 'Expected URL to navigate to checkout overview' })(this.page)
      .toHaveURL(URLS.CHECKOUT_STEP_TWO);
    await expect
      .configure({ message: 'Expected item to appear in overview' })(
        this.checkoutStepTwoPage.cartItems,
      )
      .toHaveCount(1);
    await this.expectOverview();
    await this.checkoutStepTwoPage.finish();
  }

  async expectOverview(): Promise<void> {
    await expect
      .configure({ message: 'Expected payment info on overview' })(
        this.checkoutStepTwoPage.paymentInfoValue,
      )
      .toHaveText('SauceCard #31337');
    await expect
      .configure({ message: 'Expected shipping info on overview' })(
        this.checkoutStepTwoPage.shippingInfoValue,
      )
      .toHaveText('Free Pony Express Delivery!');
    await expect
      .configure({ message: 'Expected subtotal on overview' })(
        this.checkoutStepTwoPage.subtotalLabel,
      )
      .toContainText('Item total: $');
    await expect
      .configure({ message: 'Expected tax on overview' })(
        this.checkoutStepTwoPage.taxLabel,
      )
      .toContainText('Tax: $');
    await expect
      .configure({ message: 'Expected total on overview' })(
        this.checkoutStepTwoPage.totalLabel,
      )
      .toContainText('Total: $');
  }

  async submitEmptyCustomerInfo(): Promise<void> {
    await this.checkoutStepOnePage.continue();
  }

  async expectMissingCustomerInfoError(): Promise<void> {
    await expect
      .configure({ message: 'Expected error for missing checkout fields' })(
        this.checkoutStepOnePage.errorMessage,
      )
      .toBeVisible();
  }

  async expectComplete(): Promise<void> {
    await expect
      .configure({ message: 'Expected URL to navigate to checkout complete' })(this.page)
      .toHaveURL(URLS.CHECKOUT_COMPLETE);
    await expect
      .configure({ message: 'Expected checkout success message' })(
        this.page.locator('[data-test="complete-header"]'),
      )
      .toHaveText('Thank you for your order!');
  }
}
