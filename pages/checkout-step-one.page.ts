import { type Page } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import type { CustomerInfo } from '@business/checkout';

export class CheckoutStepOnePage extends BasePage {
  readonly firstNameInput = this.page.locator('[data-test="firstName"]');
  readonly lastNameInput = this.page.locator('[data-test="lastName"]');
  readonly postalCodeInput = this.page.locator('[data-test="postalCode"]');
  readonly continueButton = this.page.locator('[data-test="continue"]');
  readonly cancelButton = this.page.locator('[data-test="cancel"]');
  readonly errorMessage = this.page.locator('[data-test="error"]');

  constructor(page: Page) {
    super(page);
  }

  override async goto(): Promise<void> {
    await this.page.goto('https://www.saucedemo.com/checkout-step-one.html');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async fillCustomerInfo(info: CustomerInfo): Promise<void> {
    await this.firstNameInput.fill(info.firstName);
    await this.lastNameInput.fill(info.lastName);
    await this.postalCodeInput.fill(info.postalCode);
  }

  async continue(): Promise<void> {
    await this.continueButton.click();
  }

  async submitCheckout(info: CustomerInfo): Promise<void> {
    await this.fillCustomerInfo(info);
    await this.continue();
  }
}
