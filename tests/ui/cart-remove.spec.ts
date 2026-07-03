import { test, expect } from '@infrastructure/fixtures/ui.fixture';
import { PRODUCTS } from '@business/constants';

test.describe('SauceDemo cart item removal', () => {
  test(
    'removes an item from the cart and updates badge',
    { annotation: { type: 'feature', description: 'Cart' } },
    async ({ cartJourney, cartPage }) => {
      await cartJourney.openCartWithProducts(PRODUCTS.FLEECE_JACKET, PRODUCTS.ONESIE);
      await cartJourney.expectCartContains(PRODUCTS.FLEECE_JACKET, PRODUCTS.ONESIE);

      await cartPage.removeProduct(PRODUCTS.FLEECE_JACKET);
      await cartPage.expectLineItem(PRODUCTS.ONESIE);
      await expect
        .configure({ message: 'Expected only one item left after removal' })(cartPage.cartItems)
        .toHaveCount(1);
    },
  );

  test(
    'removes the only item and shows empty cart',
    { annotation: { type: 'feature', description: 'Cart' } },
    async ({ cartJourney, cartPage }) => {
      await cartJourney.openCartWithProducts(PRODUCTS.BACKPACK);
      await cartJourney.expectCartContains(PRODUCTS.BACKPACK);

      await cartPage.removeProduct(PRODUCTS.BACKPACK);
      await cartPage.expectEmpty();
    },
  );
});
