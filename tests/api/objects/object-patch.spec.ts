import { test } from '@/fixtures/api.fixture';
import { buildCollectionName, buildObject } from '@/data/object.factory';

test.describe('RESTful API partial updates', () => {
  test('patches the object name without overwriting its data', async ({ restApi, logger }) => {
    logger.info(`Starting test: ${test.info().title}`);
    const collectionName = buildCollectionName();
    const original = buildObject();

    const createResponse = await restApi.createObject(collectionName, original);
    const createdObject = await restApi.expectObject(createResponse, original);

    try {
      const patchResponse = await restApi.updateObject(collectionName, createdObject.id, {
        name: `${original.name}-patched`,
      });

      await restApi.expectObject(patchResponse, {
        id: createdObject.id,
        name: `${original.name}-patched`,
        data: original.data,
      });
    } finally {
      await restApi.deleteObject(collectionName, createdObject.id);
    }
  });
});
