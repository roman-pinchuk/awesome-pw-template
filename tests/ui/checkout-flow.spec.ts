import { test } from '@infrastructure/fixtures/ui.fixture';
import type { OverviewDetails } from '@business/checkout.journey';
import { PRODUCTS } from '@business/constants';
import { DEFAULT_ADDRESS } from '@business/checkout';

const BACKPACK_OVERVIEW: OverviewDetails = {
  payment: 'SauceCard #31337',
  shipping: 'Free Pony Express Delivery!',
  subtotal: 'Item total: $29.99',
  tax: 'Tax: $2.40',
  total: 'Total: $32.39',
};

test.describe('SauceDemo checkout flow', () => {
  test(
    'completes a full purchase journey',
    { tag: '@smoke', annotation: { type: 'feature', description: 'Checkout' } },
    async ({ checkoutJourney }) => {
      await checkoutJourney.completePurchase(
        PRODUCTS.BACKPACK,
        DEFAULT_ADDRESS,
        BACKPACK_OVERVIEW,
      );
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
