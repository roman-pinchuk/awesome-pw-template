import { test } from '@infrastructure/fixtures/ui.fixture';
import { PRODUCTS } from '@business/constants';

test.describe('SauceDemo product detail', () => {
  test(
    'adds product to cart from detail page',
    { tag: '@CASE-011', annotation: { type: 'feature', description: 'Product' } },
    async ({ productJourney, cartJourney }) => {
      await productJourney.openProduct(PRODUCTS.BACKPACK);
      await productJourney.addToCart();
      await cartJourney.expectCartQuantity(1);
      await productJourney.expectRemoveButtonVisible();
    },
  );

  test(
    'removes product from cart via detail page',
    { tag: '@CASE-012', annotation: { type: 'feature', description: 'Product' } },
    async ({ productJourney }) => {
      await productJourney.openProduct(PRODUCTS.BACKPACK);
      await productJourney.addToCart();
      await productJourney.removeFromCart();
      await productJourney.expectAddToCartVisible();
    },
  );

  test(
    'navigates back to inventory from detail page',
    { tag: '@CASE-013', annotation: { type: 'feature', description: 'Product' } },
    async ({ productJourney }) => {
      await productJourney.openProduct(PRODUCTS.BACKPACK);
      await productJourney.navigateBackToInventory();
    },
  );
});
