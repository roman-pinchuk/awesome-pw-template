import { expect, type APIResponse } from '@playwright/test';
import type { RestObject } from '@business/api/object';

const expectOk = async (response: APIResponse): Promise<void> => {
  expect(
    response.ok(),
    `Expected successful response. Received ${response.status()} ${response.statusText()} with body: ${await response.text()}`,
  ).toBeTruthy();
};

export const expectObject = async (
  response: APIResponse,
  expected: Partial<RestObject>,
): Promise<RestObject> => {
  await expectOk(response);
  const body: unknown = await response.json();
  const obj = Array.isArray(body) ? (body as RestObject[])[0] : (body as RestObject);
  expect(obj).toBeDefined();
  expect(obj).toMatchObject(expected);
  return obj!;
};

export const expectObjects = async (response: APIResponse): Promise<RestObject[]> => {
  await expectOk(response);
  return (await response.json()) as RestObject[];
};

export const expectDeleteMessage = async (
  response: APIResponse,
  objectId: string,
): Promise<void> => {
  await expectOk(response);
  const body: unknown = await response.json();
  const deleted = Array.isArray(body) ? (body as RestObject[])[0] : (body as RestObject);
  expect(deleted).toBeDefined();
  expect(deleted!.id).toBe(objectId);
};
