import { test, expect } from '@infrastructure/fixtures/api.fixture';

test.describe('RESTful API authentication', () => {
  test(
    'rejects requests with an empty api key',
    { tag: '@CASE-032', annotation: { type: 'feature', description: 'Authentication' } },
    async ({ apiClientForKey, collection }) => {
      const response = await apiClientForKey('').listObjects(collection);

      expect(response.status()).toBe(401);
      await expect(response.text()).resolves.toContain('No API key found');
    },
  );

  test(
    'rejects requests with an invalid api key',
    { tag: '@CASE-033', annotation: { type: 'feature', description: 'Authentication' } },
    async ({ apiClientForKey, collection }) => {
      const response = await apiClientForKey('invalid-api-key').listObjects(collection);

      expect(response.status()).toBe(401);
      await expect(response.text()).resolves.toContain('Invalid API key');
    },
  );
});
