import { test, expect } from '@/infrastructure/fixtures/ui.fixture';

test.describe('Contact form', () => {
  test('submits a contact message successfully', async ({ page, logger }) => {
    logger.info(`Starting test: ${test.info().title}`);

    await page.goto('/contact');
    await expect.configure({ message: 'Expected contact heading on contact page' })(page.getByRole('heading', { level: 3, name: 'Contact' })).toBeVisible();

    await page.getByRole('textbox', { name: 'Email address' }).fill('test@example.com');
    await page.getByRole('textbox', { name: 'Subject' }).fill('Test message');
    await page.getByRole('textbox', { name: 'Message' }).fill('This is a test message from Playwright.');
    await page.getByRole('button', { name: 'Send' }).click();

    await expect.configure({ message: 'Expected success alert after sending contact message' })(page.getByRole('alert')).toContainText('Thanks for your message');
  });

  test('shows validation errors when required fields are empty', async ({ page, logger }) => {
    logger.info(`Starting test: ${test.info().title}`);

    await page.goto('/contact');
    await page.getByRole('button', { name: 'Send' }).click();

    await expect.configure({ message: 'Expected validation error when contact fields are empty' })(page.getByText('Email').or(page.getByText('required'))).toBeVisible();
  });
});
