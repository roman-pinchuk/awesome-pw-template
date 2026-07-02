import { type Page } from '@playwright/test';

type ProductResponse = {
  data: Array<{
    id: string;
    name: string;
    price: number;
  }>;
};

export async function mockSearchResults(page: Page, results: ProductResponse['data']): Promise<void> {
  await page.route('**/api/products/search*', async (route) => {
    await route.fulfill({ json: { data: results } });
  });
}

export async function mockProductDetail(page: Page, product: ProductResponse['data'][number]): Promise<void> {
  await page.route(`**/api/products/${product.id}`, async (route) => {
    await route.fulfill({ json: { data: product } });
  });
}
