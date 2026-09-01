import { test, expect } from '@infrastructure/fixtures/api.fixture';
import { RestObjectSchema, RestObjectListSchema } from '@business/api/object';

const validObject = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  collectionName: 'pw_objects_test',
  name: 'pw-object-1',
  data: {
    sku: 'sku-1',
    price: 100,
    active: true,
    category: 'playwright',
  },
  createdAt: '2026-08-19T12:00:00.000Z',
  updatedAt: '2026-08-19T12:00:00.000Z',
};

test.describe('RESTful API object schemas', () => {
  test('accepts a valid REST Object response', { tag: '@CASE-021' }, () => {
    expect(RestObjectSchema.safeParse(validObject).success).toBe(true);
  });

  test('accepts a list of REST Object responses', { tag: '@CASE-022' }, () => {
    expect(RestObjectListSchema.safeParse([validObject]).success).toBe(true);
  });

  test('rejects a REST Object with an invalid response contract', { tag: '@CASE-023' }, () => {
    const result = RestObjectSchema.safeParse({
      ...validObject,
      id: 'not-a-uuid',
      name: 42,
    });

    expect(result.success).toBe(false);
  });

  test('rejects unexpected response fields', { tag: '@CASE-024' }, () => {
    const result = RestObjectSchema.safeParse({
      ...validObject,
      unexpected: true,
    });

    expect(result.success).toBe(false);
  });
});
