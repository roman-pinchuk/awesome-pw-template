import { test as base } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { LoginPage } from '@/pages/login.page';
import { InventoryPage } from '@/pages/inventory.page';
import { ProductDetailPage } from '@/pages/product-detail.page';
import { CartPage } from '@/pages/cart.page';
import { CheckoutStepOnePage } from '@/pages/checkout-step-one.page';
import { CheckoutStepTwoPage } from '@/pages/checkout-step-two.page';
import { CheckoutCompletePage } from '@/pages/checkout-complete.page';
import { logger as appLogger } from '@/infrastructure/utils/logger';
import { mapLabels } from '@/infrastructure/utils/allure-labels';

type UIFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  productDetailPage: ProductDetailPage;
  cartPage: CartPage;
  checkoutStepOnePage: CheckoutStepOnePage;
  checkoutStepTwoPage: CheckoutStepTwoPage;
  checkoutCompletePage: CheckoutCompletePage;
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
  logger: async ({}, use) => {
    await use(appLogger);
  },
});

test.beforeEach(async ({}, testInfo) => {
  allure.epic('UI');
  mapLabels(testInfo);
});

export { expect } from '@playwright/test';
export type { Page, Locator } from '@playwright/test';
