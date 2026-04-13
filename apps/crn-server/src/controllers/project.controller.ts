import { NotFoundError } from '@asap-hub/errors';
import {
  FetchPaginationOptions,
  FetchProjectMilestonesOptions,
  FetchProjectsFilter,
  ListProjectMilestonesResponse,
  ListProjectResponse,
  MilestoneCreateRequest,
  ProjectResponse,
  ProjectTool,
} from '@asap-hub/model';
import Boom from '@hapi/boom';
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

  async update(id: string, tools: ProjectTool[]): Promise<ProjectResponse> {
    await this.projectDataProvider.update(id, { tools });
    return this.fetchById(id);
  }

  async fetchProjectMilestones(
    id: string,
    options: FetchProjectMilestonesOptions,
  ): Promise<ListProjectMilestonesResponse> {
    const { total, items } =
      await this.projectDataProvider.fetchProjectMilestones(id, options);
    return {
      total,
      items,
    };
  }

  async createMilestone(
    projectId: string,
    data: MilestoneCreateRequest,
  ): Promise<string> {
    const project = await this.fetchById(projectId);

    const hasSupplementGrant =
      'supplementGrant' in project && !!project.supplementGrant;

    if (hasSupplementGrant && data.grantType === 'original') {
      throw Boom.badRequest(
        'Cannot create milestones for Original grant when a Supplement grant exists',
      );
    }

    if (!hasSupplementGrant && data.grantType === 'supplement') {
      throw Boom.badRequest(
        'Cannot create milestones for Supplement grant when no Supplement grant exists',
      );
    }
    return this.projectDataProvider.createMilestone(data);
  }
}
