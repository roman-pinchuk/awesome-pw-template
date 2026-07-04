import { test, expect } from '@infrastructure/fixtures/ui.fixture';
import { PRODUCTS, URLS } from '@business/constants';

test.describe('SauceDemo product detail', () => {
  test(
    'adds product to cart from detail page',
    { annotation: { type: 'feature', description: 'Product' } },
    async ({ inventoryPage, productDetailPage, cartJourney }) => {
      await inventoryPage.goto();
      await inventoryPage.openProduct(PRODUCTS.BACKPACK);

      await productDetailPage.addToCart();
      await cartJourney.expectCartQuantity(1);
      await expect
        .configure({ message: 'Expected remove button to appear after adding to cart' })(
          productDetailPage.removeButton,
        )
        .toBeVisible();
    },
  );

  test(
    'removes product from cart via detail page',
    { annotation: { type: 'feature', description: 'Product' } },
    async ({ inventoryPage, productDetailPage }) => {
      await inventoryPage.goto();
      await inventoryPage.openProduct(PRODUCTS.BACKPACK);

      await productDetailPage.addToCart();
      await productDetailPage.removeFromCart();

      await expect
        .configure({ message: 'Expected add-to-cart button to reappear after removal' })(
          productDetailPage.addToCartButton,
        )
        .toBeVisible();
    },
  );

  test(
    'navigates back to inventory from detail page',
    { annotation: { type: 'feature', description: 'Product' } },
    async ({ inventoryPage, productDetailPage, page }) => {
      await inventoryPage.goto();
      await inventoryPage.openProduct(PRODUCTS.BACKPACK);

      await productDetailPage.backToProducts.click();
      await expect
        .configure({ message: 'Expected URL to navigate back to inventory' })(page)
        .toHaveURL(URLS.INVENTORY);
    },
  );
});
