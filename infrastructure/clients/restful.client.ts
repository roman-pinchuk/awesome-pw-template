import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { RestObjectPayload } from '@business/api/object';

type ListOptions = {
  limit?: number;
  offset?: number;
};

const OBJECTS_PATH = '/rest/v1/objects';

export class RestfulApiClient {
  private readonly headers: Record<string, string>;

  constructor(
    private readonly request: APIRequestContext,
    apiKey: string | undefined,
  ) {
    this.headers = { apikey: apiKey ?? '' };
  }

  async listObjects(collectionName: string, options: ListOptions = {}): Promise<APIResponse> {
    const params: Record<string, string | number> = {
      collectionName: `eq.${collectionName}`,
    };
    if (options.limit !== undefined) params.limit = options.limit;
    if (options.offset !== undefined) params.offset = options.offset;
    return this.request.get(OBJECTS_PATH, { params, headers: this.headers });
  }

  async createObject(collectionName: string, payload: RestObjectPayload): Promise<APIResponse> {
    return this.request.post(OBJECTS_PATH, {
      data: { collectionName, ...payload },
      headers: this.headers,
    });
  }

  async getObject(objectId: string): Promise<APIResponse> {
    return this.request.get(OBJECTS_PATH, {
      params: { id: `eq.${objectId}` },
      headers: this.headers,
    });
  }

  async replaceObject(
    collectionName: string,
    objectId: string,
    payload: RestObjectPayload,
  ): Promise<APIResponse> {
    return this.request.patch(OBJECTS_PATH, {
      params: { id: `eq.${objectId}` },
      data: { collectionName, ...payload },
      headers: this.headers,
    });
  }

  async updateObject(
    collectionName: string,
    objectId: string,
    payload: Partial<RestObjectPayload>,
  ): Promise<APIResponse> {
    return this.request.patch(OBJECTS_PATH, {
      params: { id: `eq.${objectId}` },
      data: { collectionName, ...payload },
      headers: this.headers,
    });
  }

  async deleteObject(objectId: string): Promise<APIResponse> {
    return this.request.delete(OBJECTS_PATH, {
      params: { id: `eq.${objectId}` },
      headers: this.headers,
    });
  }
}
