import { z } from 'zod';

/** JSON-compatible custom attributes stored on a REST Object. */
export const RestObjectDataSchema = z.record(
  z.string(),
  z.union([z.string(), z.number(), z.boolean()]),
);

export type RestObjectData = z.infer<typeof RestObjectDataSchema>;

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
export const RestObjectSchema = z
  .object({
    id: z.uuid(),
    collectionName: z.string().min(1),
    name: z.string().min(1),
    data: RestObjectDataSchema.nullable(),
    createdAt: z.iso.datetime({ offset: true }),
    updatedAt: z.iso.datetime({ offset: true }),
  })
  .strict();

export const RestObjectListSchema = z.array(RestObjectSchema);

export type RestObject = z.infer<typeof RestObjectSchema>;
