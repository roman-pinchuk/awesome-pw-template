import { test, expect } from '@infrastructure/fixtures/api.fixture';
import { buildCollectionName, buildObject } from '@business/api/factories/object.factory';

test.describe('RESTful API object queries', () => {
  test(
    'returns an empty array for a new collection',
    { annotation: { type: 'feature', description: 'Queries' } },
    async ({ collection, restApi, apiAssertions, logger }) => {
      logger.info(`Starting test: ${test.info().title}`);
      const response = await restApi.listObjects(collection);
      const objects = await apiAssertions.expectObjects(response);

      expect
        .configure({ message: 'Expected empty array for a new collection' })(objects)
        .toEqual([]);
    },
  );

  test(
    'lists objects created in a collection',
    { annotation: { type: 'feature', description: 'Queries' } },
    async ({ collection, restApi, apiAssertions, logger }) => {
      logger.info(`Starting test: ${test.info().title}`);
      const first = buildObject();
      const second = buildObject();
      const createdIds: string[] = [];

      try {
        const firstCreateResponse = await restApi.createObject(collection, first);
        const firstCreated = await apiAssertions.expectObject(firstCreateResponse, first);
        createdIds.push(firstCreated.id);

        const secondCreateResponse = await restApi.createObject(collection, second);
        const secondCreated = await apiAssertions.expectObject(secondCreateResponse, second);
        createdIds.push(secondCreated.id);

        const listResponse = await restApi.listObjects(collection);
        const objects = await apiAssertions.expectObjects(listResponse);

        expect
          .configure({ message: 'Expected listed objects to include both created ones' })(objects)
          .toEqual(
            expect.arrayContaining([
              expect.objectContaining({ id: firstCreated.id, name: first.name }),
              expect.objectContaining({ id: secondCreated.id, name: second.name }),
            ]),
          );
      } finally {
        for (const objectId of createdIds) {
          await restApi.deleteObject(objectId);
        }
      }
    },
  );

  test(
    'supports collection pagination',
    { annotation: { type: 'feature', description: 'Queries' } },
    async ({ collection, restApi, apiAssertions, logger }) => {
      logger.info(`Starting test: ${test.info().title}`);
      const createdIds: string[] = [];

      try {
        for (const name of ['one', 'two', 'three']) {
          const createResponse = await restApi.createObject(
            collection,
            buildObject({ name: `page-${name}` }),
          );
          const created = await apiAssertions.expectObject(createResponse, {
            name: `page-${name}`,
          });
          createdIds.push(created.id);
        }

        const pagedResponse = await restApi.listObjects(collection, { limit: 2, offset: 1 });
        const objects = await apiAssertions.expectObjects(pagedResponse);

        expect
          .configure({ message: 'Expected paged results to have exactly 2 items' })(objects)
          .toHaveLength(2);

        const emptyPageResponse = await restApi.listObjects(collection, { limit: 2, offset: 10 });
        const emptyPage = await apiAssertions.expectObjects(emptyPageResponse);

        expect
          .configure({ message: 'Expected out-of-range page to be empty' })(emptyPage)
          .toEqual([]);
      } finally {
        for (const objectId of createdIds) {
          await restApi.deleteObject(objectId);
        }
      }
    },
  );

  test(
    'keeps collections isolated from each other',
    { annotation: { type: 'feature', description: 'Queries' } },
    async ({ restApi, apiAssertions, logger }) => {
      logger.info(`Starting test: ${test.info().title}`);
      const firstCollection = buildCollectionName('pw_collection_a');
      const secondCollection = buildCollectionName('pw_collection_b');
      const firstObject = buildObject({ name: 'isolated-a' });
      const secondObject = buildObject({ name: 'isolated-b' });
      const cleanupTargets: Array<{ collection: string; id: string }> = [];

      try {
        const firstCreateResponse = await restApi.createObject(firstCollection, firstObject);
        const createdFirst = await apiAssertions.expectObject(firstCreateResponse, firstObject);
        cleanupTargets.push({ collection: firstCollection, id: createdFirst.id });

        const secondCreateResponse = await restApi.createObject(secondCollection, secondObject);
        const createdSecond = await apiAssertions.expectObject(secondCreateResponse, secondObject);
        cleanupTargets.push({ collection: secondCollection, id: createdSecond.id });

        const firstListResponse = await restApi.listObjects(firstCollection);
        const firstObjects = await apiAssertions.expectObjects(firstListResponse);
        expect
          .configure({
            message: 'Expected first isolation collection to contain only its own object',
          })(firstObjects)
          .toEqual([expect.objectContaining({ id: createdFirst.id, name: firstObject.name })]);

        const secondListResponse = await restApi.listObjects(secondCollection);
        const secondObjects = await apiAssertions.expectObjects(secondListResponse);
        expect
          .configure({
            message: 'Expected second isolation collection to contain only its own object',
          })(secondObjects)
          .toEqual([expect.objectContaining({ id: createdSecond.id, name: secondObject.name })]);
      } finally {
        for (const target of cleanupTargets) {
          await restApi.deleteObject(target.id);
        }
      }
    },
  );
});
