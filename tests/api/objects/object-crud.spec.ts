import { test, expect } from '@/fixtures/api.fixture';
import { buildCollectionName, buildObject } from '@/data/object.factory';

test.describe('RESTful API object CRUD', () => {
  test('creates, reads, replaces, and deletes an object', async ({ restApi, logger }) => {
    logger.info(`Starting test: ${test.info().title}`);
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

    const afterReplaceResponse = await restApi.getObject(collectionName, createdObject.id);
    const replacedObject = await restApi.expectObject(afterReplaceResponse, {
      id: createdObject.id,
      ...replacement,
    });
    expect(replacedObject.data).toMatchObject({
      active: false,
      sku: replacement.data.sku,
      price: replacement.data.price,
      category: replacement.data.category,
    });

    const deleteResponse = await restApi.deleteObject(collectionName, createdObject.id);
    await restApi.expectDeleteMessage(deleteResponse, createdObject.id);

    const afterDeleteResponse = await restApi.getObject(collectionName, createdObject.id);
    expect(afterDeleteResponse.status()).toBe(404);
  });

  test('returns 404 for a missing object id', async ({ restApi, logger }) => {
    logger.info(`Starting test: ${test.info().title}`);
    const response = await restApi.getObject(buildCollectionName(), 'missing-object-id');

    expect(response.status()).toBe(404);
  });
});
