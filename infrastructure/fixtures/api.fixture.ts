import { test as base } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { RestfulApiClient } from '@/infrastructure/clients/restful.client';
import * as apiAssertions from '@/business/api/assertions/object.assertions';
import { buildCollectionName } from '@/business/api/factories/object.factory';
import { logger as appLogger } from '@/infrastructure/utils/logger';
import { mapLabels } from '@/infrastructure/utils/allure-labels';

type APIFixtures = {
  collection: string;
  restApi: RestfulApiClient;
  apiAssertions: typeof apiAssertions;
  logger: typeof appLogger;
};

export const test = base.extend<APIFixtures>({
  collection: async ({}, use) => {
    await use(buildCollectionName());
  },
  logger: async ({}, use) => {
    await use(appLogger);
  },
  restApi: async ({ request }, use) => {
    await use(new RestfulApiClient(request, process.env.API_KEY));
  },
  apiAssertions: async ({}, use) => {
    await use(apiAssertions);
  },
});

test.beforeEach(async ({}, testInfo) => {
  allure.epic('API');
  mapLabels(testInfo);
});

export { expect } from '@playwright/test';
