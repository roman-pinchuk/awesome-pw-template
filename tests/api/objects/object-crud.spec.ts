import { test, expect } from '@/fixtures/api.fixture';
import { buildCollectionName, buildObject } from '@/data/object.factory';

test.describe('RESTful API object CRUD', () => {
  test('creates, reads, replaces, and deletes an object', async ({ restApi }) => {
    const collectionName = buildCollectionName();
    const original = buildObject();

    const createResponse = await restApi.createObject(collectionName, original);
    const createdObject = await restApi.expectObject(createResponse, original);

    const getResponse = await restApi.getObject(collectionName, createdObject.id);
    await restApi.expectObject(getResponse, {
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
    const replaceResponse = await restApi.replaceObject(collectionName, createdObject.id, replacement);
    await restApi.expectObject(replaceResponse, {
      id: createdObject.id,
      ...replacement,
    });

    const deleteResponse = await restApi.deleteObject(collectionName, createdObject.id);
    await restApi.expectDeleteMessage(deleteResponse, createdObject.id);

    const afterDeleteResponse = await restApi.getObject(collectionName, createdObject.id);
    expect(afterDeleteResponse.status()).toBe(404);
  });
});
