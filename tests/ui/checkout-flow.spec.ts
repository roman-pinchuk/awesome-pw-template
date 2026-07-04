import { test } from '@infrastructure/fixtures/ui.fixture';
import type { OverviewDetails } from '@business/checkout.journey';
import { PRODUCTS, PRODUCT_PRICES } from '@business/constants';
import { DEFAULT_ADDRESS } from '@business/checkout';

function overviewFor(product: string): OverviewDetails {
  const price = PRODUCT_PRICES[product]!;
  const tax = Math.round(price * 0.08 * 100) / 100;

  return {
    payment: 'SauceCard #31337',
    shipping: 'Free Pony Express Delivery!',
    subtotal: `Item total: $${price.toFixed(2)}`,
    tax: `Tax: $${tax.toFixed(2)}`,
    total: `Total: $${(price + tax).toFixed(2)}`,
  };
}

test.describe('SauceDemo checkout flow', () => {
  test(
    'completes a full purchase journey',
    { tag: '@smoke', annotation: { type: 'feature', description: 'Checkout' } },
    async ({ checkoutJourney }) => {
      await checkoutJourney.completePurchase(
        PRODUCTS.BACKPACK,
        DEFAULT_ADDRESS,
        overviewFor(PRODUCTS.BACKPACK),
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
