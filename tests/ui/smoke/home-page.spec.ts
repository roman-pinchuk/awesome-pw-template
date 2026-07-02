import { test, expect } from '@/infrastructure/fixtures/ui.fixture';

test.describe('Toolshop home page', () => {
  test('renders the primary shopping entry points', async ({ homePage, logger }) => {
    logger.info(`Starting test: ${test.info().title}`);
    await homePage.goto();

    await expect.configure({ message: 'Expected Home link in header to be visible' })(homePage.header.homeLink).toBeVisible();
    await expect.configure({ message: 'Expected Contact link in header to be visible' })(homePage.header.contactLink).toBeVisible();
    await expect.configure({ message: 'Expected sort dropdown on home page' })(homePage.sortSelect).toBeVisible();
    await expect.configure({ message: 'Expected search input on home page' })(homePage.searchInput).toBeVisible();
    await homePage.expectProductCount(9);
    await homePage.expectVisibleProduct('Combination Pliers');
  });
});
