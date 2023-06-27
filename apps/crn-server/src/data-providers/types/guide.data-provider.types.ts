import { GuideDataObject } from '@asap-hub/model';

export type GuideDataProvider = {
  fetch: () => Promise<GuideDataObject>;
};
