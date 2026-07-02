import { test, expect } from '@/infrastructure/fixtures/ui.fixture';
import { PRODUCTS } from '@/business/constants';

test.describe('SauceDemo cart item removal', () => {
  test('removes an item from the cart and updates badge', async ({
    inventoryPage,
    cartPage,
    logger,
  }) => {
    logger.info(`Starting test: ${test.info().title}`);

    await inventoryPage.goto();
    await inventoryPage.addProductToCart(PRODUCTS.FLEECE_JACKET);
    await inventoryPage.addProductToCart(PRODUCTS.ONESIE);
    await inventoryPage.header.expectCartQuantity(2);

    await inventoryPage.header.openCart();
    await cartPage.expectLineItem(PRODUCTS.FLEECE_JACKET);
    await cartPage.expectLineItem(PRODUCTS.ONESIE);

    await cartPage.removeProduct(PRODUCTS.FLEECE_JACKET);
    await cartPage.expectLineItem(PRODUCTS.ONESIE);
    await expect.configure({ message: 'Expected only one item left after removal' })(cartPage.cartItems).toHaveCount(1);
  });

  test('removes the only item and shows empty cart', async ({
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

    await cartPage.removeProduct(PRODUCTS.BACKPACK);
    await cartPage.expectEmpty();
  });
});
