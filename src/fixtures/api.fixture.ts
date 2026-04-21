import { test as base } from '@playwright/test';
import { RestfulApiClient } from '@/clients/restful-api.client';
import { logger as appLogger } from '@/utils/logger';

type APIFixtures = {
  restApi: RestfulApiClient;
  logger: typeof appLogger;
};

export const test = base.extend<APIFixtures>({
  logger: async ({}, use) => {
    await use(appLogger);
  },
  restApi: async ({ request }, use) => {
    await use(new RestfulApiClient(request));
  },
});

export { expect } from '@playwright/test';
