import { ListGuideResponse } from '@asap-hub/model';

export type GuideDataProvider = {
  fetchByCollectionTitle: (title: string) => Promise<ListGuideResponse>;
};
