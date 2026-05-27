import {
  DataProvider,
  FetchOptions,
  FetchPaginationOptions,
  FetchProjectMilestonesExportOptions,
  FetchProjectMilestonesOptions,
  FetchProjectsFilter,
  ListProjectDataObject,
  ListProjectMilestonesResponse,
  MilestoneCreateRequest,
  ProjectDataObject,
  ProjectMilestonesExportResponse,
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
  fetchProjectMilestones: (
    id: string,
    options: FetchProjectMilestonesOptions,
  ) => Promise<ListProjectMilestonesResponse>;
  exportProjectMilestones: (
    id: string,
    options: FetchProjectMilestonesExportOptions,
  ) => Promise<ProjectMilestonesExportResponse>;
  createMilestone: (
    data: MilestoneCreateRequest,
    userId: string,
  ) => Promise<string>;
  isProjectMilestonesSynced: (id: string) => Promise<boolean>;
};
