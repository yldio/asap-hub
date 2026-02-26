import {
  DataProvider,
  FetchOptions,
  FetchPaginationOptions,
  FetchProjectsFilter,
  ListProjectDataObject,
  ProjectDataObject,
  ProjectTool,
} from '@asap-hub/model';

export type FetchProjectsOptions = FetchOptions<FetchProjectsFilter>;

export type ProjectUpdateDataObject = {
  tools: ProjectTool[];
};

export type ProjectDataProvider = DataProvider<
  ProjectDataObject,
  ProjectDataObject,
  FetchProjectsOptions
> & {
  fetchByTeamId: (
    teamId: string,
    options: FetchPaginationOptions,
  ) => Promise<ListProjectDataObject>;
  fetchByUserId: (
    userId: string,
    options: FetchPaginationOptions,
  ) => Promise<ListProjectDataObject>;
  update: (id: string, update: ProjectUpdateDataObject) => Promise<void>;
};
