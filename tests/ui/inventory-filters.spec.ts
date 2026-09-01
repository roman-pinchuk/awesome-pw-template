import { test, expect } from '@infrastructure/fixtures/ui.fixture';
import { PRODUCT_SORT_ORDERS } from '@business/constants';

test.describe('SauceDemo inventory filters', () => {
  test(
    'sorts products by name A to Z (default)',
    { tag: '@CASE-003', annotation: { type: 'feature', description: 'Inventory' } },
    async ({ inventoryPage }) => {
      await inventoryPage.goto();
      await expect
        .configure({ message: 'Expected default sort to be A-Z' })(inventoryPage.sortSelect)
        .toHaveValue('az');
      await expect
        .configure({ message: 'Expected inventory to show 6 products' })(
          inventoryPage.inventoryItems,
        )
        .toHaveCount(6);
      await expect
        .configure({ message: 'Expected inventory products to be sorted by visible order' })(
          inventoryPage.itemNameElements,
        )
        .toHaveText([...PRODUCT_SORT_ORDERS.NAME_ASC]);
    },
  );

  test(
    'sorts products by name Z to A',
    { tag: '@CASE-004', annotation: { type: 'feature', description: 'Inventory' } },
    async ({ inventoryPage }) => {
      await inventoryPage.goto();
      await inventoryPage.sortSelect.selectOption('za');

      await expect
        .configure({ message: 'Expected sort to be Z-A' })(inventoryPage.sortSelect)
        .toHaveValue('za');
      await expect
        .configure({ message: 'Expected inventory products to be sorted by visible order' })(
          inventoryPage.itemNameElements,
        )
        .toHaveText([...PRODUCT_SORT_ORDERS.NAME_DESC]);
    },
  );

  test(
    'sorts products by price low to high',
    { tag: '@CASE-005', annotation: { type: 'feature', description: 'Inventory' } },
    async ({ inventoryPage }) => {
      await inventoryPage.goto();
      await inventoryPage.sortSelect.selectOption('lohi');

      await expect
        .configure({ message: 'Expected sort to be low-high' })(inventoryPage.sortSelect)
        .toHaveValue('lohi');
      await expect
        .configure({ message: 'Expected inventory products to be sorted by visible order' })(
          inventoryPage.itemNameElements,
        )
        .toHaveText([...PRODUCT_SORT_ORDERS.PRICE_ASC]);
    },
  );

  test(
    'sorts products by price high to low',
    { tag: '@CASE-006', annotation: { type: 'feature', description: 'Inventory' } },
    async ({ inventoryPage }) => {
      await inventoryPage.goto();
      await inventoryPage.sortSelect.selectOption('hilo');

      await expect
        .configure({ message: 'Expected sort to be high-low' })(inventoryPage.sortSelect)
        .toHaveValue('hilo');
      await expect
        .configure({ message: 'Expected inventory products to be sorted by visible order' })(
          inventoryPage.itemNameElements,
        )
        .toHaveText([...PRODUCT_SORT_ORDERS.PRICE_DESC]);
    },
  );
});
