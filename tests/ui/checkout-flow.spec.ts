import { test, expect } from '@infrastructure/fixtures/ui.fixture';
import { PRODUCTS, URLS } from '@business/constants';
import { DEFAULT_ADDRESS } from '@business/checkout';

test.describe('SauceDemo checkout flow', () => {
  test(
    'completes a full purchase journey',
    { tag: '@smoke', annotation: { type: 'feature', description: 'Checkout' } },
    async ({
      cartJourney,
      cartPage,
      checkoutStepOnePage,
      checkoutStepTwoPage,
      checkoutCompletePage,
      page,
    }) => {
      await cartJourney.openCartWithProducts(PRODUCTS.BACKPACK);
      await cartJourney.expectCartContains(PRODUCTS.BACKPACK);
      await cartPage.proceedToCheckout();

      await expect
        .configure({ message: 'Expected URL to navigate to checkout step one' })(page)
        .toHaveURL(URLS.CHECKOUT_STEP_ONE);
      await checkoutStepOnePage.submitCheckout(DEFAULT_ADDRESS);

      await expect
        .configure({ message: 'Expected URL to navigate to checkout overview' })(page)
        .toHaveURL(URLS.CHECKOUT_STEP_TWO);
      await expect
        .configure({ message: 'Expected item to appear in overview' })(
          checkoutStepTwoPage.cartItems,
        )
        .toHaveCount(1);

      await checkoutStepTwoPage.finish();
      await expect
        .configure({ message: 'Expected URL to navigate to checkout complete' })(page)
        .toHaveURL(URLS.CHECKOUT_COMPLETE);
      await checkoutCompletePage.expectSuccess();
    },
  );

  test(
    'shows error for empty checkout form',
    { annotation: { type: 'feature', description: 'Checkout' } },
    async ({ cartJourney, cartPage, checkoutStepOnePage }) => {
      await cartJourney.openCartWithProducts(PRODUCTS.BIKE_LIGHT);
      await cartPage.proceedToCheckout();

      await checkoutStepOnePage.continue();
      await expect
        .configure({ message: 'Expected error for missing checkout fields' })(
          checkoutStepOnePage.errorMessage,
        )
        .toBeVisible();
    },
  );
});
