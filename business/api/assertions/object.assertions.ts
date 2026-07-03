import { expect, type APIResponse } from '@playwright/test';
import { expectOk } from '@/infrastructure/utils/api-assertions';
import type { RestObject } from '@/infrastructure/clients/restful.client';

export async function expectObject(response: APIResponse, expected: Partial<RestObject>): Promise<RestObject> {
  await expectOk(response);
  const body: unknown = await response.json();
  const obj = Array.isArray(body) ? (body as RestObject[])[0] : (body as RestObject);
  expect(obj).toBeDefined();
  expect(obj).toMatchObject(expected);
  return obj!;
}

export async function expectObjects(response: APIResponse): Promise<RestObject[]> {
  await expectOk(response);
  return (await response.json()) as RestObject[];
}

export async function expectDeleteMessage(response: APIResponse, objectId: string): Promise<void> {
  await expectOk(response);
  const body: unknown = await response.json();
  const deleted = Array.isArray(body) ? (body as RestObject[])[0] : (body as RestObject);
  expect(deleted).toBeDefined();
  expect(deleted!.id).toBe(objectId);
}
