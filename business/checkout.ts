/** Customer data required by the SauceDemo checkout form. */
export interface CustomerInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

/** Stable default customer data for checkout tests that do not vary identity. */
export const DEFAULT_ADDRESS: CustomerInfo = {
  firstName: 'Jane',
  lastName: 'Doe',
  postalCode: '90210',
} as const;
