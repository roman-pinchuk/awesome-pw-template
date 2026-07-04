import { test as base } from '@playwright/test';
import {
  RestfulApiClient,
} from '@infrastructure/clients/restful.client';
import type { RestObject, RestObjectPayload } from '@business/api/object';
import * as apiAssertions from '@business/api/assertions/object.assertions';
import { buildCollectionName } from '@business/api/factories/object.factory';
import { logger as appLogger } from '@infrastructure/utils/logger';
import { setLabels } from '@infrastructure/utils/allure-labels';

/** REST Object lifecycle helper exposed to API specs. */
type ApiObjects = {
  create: (payload: RestObjectPayload, collectionName?: string) => Promise<RestObject>;
};

/**
 * API fixture surface for REST Object tests.
 *
 * @remarks
 * The fixture owns API client construction, per-test collection isolation,
 * domain assertions, and REST Object cleanup.
 */
type APIFixtures = {
  apiClientForKey: (apiKey: string) => RestfulApiClient;
  apiObjects: ApiObjects;
  collection: string;
  restApi: RestfulApiClient;
  apiAssertions: typeof apiAssertions;
};

/**
 * API test fixture with REST Object lifecycle ownership.
 *
 * @remarks
 * Tests should create records through {@link ApiObjects.create} instead of
 * local try/finally blocks. Cleanup runs after the test in reverse creation
 * order to keep API specs isolated and parallel-safe.
 */
export const test = base.extend<APIFixtures>({
  collection: async ({}, use) => {
    await use(buildCollectionName());
  },
  restApi: async ({ request }, use) => {
    await use(new RestfulApiClient(request, process.env.API_KEY));
  },
  apiClientForKey: async ({ request }, use) => {
    await use((apiKey) => new RestfulApiClient(request, apiKey));
  },
  apiObjects: async ({ collection, restApi, apiAssertions }, use) => {
    const createdIds: string[] = [];

    await use({
      create: async (payload, collectionName = collection) => {
        const response = await restApi.createObject(collectionName, payload);
        const created = await apiAssertions.expectObject(response, payload);
        createdIds.push(created.id);
        return created;
      },
    });

    for (const objectId of createdIds.reverse()) {
      await restApi.deleteObject(objectId);
    }
  },
  apiAssertions: async ({}, use) => {
    await use(apiAssertions);
  },
});

test.beforeEach(({}, testInfo) => {
  setLabels(testInfo, 'API');
  const testLog = appLogger.child({
    worker: testInfo.workerIndex,
    test: testInfo.title,
  });
  testLog.info('Starting test');
});

test.afterEach(({}, testInfo) => {
  const testLog = appLogger.child({
    worker: testInfo.workerIndex,
    test: testInfo.title,
  });
  const status = testInfo.status ?? 'unknown';
  const durationMs = Math.round(testInfo.duration);
  const message = `Test finished (${durationMs}ms)`;
    if (testInfo.status === 'failed' || testInfo.status === 'timedOut') {
    testLog.error(`${message} [${status}]`);
    if (testInfo.error?.message) {
      testLog.error(testInfo.error.message);
    }
  } else {
    testLog.info(`${message} [${status}]`);
  }
});

export { expect } from '@playwright/test';
