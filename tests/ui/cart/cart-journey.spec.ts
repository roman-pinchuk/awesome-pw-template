import { test } from '@/fixtures/ui.fixture';

test.describe('Cart journey', () => {
  test('adds a product from details page and exposes the order summary', async ({
    homePage,
    productPage,
    cartPage,
  }) => {
    await homePage.goto();
    await homePage.openProduct('Combination Pliers');

    await productPage.expectLoaded('Combination Pliers');
    await productPage.setQuantity(2);
    await productPage.addToCart();
    await productPage.expectAddedToCart();
    await productPage.header.expectCartQuantity(2);

    await productPage.header.openCart();
    await cartPage.expectLineItem('Combination Pliers', 2);
    await cartPage.expectTotal('$28.30');
  });
});
