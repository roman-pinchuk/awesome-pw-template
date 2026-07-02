export interface CustomerInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export const DEFAULT_ADDRESS: CustomerInfo = {
  firstName: 'Jane',
  lastName: 'Doe',
  postalCode: '90210',
} as const;
