import { test, expect } from '@infrastructure/fixtures/ui.fixture';
import { PRODUCTS } from '@business/constants';

test.describe('SauceDemo smoke tests', () => {
  test(
    'inventory page loads with products',
    { tag: ['@smoke'], annotation: { type: 'feature', description: 'Smoke' } },
    async ({ inventoryPage }) => {
      await test.step('load inventory and verify products', async () => {
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
      });
    },
  );

  test(
    'product detail page opens from inventory',
    { tag: ['@smoke'], annotation: { type: 'feature', description: 'Smoke' } },
    async ({ productJourney }) => {
      await productJourney.openProduct(PRODUCTS.BACKPACK);
      await productJourney.expectLoaded(PRODUCTS.BACKPACK);
      await productJourney.expectAddToCartVisible();
      await productJourney.expectPriceVisible();
    },
  );

  test(
    'cart badge displays correct count',
    { tag: ['@smoke'], annotation: { type: 'feature', description: 'Smoke' } },
    async ({ cartJourney, inventoryPage }) => {
      await test.step('add products and verify cart badge updates', async () => {
        await inventoryPage.goto();
        await inventoryPage.addProductToCart(PRODUCTS.BACKPACK);
        await cartJourney.expectCartQuantity(1);

        await inventoryPage.addProductToCart(PRODUCTS.BIKE_LIGHT);
        await cartJourney.expectCartQuantity(2);
      });
    },
  );
});
