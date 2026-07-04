import { test, expect } from '@infrastructure/fixtures/api.fixture';
import { buildObject } from '@business/api/factories/object.factory';

test.describe('RESTful API object CRUD', () => {
  test(
    'creates, reads, replaces, and deletes an object',
    { annotation: { type: 'feature', description: 'CRUD' } },
    async ({ apiObjects, collection, restApi, apiAssertions }) => {
      const original = buildObject();

      const createdObject = await test.step('create object', () =>
        apiObjects.create(original),
      );

      await test.step('read created object', async () => {
        const getResponse = await restApi.getObject(createdObject.id);
        await apiAssertions.expectObject(getResponse, {
          id: createdObject.id,
          ...original,
        });
      });

      const replacement = buildObject({
        name: `${original.name}-updated`,
        data: {
          ...original.data,
          active: false,
        },
      });

      await test.step('replace object', async () => {
        const replaceResponse = await restApi.replaceObject(
          collection,
          createdObject.id,
          replacement,
        );
        await apiAssertions.expectObject(replaceResponse, {
          id: createdObject.id,
          ...replacement,
        });
      });

      await test.step('verify replacement persisted', async () => {
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
      });

      await test.step('delete object', async () => {
        const deleteResponse = await restApi.deleteObject(createdObject.id);
        await apiAssertions.expectDeleteMessage(deleteResponse, createdObject.id);
      });

      await test.step('verify deletion', async () => {
        const afterDeleteResponse = await restApi.getObject(createdObject.id);
        expect(await afterDeleteResponse.json()).toEqual([]);
      });
    },
  );

  test(
    'returns an empty array for a missing object id',
    { annotation: { type: 'feature', description: 'CRUD' } },
    async ({ restApi, apiAssertions }) => {
      await test.step('query non-existent object id', async () => {
        const response = await restApi.getObject('00000000-0000-0000-0000-000000000000');
        const objects = await apiAssertions.expectObjects(response);

        expect
          .configure({ message: 'Expected empty array for a non-existent object id' })(objects)
          .toEqual([]);
      });
    },
  );
});
