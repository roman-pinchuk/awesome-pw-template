import { test, expect } from '@/fixtures/ui.fixture';

test.describe('Toolshop home page', () => {
  test('renders the primary shopping entry points', async ({ homePage, logger }) => {
    logger.info(`Starting test: ${test.info().title}`);
    await homePage.goto();

    await expect(homePage.header.homeLink).toBeVisible();
    await expect(homePage.header.contactLink).toBeVisible();
    await expect(homePage.sortSelect).toBeVisible();
    await expect(homePage.searchInput).toBeVisible();
    await homePage.expectProductCount(9);
    await homePage.expectVisibleProduct('Combination Pliers');
  });
});
