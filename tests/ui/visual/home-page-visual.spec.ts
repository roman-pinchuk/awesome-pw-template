import { test, expect } from '@/infrastructure/fixtures/ui.fixture';

test.describe('Home page visual regression', () => {
  test('matches the home page layout snapshot', async ({ homePage, page, logger }) => {
    logger.info(`Starting test: ${test.info().title}`);
    await homePage.goto();

    await expect.configure({ message: 'Expected home page screenshot to match baseline' })(page).toHaveScreenshot('home-page.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
    });
  });
});
