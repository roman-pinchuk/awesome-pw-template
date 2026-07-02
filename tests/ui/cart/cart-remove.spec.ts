import { test, expect } from '@/infrastructure/fixtures/ui.fixture';

test.describe('Cart item removal', () => {
  test('removes a product from the cart', async ({
    homePage,
    productPage,
    cartPage,
    page,
    logger,
  }) => {
    logger.info(`Starting test: ${test.info().title}`);

    await homePage.goto();
    await homePage.openProduct('Combination Pliers');
    await productPage.addToCart();
    await productPage.header.openCart();
    await cartPage.expectLineItem('Combination Pliers', 1);

    await page.locator('.btn-danger').first().click();

    await expect.configure({ message: 'Expected empty-cart message after removing the only item' })(page.getByText('The cart is empty')).toBeVisible();
  });
});
