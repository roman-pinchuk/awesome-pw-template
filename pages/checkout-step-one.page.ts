import { type Locator, type Page } from '@playwright/test';
import { ROUTES } from '@business/constants';
import type { CustomerInfo } from '@business/checkout';

/**
 * Page object for the checkout customer information step.
 *
 * @remarks
 * Captures only the form mechanics for checkout step one. End-to-end checkout
 * behavior is intentionally coordinated by {@link CheckoutJourney}.
 */
export class CheckoutStepOnePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  constructor(private readonly page: Page) {
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  /** Opens the checkout customer information route. */
  async goto(): Promise<void> {
    await this.page.goto(ROUTES.CHECKOUT_STEP_ONE);
    await this.page.waitForLoadState('domcontentloaded');
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
