import { test as base } from '@playwright/test';
import { PetstoreClient } from '@/clients/petstore.client';

type APIFixtures = {
  petstore: PetstoreClient;
};

export const test = base.extend<APIFixtures>({
  petstore: async ({ request }, use) => {
    await use(new PetstoreClient(request));
  },
});

export { expect } from '@playwright/test';
