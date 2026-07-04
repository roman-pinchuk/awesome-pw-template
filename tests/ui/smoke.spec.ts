import { test, expect } from '@infrastructure/fixtures/ui.fixture';
import { PRODUCTS } from '@business/constants';

test.describe('SauceDemo smoke tests', () => {
  test(
    'inventory page loads with products',
    { tag: ['@smoke'], annotation: { type: 'feature', description: 'Smoke' } },
    async ({ inventoryPage }) => {
      await inventoryPage.goto();
      await expect
        .configure({ message: 'Expected inventory to show 6 products' })(
          inventoryPage.inventoryItems,
        )
        .toHaveCount(6);
      await expect
        .configure({ message: `Expected product "${PRODUCTS.BACKPACK}" to be visible in inventory` })(
          inventoryPage.itemName(PRODUCTS.BACKPACK),
        )
        .toBeVisible();
      await expect
        .configure({ message: `Expected product "${PRODUCTS.BIKE_LIGHT}" to be visible in inventory` })(
          inventoryPage.itemName(PRODUCTS.BIKE_LIGHT),
        )
        .toBeVisible();
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
    async ({ inventoryPage, productDetailPage }) => {
      await inventoryPage.goto();
      await inventoryPage.openProduct(PRODUCTS.BACKPACK);

      await expect
        .configure({ message: `Expected product detail to be loaded for "${PRODUCTS.BACKPACK}"` })(
          productDetailPage.itemName,
        )
        .toHaveText(PRODUCTS.BACKPACK);
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
    async ({ cartJourney, inventoryPage }) => {
      await inventoryPage.goto();
      await inventoryPage.addProductToCart(PRODUCTS.BACKPACK);
      await cartJourney.expectCartQuantity(1);

      await inventoryPage.addProductToCart(PRODUCTS.BIKE_LIGHT);
      await cartJourney.expectCartQuantity(2);
    },
  );
});
