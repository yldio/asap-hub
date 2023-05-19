import { DataProvider, gp2 as gp2Model } from '@asap-hub/model';

export type WorkingGroupDataProvider = DataProvider<
  gp2Model.WorkingGroupDataObject,
  null,
  null,
  null,
  gp2Model.WorkingGroupUpdateDataObject
>;
