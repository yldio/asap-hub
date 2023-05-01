import { DiscoverDataObject } from '@asap-hub/model';

export type DiscoverDataProvider = {
  fetch: () => Promise<DiscoverDataObject>;
};
