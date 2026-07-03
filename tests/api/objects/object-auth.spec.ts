import { test, expect } from '@/infrastructure/fixtures/api.fixture';

test.describe('RESTful API authentication', () => {
  test('rejects requests with an invalid api key', async ({ collection, request, logger }) => {
    logger.info(`Starting test: ${test.info().title}`);
    const response = await request.get('/rest/v1/objects', {
      params: { collectionName: `eq.${collection}` },
      headers: { apikey: 'invalid-api-key' },
    });

    expect(response.status()).toBe(401);
    await expect(response.text()).resolves.toContain('Invalid API key');
  });
});
