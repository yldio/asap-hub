import { NotFoundError } from '@asap-hub/errors';
import {
  FetchPaginationOptions,
  FetchProjectsFilter,
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

  async createMilestone(
    projectId: string,
    data: MilestoneCreateRequest,
  ): Promise<string> {
    const project = await this.fetchById(projectId);

    const hasSupplementGrant =
      'supplementGrant' in project && !!project.supplementGrant;

    if (hasSupplementGrant && data.grantType === 'original') {
      throw Boom.forbidden(
        'Cannot create milestones for Original grant when a Supplement grant exists',
      );
    }

    if (!hasSupplementGrant && data.grantType === 'supplement') {
      throw Boom.badRequest(
        'Cannot create milestones for Supplement grant when no Supplement grant exists',
      );
    }

    // TODO: Validate that aimIds belong to the correct grant type on the project.
    // Currently ProjectResponse does not expose aims data (only ProjectDetail does).
    // Out of scope for initial implementation — the frontend already filters aims
    // by grant type, so invalid aimIds would only come from direct API calls.

    const { grantType: _grantType, ...milestoneData } = data;
    return this.projectDataProvider.createMilestone(milestoneData);
  }
}
