/** JSON-compatible custom attributes stored on a REST Object. */
export type RestObjectData = Record<string, string | number | boolean>;

/** Domain payload used when creating or replacing a REST Object. */
export type RestObjectPayload = {
  name: string;
  data: RestObjectData;
};

/**
 * REST Object record returned by the PostgREST objects table.
 *
 * @remarks
 * The domain shape is kept outside the REST adapter so transport methods can
 * return raw Playwright responses while assertions validate object semantics.
 */
export type RestObject = {
  id: string;
  name: string;
  data: RestObjectData | null;
  collectionName?: string;
  createdAt?: string;
  updatedAt?: string;
};
