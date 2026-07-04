import type { RestObjectPayload } from '@business/api/object';

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

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
