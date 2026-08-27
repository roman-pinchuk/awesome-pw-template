import { expect, type APIResponse } from '@playwright/test';
import { RestObjectListSchema, RestObjectSchema, type RestObject } from '@business/api/object';

const expectOk = async (response: APIResponse): Promise<void> => {
  expect(
    response.ok(),
    `Expected successful response. Received ${response.status()} ${response.statusText()} with body: ${await response.text()}`,
  ).toBeTruthy();
};

/**
 * Verifies a REST Object response and returns the matched object.
 *
 * @remarks
 * PostgREST may return either an object or a single-item array depending on the
 * request shape. This helper normalizes that response contract for tests.
 */
export const expectObject = async (
  response: APIResponse,
  expected: Partial<RestObject>,
): Promise<RestObject> => {
  await expectOk(response);
  const body: unknown = await response.json();
  const obj = RestObjectSchema.parse(Array.isArray(body) ? body[0] : body);
  expect(obj).toBeDefined();
  expect(obj).toMatchObject(expected);
  return obj;
};

/** Verifies a successful list response and returns REST Object records. */
export const expectObjects = async (response: APIResponse): Promise<RestObject[]> => {
  await expectOk(response);
  return RestObjectListSchema.parse(await response.json());
};

/** Verifies a successful delete response references the deleted REST Object. */
export const expectDeleteMessage = async (
  response: APIResponse,
  objectId: string,
): Promise<void> => {
  await expectOk(response);
  const body: unknown = await response.json();
  const deleted = RestObjectSchema.parse(Array.isArray(body) ? body[0] : body);
  expect(deleted).toBeDefined();
  expect(deleted.id).toBe(objectId);
};
