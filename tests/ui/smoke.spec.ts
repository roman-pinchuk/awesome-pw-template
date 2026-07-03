import { test, expect } from '@infrastructure/fixtures/ui.fixture';
import { PRODUCTS } from '@business/constants';

test.describe('SauceDemo smoke tests', () => {
  test(
    'inventory page loads with products',
    { tag: ['@smoke'], annotation: { type: 'feature', description: 'Smoke' } },
    async ({ inventoryPage, logger }) => {
      logger.info(`Starting test: ${test.info().title}`);

      await inventoryPage.goto();
      await inventoryPage.expectProductCount(6);
      await inventoryPage.expectVisibleProduct(PRODUCTS.BACKPACK);
      await inventoryPage.expectVisibleProduct(PRODUCTS.BIKE_LIGHT);
      await expect
        .configure({ message: 'Expected inventory page header to be visible' })(
          inventoryPage.header.appLogo,
        )
        .toBeVisible();
    },
  );

  test(
    'product detail page opens from inventory',
    { tag: ['@smoke'], annotation: { type: 'feature', description: 'Smoke' } },
    async ({ inventoryPage, productDetailPage, logger }) => {
      logger.info(`Starting test: ${test.info().title}`);

      await inventoryPage.goto();
      await inventoryPage.openProduct(PRODUCTS.BACKPACK);

      await productDetailPage.expectLoaded(PRODUCTS.BACKPACK);
      await expect
        .configure({ message: 'Expected product add-to-cart button on detail page' })(
          productDetailPage.addToCartButton,
        )
        .toBeVisible();
      await expect
        .configure({ message: 'Expected product price on detail page' })(
          productDetailPage.itemPrice,
        )
        .toBeVisible();
    },
  );

  test(
    'cart badge displays correct count',
    { tag: ['@smoke'], annotation: { type: 'feature', description: 'Smoke' } },
    async ({ inventoryPage, logger }) => {
      logger.info(`Starting test: ${test.info().title}`);

      await inventoryPage.goto();
      await inventoryPage.addProductToCart(PRODUCTS.BACKPACK);
      await inventoryPage.header.expectCartQuantity(1);

      await inventoryPage.addProductToCart(PRODUCTS.BIKE_LIGHT);
      await inventoryPage.header.expectCartQuantity(2);
    },
  );
});
