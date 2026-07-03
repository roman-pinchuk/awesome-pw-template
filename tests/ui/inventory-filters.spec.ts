import { test, expect } from '@/infrastructure/fixtures/ui.fixture';

test.describe('SauceDemo inventory filters', () => {
  test('sorts products by name A to Z (default)', { annotation: { type: 'feature', description: 'Inventory' } }, async ({ inventoryPage, logger }) => {
    logger.info(`Starting test: ${test.info().title}`);

    await inventoryPage.goto();
    await expect.configure({ message: 'Expected default sort to be A-Z' })(inventoryPage.sortSelect).toHaveValue('az');
    await inventoryPage.expectProductCount(6);
  });

  test('sorts products by name Z to A', { annotation: { type: 'feature', description: 'Inventory' } }, async ({ inventoryPage, logger }) => {
    logger.info(`Starting test: ${test.info().title}`);

    await inventoryPage.goto();
    await inventoryPage.sortSelect.selectOption('za');

    await expect.configure({ message: 'Expected sort to be Z-A' })(inventoryPage.sortSelect).toHaveValue('za');
  });

  test('sorts products by price low to high', { annotation: { type: 'feature', description: 'Inventory' } }, async ({ inventoryPage, logger }) => {
    logger.info(`Starting test: ${test.info().title}`);

    await inventoryPage.goto();
    await inventoryPage.sortSelect.selectOption('lohi');

    await expect.configure({ message: 'Expected sort to be low-high' })(inventoryPage.sortSelect).toHaveValue('lohi');
  });

  test('sorts products by price high to low', { annotation: { type: 'feature', description: 'Inventory' } }, async ({ inventoryPage, logger }) => {
    logger.info(`Starting test: ${test.info().title}`);

    await inventoryPage.goto();
    await inventoryPage.sortSelect.selectOption('hilo');

    await expect.configure({ message: 'Expected sort to be high-low' })(inventoryPage.sortSelect).toHaveValue('hilo');
  });
});
