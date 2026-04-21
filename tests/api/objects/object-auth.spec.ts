import { test, expect } from '@/fixtures/api.fixture';
import { buildCollectionName } from '@/data/object.factory';

test.describe('RESTful API authentication', () => {
  test('rejects requests with an invalid api key', async ({ request }) => {
    const response = await request.get(`collections/${buildCollectionName()}/objects`, {
      headers: {
        'x-api-key': 'invalid-api-key',
      },
    });

    expect(response.status()).toBe(403);
    await expect(response.text()).resolves.toContain('Invalid API key');
  });
});
