import { test as base } from '@playwright/test';
import { LoginPage } from '@pages/login.page';
import { InventoryPage } from '@pages/inventory.page';
import { ProductDetailPage } from '@pages/product-detail.page';
import { CartPage } from '@pages/cart.page';
import { CheckoutStepOnePage } from '@pages/checkout-step-one.page';
import { CheckoutStepTwoPage } from '@pages/checkout-step-two.page';
import { CheckoutCompletePage } from '@pages/checkout-complete.page';
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
  users: TestUsers;
  logger: typeof appLogger;
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
  users: async ({}, use) => {
    await use(createUsers(env));
  },
  logger: async ({}, use) => {
    await use(appLogger);
  },
});

test.beforeEach(({}, testInfo) => setLabels(testInfo, 'UI'));

export { expect } from '@playwright/test';
export type { Page, Locator } from '@playwright/test';
