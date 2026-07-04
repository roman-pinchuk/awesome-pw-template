import { expect, test, type Page } from '@playwright/test';
import type { CustomerInfo } from '@business/checkout';
import { URLS } from '@business/constants';
import type { CartJourney } from '@business/cart.journey';
import type { CartPage } from '@pages/cart.page';
import type { CheckoutStepOnePage } from '@pages/checkout-step-one.page';
import type { CheckoutStepTwoPage } from '@pages/checkout-step-two.page';

export type OverviewDetails = {
  payment: string;
  shipping: string;
  subtotal: string;
  tax: string;
  total: string;
};

export class CheckoutJourney {
  constructor(
    private readonly page: Page,
    private readonly cartJourney: CartJourney,
    private readonly cartPage: CartPage,
    private readonly checkoutStepOnePage: CheckoutStepOnePage,
    private readonly checkoutStepTwoPage: CheckoutStepTwoPage,
  ) {}

  async startCheckout(...products: string[]): Promise<void> {
    await test.step('start checkout from cart', async () => {
      await this.cartJourney.openCartWithProducts(...products);
      await this.cartJourney.expectCartContains(...products);
      await this.cartPage.proceedToCheckout();
      await expect
        .configure({ message: 'Expected URL to navigate to checkout step one' })(this.page)
        .toHaveURL(URLS.CHECKOUT_STEP_ONE);
    });
  }

  async completePurchase(
    product: string,
    customerInfo: CustomerInfo,
    overview: OverviewDetails,
  ): Promise<void> {
    await test.step('complete purchase', async () => {
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
      await this.expectOverview(overview);
      await this.checkoutStepTwoPage.finish();
    });
  }

  async expectOverview(details: OverviewDetails): Promise<void> {
    await test.step('expect checkout overview details', async () => {
      await expect
        .configure({ message: 'Expected payment info on overview' })(
          this.checkoutStepTwoPage.paymentInfoValue,
        )
        .toHaveText(details.payment);
      await expect
        .configure({ message: 'Expected shipping info on overview' })(
          this.checkoutStepTwoPage.shippingInfoValue,
        )
        .toHaveText(details.shipping);
      await expect
        .configure({ message: 'Expected subtotal on overview' })(
          this.checkoutStepTwoPage.subtotalLabel,
        )
        .toHaveText(details.subtotal);
      await expect
        .configure({ message: 'Expected tax on overview' })(
          this.checkoutStepTwoPage.taxLabel,
        )
        .toHaveText(details.tax);
      await expect
        .configure({ message: 'Expected total on overview' })(
          this.checkoutStepTwoPage.totalLabel,
        )
        .toHaveText(details.total);
    });
  }

  async submitEmptyCustomerInfo(): Promise<void> {
    await test.step('submit empty customer info', async () => {
      await this.checkoutStepOnePage.continue();
    });
  }

  async expectMissingCustomerInfoError(): Promise<void> {
    await test.step('expect missing customer info error', async () => {
      await expect
        .configure({ message: 'Expected error for missing checkout fields' })(
          this.checkoutStepOnePage.errorMessage,
        )
        .toBeVisible();
    });
  }

  async expectComplete(): Promise<void> {
    await test.step('expect checkout complete', async () => {
      await expect
        .configure({ message: 'Expected URL to navigate to checkout complete' })(this.page)
        .toHaveURL(URLS.CHECKOUT_COMPLETE);
      await expect
        .configure({ message: 'Expected checkout success message' })(
          this.page.locator('[data-test="complete-header"]'),
        )
        .toHaveText('Thank you for your order!');
    });
  }
}
