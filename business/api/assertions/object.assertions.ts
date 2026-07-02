import { expect, type APIResponse } from '@playwright/test';
import { expectOk } from '@/infrastructure/utils/api-assertions';
import type { RestObject } from '@/infrastructure/clients/restful.client';

export async function expectObject(response: APIResponse, expected: Partial<RestObject>): Promise<RestObject> {
  await expectOk(response);
  const body = (await response.json()) as RestObject;
  expect(body).toMatchObject(expected);
  return body;
}

export async function expectObjects(response: APIResponse): Promise<RestObject[]> {
  await expectOk(response);
  return (await response.json()) as RestObject[];
}

export async function expectDeleteMessage(response: APIResponse, objectId: string): Promise<void> {
  await expectOk(response);
  await expect(response.json()).resolves.toMatchObject({
    message: `Object with id = ${objectId} has been deleted.`,
  });
}
