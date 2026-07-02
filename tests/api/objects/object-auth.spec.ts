import { test, expect } from '@/infrastructure/fixtures/api.fixture';

test.describe('RESTful API authentication', () => {
  test('rejects requests with an invalid api key', async ({ collection, request, logger }) => {
    logger.info(`Starting test: ${test.info().title}`);
    const response = await request.get(`collections/${collection}/objects`, {
      headers: {
        'x-api-key': 'invalid-api-key',
      },
    });

    expect.configure({ message: 'Expected 403 for invalid API key' })(response.status()).toBe(403);
    await expect.configure({ message: 'Expected error text to mention Invalid API key' })(response.text()).resolves.toContain('Invalid API key');
  });
});
