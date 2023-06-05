import { DataProvider, gp2 as gp2Model } from '@asap-hub/model';

export type OutputDataProvider = DataProvider<
  gp2Model.OutputDataObject,
  gp2Model.FetchOutputOptions,
  gp2Model.OutputCreateDataObject,
  null,
  gp2Model.OutputUpdateDataObject
>;
