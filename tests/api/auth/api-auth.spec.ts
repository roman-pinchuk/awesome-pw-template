import { test, expect } from '@/infrastructure/fixtures/api.fixture';

test.describe('API authentication edge cases', () => {
  test('rejects requests with an expired or malformed api key', async ({ collection, request, logger }) => {
    logger.info(`Starting test: ${test.info().title}`);
    const response = await request.get(`collections/${collection}/objects`, {
      headers: {
        'x-api-key': '',
      },
    });

    expect.configure({ message: 'Expected 403 for empty API key' })(response.status()).toBe(403);
  });

  test('rejects requests with no api key header', async ({ collection, request, logger }) => {
    logger.info(`Starting test: ${test.info().title}`);
    const response = await request.get(`collections/${collection}/objects`);

    expect.configure({ message: 'Expected 403 for missing API key header' })(response.status()).toBe(403);
  });
});
