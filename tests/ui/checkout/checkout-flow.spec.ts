import { test, expect } from '@/infrastructure/fixtures/ui.fixture';

test.describe('Checkout flow', () => {
  test('proceeds to checkout from cart with an added product', async ({
    homePage,
    productPage,
    cartPage,
    page,
    logger,
  }) => {
    logger.info(`Starting test: ${test.info().title}`);

    await homePage.goto();
    await homePage.openProduct('Combination Pliers');
    await productPage.expectLoaded('Combination Pliers');
    await productPage.addToCart();
    await productPage.expectAddedToCart();
    await productPage.header.openCart();

    await cartPage.expectLoaded();
    await cartPage.proceedToCheckout();

    await expect.configure({ message: 'Expected URL to navigate to /checkout after proceedToCheckout' })(page).toHaveURL(/\/checkout/);
    await expect.configure({ message: 'Expected checkout heading on checkout page' })(page.getByRole('heading', { name: 'Checkout' })).toBeVisible();
  });
});
