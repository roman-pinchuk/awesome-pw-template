import { test as base } from '@playwright/test';
import {
  RestfulApiClient,
} from '@infrastructure/clients/restful.client';
import type { RestObject, RestObjectPayload } from '@business/api/object';
import * as apiAssertions from '@business/api/assertions/object.assertions';
import { buildCollectionName } from '@business/api/factories/object.factory';
import { logger as appLogger } from '@infrastructure/utils/logger';
import { setLabels } from '@infrastructure/utils/allure-labels';

type ApiObjects = {
  create: (payload: RestObjectPayload, collectionName?: string) => Promise<RestObject>;
};

type APIFixtures = {
  apiClientForKey: (apiKey: string) => RestfulApiClient;
  apiObjects: ApiObjects;
  collection: string;
  restApi: RestfulApiClient;
  apiAssertions: typeof apiAssertions;
};

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
