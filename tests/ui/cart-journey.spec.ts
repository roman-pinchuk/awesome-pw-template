import { test } from '@/infrastructure/fixtures/ui.fixture';
import { PRODUCTS } from '@/business/constants';

test.describe('SauceDemo cart journey', () => {
  test('adds a product from inventory and verifies cart contents', { tag: '@smoke' }, async ({
    inventoryPage,
    cartPage,
    logger,
  }) => {
    logger.info(`Starting test: ${test.info().title}`);

    await inventoryPage.goto();
    await inventoryPage.addProductToCart(PRODUCTS.BACKPACK);
    await inventoryPage.header.expectCartQuantity(1);

    await inventoryPage.header.openCart();
    await cartPage.expectLineItem(PRODUCTS.BACKPACK);
  });

  test('adds multiple products and verifies cart quantity', async ({
    inventoryPage,
    cartPage,
    logger,
  }) => {
    logger.info(`Starting test: ${test.info().title}`);

    await inventoryPage.goto();
    await inventoryPage.addProductToCart(PRODUCTS.BACKPACK);
    await inventoryPage.addProductToCart(PRODUCTS.BIKE_LIGHT);
    await inventoryPage.addProductToCart(PRODUCTS.BOLT_SHIRT);
    await inventoryPage.header.expectCartQuantity(3);

    await inventoryPage.header.openCart();
    await cartPage.expectLineItem(PRODUCTS.BACKPACK);
    await cartPage.expectLineItem(PRODUCTS.BIKE_LIGHT);
    await cartPage.expectLineItem(PRODUCTS.BOLT_SHIRT);
  });
});
