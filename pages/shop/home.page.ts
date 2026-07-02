import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from '@/pages/base.page';
import { HeaderComponent } from '@/pages/components/header.component';

export class HomePage extends BasePage {
  readonly header: HeaderComponent;
  readonly sortSelect: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly productNames: Locator;
  readonly categoryFilters: Locator;
  readonly brandFilters: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.sortSelect = page.getByRole('combobox', { name: 'sort' });
    this.searchInput = page.getByRole('textbox', { name: 'Search' });
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.productNames = page.locator('[data-test="product-name"]');
    this.categoryFilters = page.getByRole('group', { name: 'Categories' });
    this.brandFilters = page.getByRole('group', { name: 'Brands' });
  }

  override async goto(): Promise<void> {
    await super.goto('/');
    await expect.configure({ message: 'Toolshop title not found on home page' })(this.page).toHaveTitle(/Toolshop/);
  }

  async searchFor(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }

  async filterByCategory(category: string): Promise<void> {
    await this.page.getByRole('checkbox', { name: category }).check();
  }

  async filterByBrand(brand: string): Promise<void> {
    await this.page.getByRole('checkbox', { name: brand }).check();
  }

  async expectVisibleProduct(name: string): Promise<void> {
    await expect.configure({ message: `Expected product "${name}" to be visible on home page` })(
      this.page.getByRole('heading', {
        level: 5,
        name: new RegExp(`^\\s*${escapeRegex(name)}\\s*$`),
      }),
    ).toBeVisible();
  }

  async expectProductCount(count: number): Promise<void> {
    await expect.configure({ message: `Expected ${count} product names on home page` })(this.productNames).toHaveCount(count);
  }

  async expectOnlyProductNames(names: string[]): Promise<void> {
    await expect.configure({ message: 'Expected products to match the specified names exactly' })(this.productNames).toHaveText(
      names.map((name) => new RegExp(`^\\s*${escapeRegex(name)}\\s*$`)),
    );
  }

  async expectEveryVisibleProductToContain(term: string): Promise<void> {
    const names = await this.productNames.evaluateAll((elements) =>
      elements
        .filter((element) => {
          const htmlElement = element as HTMLElement;
          return Boolean(htmlElement.offsetParent || htmlElement.getClientRects().length);
        })
        .map((element) => element.textContent?.trim() ?? ''),
    );

    expect.configure({ message: 'Expected at least one visible product result' })(names.length).toBeGreaterThan(0);
    for (const name of names) {
      expect.configure({ message: `Expected every visible product name to contain "${term}"` })(name).toContain(term);
    }
  }

  async openProduct(name: string): Promise<void> {
    await this.page.getByRole('heading', { level: 5, name }).click();
  }
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
