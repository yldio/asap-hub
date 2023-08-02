import { DataProvider, gp2 } from '@asap-hub/model';

export type KeywordsDataProvider = DataProvider<
  gp2.KeywordDataObject,
  null,
  gp2.KeywordCreateDataObject
>;
