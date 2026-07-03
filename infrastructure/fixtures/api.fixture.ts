import { test as base } from '@playwright/test';
import { RestfulApiClient } from '@/infrastructure/clients/restful.client';
import * as apiAssertions from '@/business/api/assertions/object.assertions';
import { buildCollectionName } from '@/business/api/factories/object.factory';
import { logger as appLogger } from '@/infrastructure/utils/logger';

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

export { expect } from '@playwright/test';
