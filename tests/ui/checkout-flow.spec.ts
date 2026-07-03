import { test } from '@infrastructure/fixtures/ui.fixture';
import { PRODUCTS } from '@business/constants';
import { DEFAULT_ADDRESS } from '@business/checkout';

test.describe('SauceDemo checkout flow', () => {
  test(
    'completes a full purchase journey',
    { tag: '@smoke', annotation: { type: 'feature', description: 'Checkout' } },
    async ({ checkoutJourney }) => {
      await checkoutJourney.completePurchase(PRODUCTS.BACKPACK, DEFAULT_ADDRESS);
      await checkoutJourney.expectComplete();
    },
  );

  test(
    'shows error for empty checkout form',
    { annotation: { type: 'feature', description: 'Checkout' } },
    async ({ checkoutJourney }) => {
      await checkoutJourney.startCheckout(PRODUCTS.BIKE_LIGHT);
      await checkoutJourney.submitEmptyCustomerInfo();
      await checkoutJourney.expectMissingCustomerInfoError();
    },
  );
});
