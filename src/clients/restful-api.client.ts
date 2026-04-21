import { expect, type APIRequestContext, type APIResponse } from '@playwright/test';
import { expectOk } from '../utils/api-assertions';

export type RestObjectData = Record<string, string | number | boolean>;

export type RestObjectPayload = {
  name: string;
  data: RestObjectData;
};

export type RestObject = {
  id: string;
  name: string;
  data: RestObjectData | null;
  createdAt?: string;
  updatedAt?: string;
};

type ListOptions = {
  limit?: number;
  offset?: number;
};

export class RestfulApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async listObjects(collectionName: string, options: ListOptions = {}): Promise<APIResponse> {
    return this.request.get(this.collectionPath(collectionName), {
      params: {
        ...(options.limit !== undefined ? { limit: options.limit } : {}),
        ...(options.offset !== undefined ? { offset: options.offset } : {}),
      },
    });
  }

  async createObject(collectionName: string, payload: RestObjectPayload): Promise<APIResponse> {
    return this.request.post(this.collectionPath(collectionName), { data: payload });
  }

  async getObject(collectionName: string, objectId: string): Promise<APIResponse> {
    return this.request.get(this.objectPath(collectionName, objectId));
  }

  async replaceObject(
    collectionName: string,
    objectId: string,
    payload: RestObjectPayload,
  ): Promise<APIResponse> {
    return this.request.put(this.objectPath(collectionName, objectId), { data: payload });
  }

  async updateObject(
    collectionName: string,
    objectId: string,
    payload: Partial<RestObjectPayload>,
  ): Promise<APIResponse> {
    return this.request.patch(this.objectPath(collectionName, objectId), { data: payload });
  }

  async deleteObject(collectionName: string, objectId: string): Promise<APIResponse> {
    return this.request.delete(this.objectPath(collectionName, objectId));
  }

  async expectObject(response: APIResponse, expected: Partial<RestObject>): Promise<RestObject> {
    await expectOk(response);
    const body = (await response.json()) as RestObject;
    expect(body).toMatchObject(expected);
    return body;
  }

  async expectObjects(response: APIResponse): Promise<RestObject[]> {
    await expectOk(response);
    return (await response.json()) as RestObject[];
  }

  async expectDeleteMessage(response: APIResponse, objectId: string): Promise<void> {
    await expectOk(response);
    await expect(response.json()).resolves.toMatchObject({
      message: `Object with id = ${objectId} has been deleted.`,
    });
  }

  private collectionPath(collectionName: string): string {
    return `collections/${encodeURIComponent(collectionName)}/objects`;
  }

  private objectPath(collectionName: string, objectId: string): string {
    return `${this.collectionPath(collectionName)}/${encodeURIComponent(objectId)}`;
  }
}
