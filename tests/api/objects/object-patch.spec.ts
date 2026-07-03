import { test } from '@infrastructure/fixtures/api.fixture';
import { buildObject } from '@business/api/factories/object.factory';

test.describe('RESTful API partial updates', () => {
  test(
    'patches the object name without overwriting its data',
    { annotation: { type: 'feature', description: 'CRUD' } },
    async ({ apiObjects, collection, restApi, apiAssertions }) => {
      const original = buildObject();

      const createdObject = await apiObjects.create(original);
      const patchResponse = await restApi.updateObject(collection, createdObject.id, {
        name: `${original.name}-patched`,
      });

      await apiAssertions.expectObject(patchResponse, {
        id: createdObject.id,
        name: `${original.name}-patched`,
        data: original.data,
      });
    },
  );
});
