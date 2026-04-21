import type { RestObjectPayload } from '../clients/restful-api.client';
import { randomId, randomInt } from '../utils/random';

export function buildCollectionName(prefix = 'pw_objects'): string {
  return randomId(prefix).replace(/-/g, '_');
}

export function buildObject(overrides: Partial<RestObjectPayload> = {}): RestObjectPayload {
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
}
