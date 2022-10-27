import { NotFoundError } from '@asap-hub/errors';
import { gp2 } from '@asap-hub/model';
import { ProjectDataProvider } from '../data-providers/project.data-provider';
import { removeNotAllowedResources } from '../utils/resources';

export interface ProjectController {
  fetchById(id: string, loggedInUserId: string): Promise<gp2.ProjectResponse>;
  fetch(loggedInUserId: string): Promise<gp2.ListProjectResponse>;
}

export default class Projects implements ProjectController {
  constructor(private projectDataProvider: ProjectDataProvider) {}

  async fetch(loggedInUserId: string): Promise<gp2.ListProjectResponse> {
    const projects = await this.projectDataProvider.fetch();
    return {
      ...projects,
      items: projects.items.map((project) =>
        removeNotAllowedResources(project, loggedInUserId),
      ),
    };
  }
  async fetchById(
    id: string,
    loggedInUserId: string,
  ): Promise<gp2.ProjectResponse> {
    const project = await this.projectDataProvider.fetchById(id);
    if (!project) {
      throw new NotFoundError(undefined, `project with id ${id} not found`);
    }

    return removeNotAllowedResources(project, loggedInUserId);
  }
}
