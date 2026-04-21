import { test as base } from '@playwright/test';
import { RestfulApiClient } from '@/clients/restful-api.client';

type APIFixtures = {
  restApi: RestfulApiClient;
};

export const test = base.extend<APIFixtures>({
  restApi: async ({ request }, use) => {
    await use(new RestfulApiClient(request));
  },
});

export { expect } from '@playwright/test';
