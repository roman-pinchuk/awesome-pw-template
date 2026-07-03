import { test as base } from '@playwright/test';
import { LoginPage } from '@pages/login.page';
import { InventoryPage } from '@pages/inventory.page';
import { ProductDetailPage } from '@pages/product-detail.page';
import { CartPage } from '@pages/cart.page';
import { CheckoutStepOnePage } from '@pages/checkout-step-one.page';
import { CheckoutStepTwoPage } from '@pages/checkout-step-two.page';
import { CheckoutCompletePage } from '@pages/checkout-complete.page';
import { CartJourney } from '@business/cart.journey';
import { CheckoutJourney } from '@business/checkout.journey';
import { logger as appLogger } from '@infrastructure/utils/logger';
import { setLabels } from '@infrastructure/utils/allure-labels';
import { loadEnv } from '@infrastructure/config/env';
import { createUsers, type TestUsers } from '@business/factories/user.factory';

const env = loadEnv();

type UIFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  productDetailPage: ProductDetailPage;
  cartPage: CartPage;
  checkoutStepOnePage: CheckoutStepOnePage;
  checkoutStepTwoPage: CheckoutStepTwoPage;
  checkoutCompletePage: CheckoutCompletePage;
  cartJourney: CartJourney;
  checkoutJourney: CheckoutJourney;
  users: TestUsers;
};

export const test = base.extend<UIFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  productDetailPage: async ({ page }, use) => {
    await use(new ProductDetailPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutStepOnePage: async ({ page }, use) => {
    await use(new CheckoutStepOnePage(page));
  },
  checkoutStepTwoPage: async ({ page }, use) => {
    await use(new CheckoutStepTwoPage(page));
  },
  checkoutCompletePage: async ({ page }, use) => {
    await use(new CheckoutCompletePage(page));
  },
  cartJourney: async ({ inventoryPage, cartPage }, use) => {
    await use(new CartJourney(inventoryPage, cartPage));
  },
  checkoutJourney: async (
    { page, cartJourney, cartPage, checkoutStepOnePage, checkoutStepTwoPage, checkoutCompletePage },
    use,
  ) => {
    await use(
      new CheckoutJourney(
        page,
        cartJourney,
        cartPage,
        checkoutStepOnePage,
        checkoutStepTwoPage,
        checkoutCompletePage,
      ),
    );
  },
  users: async ({}, use) => {
    await use(createUsers(env));
  },
});

test.beforeEach(({}, testInfo) => {
  setLabels(testInfo, 'UI');
  appLogger.info(`Starting test: ${testInfo.title}`);
});

export { expect } from '@playwright/test';
export type { Page, Locator } from '@playwright/test';
