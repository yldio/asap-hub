import { DataProvider, gp2 as gp2Model } from '@asap-hub/model';

export type ProjectDataProvider = DataProvider<
  gp2Model.ProjectDataObject,
  gp2Model.FetchProjectOptions,
  null,
  null,
  gp2Model.ProjectUpdateDataObject
>;
