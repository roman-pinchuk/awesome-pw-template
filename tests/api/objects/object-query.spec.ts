import { test, expect } from '@infrastructure/fixtures/api.fixture';
import { buildCollectionName, buildObject } from '@business/api/factories/object.factory';

test.describe('RESTful API object queries', () => {
  test(
    'returns an empty array for a new collection',
    { annotation: { type: 'feature', description: 'Queries' } },
    async ({ collection, restApi, apiAssertions }) => {
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
    async ({ apiObjects, collection, restApi, apiAssertions }) => {
      const first = buildObject();
      const second = buildObject();
      const firstCreated = await apiObjects.create(first);
      const secondCreated = await apiObjects.create(second);

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
    },
  );

  test(
    'supports collection pagination',
    { annotation: { type: 'feature', description: 'Queries' } },
    async ({ apiObjects, collection, restApi, apiAssertions }) => {
      for (const name of ['one', 'two', 'three']) {
        await apiObjects.create(buildObject({ name: `page-${name}` }));
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
    },
  );

  test(
    'keeps collections isolated from each other',
    { annotation: { type: 'feature', description: 'Queries' } },
    async ({ apiObjects, restApi, apiAssertions }) => {
      const firstCollection = buildCollectionName('pw_collection_a');
      const secondCollection = buildCollectionName('pw_collection_b');
      const firstObject = buildObject({ name: 'isolated-a' });
      const secondObject = buildObject({ name: 'isolated-b' });
      const createdFirst = await apiObjects.create(firstObject, firstCollection);
      const createdSecond = await apiObjects.create(secondObject, secondCollection);

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
    },
  );
});
