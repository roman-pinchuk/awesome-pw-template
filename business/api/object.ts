export type RestObjectData = Record<string, string | number | boolean>;

export type RestObjectPayload = {
  name: string;
  data: RestObjectData;
};

export type RestObject = {
  id: string;
  name: string;
  data: RestObjectData | null;
  collectionName?: string;
  createdAt?: string;
  updatedAt?: string;
};
