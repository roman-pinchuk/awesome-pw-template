import { test, expect } from '@/fixtures/api.fixture';
import { buildCollectionName, buildObject } from '@/data/object.factory';

test.describe('RESTful API object queries', () => {
  test('lists objects created in a collection', async ({ restApi }) => {
    const collectionName = buildCollectionName();
    const first = buildObject();
    const second = buildObject();
    const createdIds: string[] = [];

    try {
      const firstCreateResponse = await restApi.createObject(collectionName, first);
      const firstCreated = await restApi.expectObject(firstCreateResponse, first);
      createdIds.push(firstCreated.id);

      const secondCreateResponse = await restApi.createObject(collectionName, second);
      const secondCreated = await restApi.expectObject(secondCreateResponse, second);
      createdIds.push(secondCreated.id);

      const listResponse = await restApi.listObjects(collectionName);
      const objects = await restApi.expectObjects(listResponse);

      expect(objects).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: firstCreated.id, name: first.name }),
          expect.objectContaining({ id: secondCreated.id, name: second.name }),
        ]),
      );
    } finally {
      for (const objectId of createdIds) {
        await restApi.deleteObject(collectionName, objectId);
      }
    }
  });

  test('supports collection pagination', async ({ restApi }) => {
    const collectionName = buildCollectionName();
    const createdIds: string[] = [];

    try {
      for (const name of ['one', 'two', 'three']) {
        const createResponse = await restApi.createObject(
          collectionName,
          buildObject({ name: `page-${name}` }),
        );
        const created = await restApi.expectObject(createResponse, { name: `page-${name}` });
        createdIds.push(created.id);
      }

      const pagedResponse = await restApi.listObjects(collectionName, { limit: 2, offset: 1 });
      const objects = await restApi.expectObjects(pagedResponse);

      expect(objects).toHaveLength(2);
    } finally {
      for (const objectId of createdIds) {
        await restApi.deleteObject(collectionName, objectId);
      }
    }
  });
});
