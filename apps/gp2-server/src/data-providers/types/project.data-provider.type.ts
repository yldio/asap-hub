import { DataProvider, gp2 as gp2Model } from '@asap-hub/model';
import { FetchProjectOptions } from '@asap-hub/model/src/gp2';

export type ProjectDataProvider = DataProvider<
  gp2Model.ProjectDataObject,
  FetchProjectOptions,
  null,
  null,
  gp2Model.ProjectUpdateDataObject
>;
