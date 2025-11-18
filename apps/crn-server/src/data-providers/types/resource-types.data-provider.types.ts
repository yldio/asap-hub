import {
  FetchResourceTypesOptions,
  ListResourceTypeDataObject,
} from '@asap-hub/model';

export type ResourceTypeDataProvider = {
  fetch: (
    options: FetchResourceTypesOptions,
  ) => Promise<ListResourceTypeDataObject>;
};
