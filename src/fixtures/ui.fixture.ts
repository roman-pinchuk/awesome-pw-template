import { test as base } from '@playwright/test';
import { CartPage } from '../../pages/shop/cart.page';
import { HomePage } from '../../pages/shop/home.page';
import { ProductPage } from '../../pages/shop/product.page';

type UIFixtures = {
  homePage: HomePage;
  productPage: ProductPage;
  cartPage: CartPage;
};

export const test = base.extend<UIFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
});

export { expect } from '@playwright/test';
