import { test } from '@infrastructure/fixtures/ui.fixture';
import { PRODUCTS } from '@business/constants';

test.describe('SauceDemo cart journey', () => {
  test(
    'adds a product from inventory and verifies cart contents',
    { tag: '@smoke', annotation: { type: 'feature', description: 'Cart' } },
    async ({ cartJourney }) => {
      await cartJourney.openCartWithProducts(PRODUCTS.BACKPACK);
      await cartJourney.expectCartContains(PRODUCTS.BACKPACK);
    },
  );

  test(
    'adds multiple products and verifies cart quantity',
    { annotation: { type: 'feature', description: 'Cart' } },
    async ({ cartJourney }) => {
      await cartJourney.openCartWithProducts(
        PRODUCTS.BACKPACK,
        PRODUCTS.BIKE_LIGHT,
        PRODUCTS.BOLT_SHIRT,
      );
      await cartJourney.expectCartContains(
        PRODUCTS.BACKPACK,
        PRODUCTS.BIKE_LIGHT,
        PRODUCTS.BOLT_SHIRT,
      );
    },
  );
});
