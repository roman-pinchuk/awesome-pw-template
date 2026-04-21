import { test, expect } from '@/fixtures/ui.fixture';

test.describe('Catalog filters', () => {
  test('supports focused product search', async ({ homePage, logger }) => {
    logger.info(`Starting test: ${test.info().title}`);
    await homePage.goto();
    await homePage.searchFor('Pliers');

    await homePage.expectVisibleProduct('Combination Pliers');
    await homePage.expectVisibleProduct('Pliers');
    await homePage.expectVisibleProduct('Long Nose Pliers');
    await homePage.expectVisibleProduct('Slip Joint Pliers');
  });

  test('navigates to the contact form from the header', async ({ homePage, page, logger }) => {
    logger.info(`Starting test: ${test.info().title}`);
    await homePage.goto();
    await homePage.header.contactLink.click();

    await expect(page).toHaveURL(/\/contact$/);
    await expect(page.getByRole('heading', { level: 3, name: 'Contact' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Email address' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Send' })).toBeVisible();
  });
});
