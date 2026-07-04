import { type Page } from '@playwright/test';
import { ROUTES } from '@business/constants';
import { BasePage } from '@pages/base.page';
import type { CustomerInfo } from '@business/checkout';

/**
 * Page object for the checkout customer information step.
 *
 * @remarks
 * Captures only the form mechanics for checkout step one. End-to-end checkout
 * behavior is intentionally coordinated by {@link CheckoutJourney}.
 */
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

  /** Opens the checkout customer information route. */
  override async goto(): Promise<void> {
    await super.goto(ROUTES.CHECKOUT_STEP_ONE);
  }

  /** Fills the customer information form without submitting it. */
  async fillCustomerInfo(info: CustomerInfo): Promise<void> {
    await this.firstNameInput.fill(info.firstName);
    await this.lastNameInput.fill(info.lastName);
    await this.postalCodeInput.fill(info.postalCode);
  }

  /** Advances the checkout form with the current field values. */
  async continue(): Promise<void> {
    await this.continueButton.click();
  }

  /** Completes the customer information step with one domain-level action. */
  async submitCheckout(info: CustomerInfo): Promise<void> {
    await this.fillCustomerInfo(info);
    await this.continue();
  }
}
