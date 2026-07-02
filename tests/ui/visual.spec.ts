import { test, expect } from '@/infrastructure/fixtures/ui.fixture';
import path from 'path';
import fs from 'fs';

const PLACEHOLDER_IMAGE = path.resolve(
  'tests/ui/fixtures/bike-light-1200x1500.37c843b09a7d77409d63.jpg'
);

function imagePlaceholder() {
  return fs.readFileSync(PLACEHOLDER_IMAGE);
}

test.describe('SauceDemo visual regression', () => {
  test('matches the inventory page layout snapshot', async ({ inventoryPage, page, logger }) => {
    logger.info(`Starting test: ${test.info().title}`);

    const placeholder = imagePlaceholder();
    await page.route('**/*.{jpg,png,jpeg,gif}', async (route) => {
      await route.fulfill({ body: placeholder, contentType: 'image/jpeg' });
    });

    await inventoryPage.goto();
    await expect.configure({ message: 'Expected inventory page screenshot to match baseline' })(page).toHaveScreenshot('inventory-page.png', {
      maxDiffPixelRatio: 0.02,
    });
  });
});
