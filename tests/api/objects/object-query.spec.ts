import { test, expect } from '@/fixtures/api.fixture';
import { buildCollectionName, buildObject } from '@/data/object.factory';

test.describe('RESTful API object queries', () => {
  test('returns an empty array for a new collection', async ({ restApi }) => {
    const response = await restApi.listObjects(buildCollectionName());
    const objects = await restApi.expectObjects(response);

    expect(objects).toEqual([]);
  });

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

      const emptyPageResponse = await restApi.listObjects(collectionName, { limit: 2, offset: 10 });
      const emptyPage = await restApi.expectObjects(emptyPageResponse);

      expect(emptyPage).toEqual([]);
    } finally {
      for (const objectId of createdIds) {
        await restApi.deleteObject(collectionName, objectId);
      }
    }
  });

  test('keeps collections isolated from each other', async ({ restApi }) => {
    const firstCollection = buildCollectionName('pw_collection_a');
    const secondCollection = buildCollectionName('pw_collection_b');
    const firstObject = buildObject({ name: 'isolated-a' });
    const secondObject = buildObject({ name: 'isolated-b' });
    const cleanupTargets: Array<{ collection: string; id: string }> = [];

    try {
      const firstCreateResponse = await restApi.createObject(firstCollection, firstObject);
      const createdFirst = await restApi.expectObject(firstCreateResponse, firstObject);
      cleanupTargets.push({ collection: firstCollection, id: createdFirst.id });

      const secondCreateResponse = await restApi.createObject(secondCollection, secondObject);
      const createdSecond = await restApi.expectObject(secondCreateResponse, secondObject);
      cleanupTargets.push({ collection: secondCollection, id: createdSecond.id });

      const firstListResponse = await restApi.listObjects(firstCollection);
      const firstObjects = await restApi.expectObjects(firstListResponse);
      expect(firstObjects).toEqual([
        expect.objectContaining({ id: createdFirst.id, name: firstObject.name }),
      ]);

      const secondListResponse = await restApi.listObjects(secondCollection);
      const secondObjects = await restApi.expectObjects(secondListResponse);
      expect(secondObjects).toEqual([
        expect.objectContaining({ id: createdSecond.id, name: secondObject.name }),
      ]);
    } finally {
      for (const target of cleanupTargets) {
        await restApi.deleteObject(target.collection, target.id);
      }
    }
  });
});
