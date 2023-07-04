import { ListGuideResponse } from '@asap-hub/model';

export type GuideDataProvider = {
  fetch: () => Promise<ListGuideResponse>;
};
