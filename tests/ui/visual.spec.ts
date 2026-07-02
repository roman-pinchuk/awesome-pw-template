import { test, expect } from '@/infrastructure/fixtures/ui.fixture';

test.describe('SauceDemo visual regression', () => {
  test('matches the inventory page layout snapshot', async ({ inventoryPage, page, logger }) => {
    logger.info(`Starting test: ${test.info().title}`);

    await inventoryPage.goto();
    await expect.configure({ message: 'Expected inventory page screenshot to match baseline' })(page).toHaveScreenshot('inventory-page.png', {
      maxDiffPixelRatio: 0.02,
    });
  });
});
