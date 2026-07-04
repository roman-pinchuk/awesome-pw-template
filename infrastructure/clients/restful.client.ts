import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { RestObjectPayload } from '@business/api/object';

type ListOptions = {
  limit?: number;
  offset?: number;
};

const OBJECTS_PATH = '/rest/v1/objects';

/**
 * REST Adapter for the Supabase PostgREST objects endpoint.
 *
 * @remarks
 * This transport layer owns HTTP details and returns raw Playwright API
 * responses. REST Object domain shape and assertions intentionally live in the
 * business API modules.
 */
export class RestfulApiClient {
  private readonly headers: Record<string, string>;

  constructor(
    private readonly request: APIRequestContext,
    apiKey: string | undefined,
  ) {
    this.headers = { apikey: apiKey ?? '' };
  }

  /** Lists REST Objects within one isolated collection scope. */
  async listObjects(collectionName: string, options: ListOptions = {}): Promise<APIResponse> {
    const params: Record<string, string | number> = {
      collectionName: `eq.${collectionName}`,
    };
    if (options.limit !== undefined) params.limit = options.limit;
    if (options.offset !== undefined) params.offset = options.offset;
    return this.request.get(OBJECTS_PATH, { params, headers: this.headers });
  }

  /** Creates a REST Object in the requested collection scope. */
  async createObject(collectionName: string, payload: RestObjectPayload): Promise<APIResponse> {
    return this.request.post(OBJECTS_PATH, {
      data: { collectionName, ...payload },
      headers: this.headers,
    });
  }

  /** Fetches a REST Object by id using PostgREST filtering semantics. */
  async getObject(objectId: string): Promise<APIResponse> {
    return this.request.get(OBJECTS_PATH, {
      params: { id: `eq.${objectId}` },
      headers: this.headers,
    });
  }

  /** Replaces the mutable fields of a REST Object while preserving its id. */
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

  /** Applies a partial update to a REST Object. */
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

  /** Deletes a REST Object by id and returns the raw API response. */
  async deleteObject(objectId: string): Promise<APIResponse> {
    return this.request.delete(OBJECTS_PATH, {
      params: { id: `eq.${objectId}` },
      headers: this.headers,
    });
  }
}
