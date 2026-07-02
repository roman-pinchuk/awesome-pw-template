import { test, expect } from '@/infrastructure/fixtures/ui.fixture';

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

    await expect.configure({ message: 'Expected URL to navigate to /contact page' })(page).toHaveURL(/\/contact$/);
    await expect.configure({ message: 'Expected Contact heading on contact page' })(page.getByRole('heading', { level: 3, name: 'Contact' })).toBeVisible();
    await expect.configure({ message: 'Expected email input on contact page' })(page.getByRole('textbox', { name: 'Email address' })).toBeVisible();
    await expect.configure({ message: 'Expected Send button on contact page' })(page.getByRole('button', { name: 'Send' })).toBeVisible();
  });
});
