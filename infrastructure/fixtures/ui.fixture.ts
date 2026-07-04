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
import { LoginJourney } from '@business/login.journey';
import { ProductJourney } from '@business/product.journey';
import { logger as appLogger } from '@infrastructure/utils/logger';
import { setLabels } from '@infrastructure/utils/allure-labels';
import { loadEnv } from '@infrastructure/config/env';
import { createUsers, type TestUsers } from '@business/factories/user.factory';

const env = loadEnv();

type UIFixtures = {
  loginPage: LoginPage;
  loginJourney: LoginJourney;
  inventoryPage: InventoryPage;
  productDetailPage: ProductDetailPage;
  cartPage: CartPage;
  checkoutStepOnePage: CheckoutStepOnePage;
  checkoutStepTwoPage: CheckoutStepTwoPage;
  checkoutCompletePage: CheckoutCompletePage;
  cartJourney: CartJourney;
  checkoutJourney: CheckoutJourney;
  productJourney: ProductJourney;
  users: TestUsers;
};

type ConsoleEntry = {
  type: string;
  text: string;
  location: string | undefined;
};

type UIFixturesWithConsole = UIFixtures & {
  consoleEntries: ConsoleEntry[];
};

export const test = base.extend<UIFixturesWithConsole>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  loginJourney: async ({ page, loginPage }, use) => {
    await use(new LoginJourney(page, loginPage));
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
    { page, cartJourney, cartPage, checkoutStepOnePage, checkoutStepTwoPage },
    use,
  ) => {
    await use(
      new CheckoutJourney(page, cartJourney, cartPage, checkoutStepOnePage, checkoutStepTwoPage),
    );
  },
  productJourney: async ({ page, inventoryPage, productDetailPage }, use) => {
    await use(new ProductJourney(page, inventoryPage, productDetailPage));
  },
  users: async ({}, use) => {
    await use(createUsers(env));
  },

  consoleEntries: [
    async ({ page }, use, testInfo) => {
      const entries: ConsoleEntry[] = [];

      page.on('console', (msg) => {
        const loc = msg.location();
        entries.push({
          type: msg.type(),
          text: msg.text(),
          location: loc ? `${loc.url}:${loc.lineNumber}` : undefined,
        });
      });

      page.on('pageerror', (error) => {
        entries.push({
          type: 'pageerror',
          text: error.message,
          location: undefined,
        });
      });

      await use(entries);

      const errors = entries.filter(
        (e) => e.type === 'error' || e.type === 'pageerror',
      );

      if (entries.length > 0) {
        await testInfo.attach('browser-console', {
          body: entries
            .map(
              (e) =>
                `[${e.type}]${e.location ? ` (${e.location})` : ''} ${e.text}`,
            )
            .join('\n'),
          contentType: 'text/plain',
        });
      }

      if (errors.length > 0) {
        for (const err of errors) {
          appLogger.warn(
            `Browser ${err.type}${err.location ? ` at ${err.location}` : ''}: ${err.text}`,
          );
        }
      }
    },
    { auto: true },
  ],
});

test.beforeEach(({}, testInfo) => {
  setLabels(testInfo, 'UI');
  const testLog = appLogger.child({
    worker: testInfo.workerIndex,
    test: testInfo.title,
  });
  testLog.info('Starting test');
});

test.afterEach(({}, testInfo) => {
  const testLog = appLogger.child({
    worker: testInfo.workerIndex,
    test: testInfo.title,
  });
  const status = testInfo.status ?? 'unknown';
  const durationMs = Math.round(testInfo.duration);
  const message = `Test finished (${durationMs}ms)`;
    if (testInfo.status === 'failed' || testInfo.status === 'timedOut') {
    testLog.error(`${message} [${status}]`);
    if (testInfo.error?.message) {
      testLog.error(testInfo.error.message);
    }
  } else {
    testLog.info(`${message} [${status}]`);
  }
});

export { expect } from '@playwright/test';
export type { Page, Locator } from '@playwright/test';
