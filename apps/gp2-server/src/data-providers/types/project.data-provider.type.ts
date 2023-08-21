import { DataProvider, FetchOptions, gp2 as gp2Model } from '@asap-hub/model';

export type ProjectDataProvider = DataProvider<
  gp2Model.ProjectDataObject,
  FetchOptions,
  null,
  null,
  gp2Model.ProjectUpdateDataObject
>;
