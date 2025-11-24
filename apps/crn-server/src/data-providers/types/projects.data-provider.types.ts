import {
  DataProvider,
  FetchOptions,
  FetchPaginationOptions,
  FetchProjectsFilter,
  ListProjectDataObject,
  ProjectDataObject,
} from '@asap-hub/model';

export type FetchProjectsOptions = FetchOptions<FetchProjectsFilter>;

export type ProjectDataProvider = DataProvider<
  ProjectDataObject,
  ProjectDataObject,
  FetchProjectsOptions
> & {
  fetchByTeamId: (
    teamId: string,
    options: FetchPaginationOptions,
  ) => Promise<ListProjectDataObject>;
};
