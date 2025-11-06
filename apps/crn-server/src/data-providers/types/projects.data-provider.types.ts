import {
  DataProvider,
  FetchOptions,
  FetchProjectsFilter,
  ProjectDataObject,
} from '@asap-hub/model';

export type FetchProjectsOptions = FetchOptions<FetchProjectsFilter>;

export type ProjectDataProvider = DataProvider<
  ProjectDataObject,
  ProjectDataObject,
  FetchProjectsOptions
>;

