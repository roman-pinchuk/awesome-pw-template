import { test, expect } from '@/infrastructure/fixtures/api.fixture';
import { buildObject } from '@/business/api/factories/object.factory';

test.describe('RESTful API object CRUD', () => {
  test('creates, reads, replaces, and deletes an object', async ({
    collection,
    restApi,
    apiAssertions,
    logger,
  }) => {
    logger.info(`Starting test: ${test.info().title}`);
    const original = buildObject();

    const createResponse = await restApi.createObject(collection, original);
    const createdObject = await apiAssertions.expectObject(createResponse, original);

    const getResponse = await restApi.getObject(collection, createdObject.id);
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
    const replaceResponse = await restApi.replaceObject(collection, createdObject.id, replacement);
    await apiAssertions.expectObject(replaceResponse, {
      id: createdObject.id,
      ...replacement,
    });

    const afterReplaceResponse = await restApi.getObject(collection, createdObject.id);
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

    const deleteResponse = await restApi.deleteObject(collection, createdObject.id);
    await apiAssertions.expectDeleteMessage(deleteResponse, createdObject.id);

    const afterDeleteResponse = await restApi.getObject(collection, createdObject.id);
    expect.configure({ message: 'Expected 404 after deleting the object' })(afterDeleteResponse.status()).toBe(404);
  });

  test('returns 404 for a missing object id', async ({ collection, restApi, logger }) => {
    logger.info(`Starting test: ${test.info().title}`);
    const response = await restApi.getObject(collection, 'missing-object-id');

    expect.configure({ message: 'Expected 404 for a missing object ID' })(response.status()).toBe(404);
  });
});
