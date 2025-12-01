import { NotFoundError } from '@asap-hub/errors';
import {
  FetchPaginationOptions,
  FetchProjectsFilter,
  ListProjectResponse,
  ProjectResponse,
} from '@asap-hub/model';
import { ProjectDataProvider } from '../data-providers/types/projects.data-provider.types';

type FetchProjectsOptions = {
  take?: number;
  skip?: number;
  search?: string;
  filter?: FetchProjectsFilter;
};

export default class ProjectController {
  constructor(private projectDataProvider: ProjectDataProvider) {}

  async fetch(options?: FetchProjectsOptions): Promise<ListProjectResponse> {
    const { take = 10, skip = 0, search, filter } = options || {};

    const { total, items } = await this.projectDataProvider.fetch({
      take,
      skip,
      search,
      filter,
    });

    return {
      total,
      items,
    };
  }

  async fetchById(projectId: string): Promise<ProjectResponse> {
    const project = await this.projectDataProvider.fetchById(projectId);

    if (!project) {
      throw new NotFoundError(
        undefined,
        `Project with id ${projectId} not found`,
      );
    }

    return project;
  }

  async fetchByTeamId(
    teamId: string,
    options: FetchPaginationOptions,
  ): Promise<ListProjectResponse> {
    return this.projectDataProvider.fetchByTeamId(teamId, options);
  }

  async fetchByUserId(
    userId: string,
    options: FetchPaginationOptions,
  ): Promise<ListProjectResponse> {
    return this.projectDataProvider.fetchByUserId(userId, options);
  }
}
