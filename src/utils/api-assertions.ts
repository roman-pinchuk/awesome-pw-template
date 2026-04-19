import { expect, type APIResponse } from '@playwright/test';

export async function expectOk(response: APIResponse): Promise<void> {
  expect(
    response.ok(),
    `Expected successful response. Received ${response.status()} ${response.statusText()} with body: ${await response.text()}`,
  ).toBeTruthy();
}
