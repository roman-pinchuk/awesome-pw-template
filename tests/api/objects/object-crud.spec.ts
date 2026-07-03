import { test, expect } from '@infrastructure/fixtures/api.fixture';
import { buildObject } from '@business/api/factories/object.factory';

test.describe('RESTful API object CRUD', () => {
  test(
    'creates, reads, replaces, and deletes an object',
    { annotation: { type: 'feature', description: 'CRUD' } },
    async ({ apiObjects, collection, restApi, apiAssertions }) => {
      const original = buildObject();

      const createdObject = await apiObjects.create(original);

      const getResponse = await restApi.getObject(createdObject.id);
      await apiAssertions.expectObject(getResponse, {
        id: createdObject.id,
        ...original,
      });

      const replacement = buildObject({
        name: `${original.name}-updated`,
        data: {
          ...original.data,
          active: false,
        },
      });
      const replaceResponse = await restApi.replaceObject(
        collection,
        createdObject.id,
        replacement,
      );
      await apiAssertions.expectObject(replaceResponse, {
        id: createdObject.id,
        ...replacement,
      });

      const afterReplaceResponse = await restApi.getObject(createdObject.id);
      const replacedObject = await apiAssertions.expectObject(afterReplaceResponse, {
        id: createdObject.id,
        ...replacement,
      });
      expect(replacedObject.data).toMatchObject({
        active: false,
        sku: replacement.data.sku,
        price: replacement.data.price,
        category: replacement.data.category,
      });

      const deleteResponse = await restApi.deleteObject(createdObject.id);
      await apiAssertions.expectDeleteMessage(deleteResponse, createdObject.id);

      const afterDeleteResponse = await restApi.getObject(createdObject.id);
      expect(await afterDeleteResponse.json()).toEqual([]);
    },
  );

  test(
    'returns an empty array for a missing object id',
    { annotation: { type: 'feature', description: 'CRUD' } },
    async ({ restApi, apiAssertions }) => {
      const response = await restApi.getObject('00000000-0000-0000-0000-000000000000');
      const objects = await apiAssertions.expectObjects(response);

      expect
        .configure({ message: 'Expected empty array for a non-existent object id' })(objects)
        .toEqual([]);
    },
  );
});
