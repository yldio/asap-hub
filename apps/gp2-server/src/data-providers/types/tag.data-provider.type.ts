import { DataProvider, gp2 } from '@asap-hub/model';

export type TagDataProvider = DataProvider<
  gp2.TagDataObject,
  gp2.TagDataObject,
  null,
  gp2.TagCreateDataObject
>;
