import { DataProvider, gp2 } from '@asap-hub/model';

export type NewsDataProvider = DataProvider<
  gp2.NewsDataObject,
  gp2.FetchNewsOptions
>;
