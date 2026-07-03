import { test } from '@infrastructure/fixtures/api.fixture';
import { buildObject } from '@business/api/factories/object.factory';

test.describe('RESTful API partial updates', () => {
  test(
    'patches the object name without overwriting its data',
    { annotation: { type: 'feature', description: 'CRUD' } },
    async ({ collection, restApi, apiAssertions, logger }) => {
      logger.info(`Starting test: ${test.info().title}`);
      const original = buildObject();

      const createResponse = await restApi.createObject(collection, original);
      const createdObject = await apiAssertions.expectObject(createResponse, original);

      try {
        const patchResponse = await restApi.updateObject(collection, createdObject.id, {
          name: `${original.name}-patched`,
        });

        await apiAssertions.expectObject(patchResponse, {
          id: createdObject.id,
          name: `${original.name}-patched`,
          data: original.data,
        });
      } finally {
        await restApi.deleteObject(createdObject.id);
      }
    },
  );
});
