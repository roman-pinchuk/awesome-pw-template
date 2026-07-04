import type { RestObjectPayload } from '@business/api/object';

const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const randomId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

/**
 * Builds an isolated collection name for REST Object tests.
 *
 * @remarks
 * Per-test collection names keep list and query assertions independent from
 * shared API state and parallel worker execution.
 */
export const buildCollectionName = (prefix = 'pw_objects'): string => {
  return randomId(prefix).replace(/-/g, '_');
};

/** Builds a valid REST Object payload with overridable domain fields. */
export const buildObject = (overrides: Partial<RestObjectPayload> = {}): RestObjectPayload => {
  const defaultData: RestObjectPayload['data'] = {
    sku: randomId('sku'),
    price: randomInt(25, 250),
    active: true,
    category: 'playwright',
  };

  return {
    name: randomId('pw-object'),
    data: {
      ...defaultData,
      ...overrides.data,
    },
    ...overrides,
  };
};
