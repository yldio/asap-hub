import { NotFoundError } from '@asap-hub/errors';
import { gp2 } from '@asap-hub/model';
import { ProjectDataProvider } from '../data-providers/types/project.data-provider.type';
import { removeNotAllowedResources } from '../utils/resources';

export default class ProjectController {
  constructor(private projectDataProvider: ProjectDataProvider) {}

  async fetch(
    options: gp2.FetchProjectOptions,
    loggedInUserId: string,
  ): Promise<gp2.ListProjectResponse> {
    const projects = await this.projectDataProvider.fetch(options);
    return {
      ...projects,
      items: projects.items.map((project) =>
        removeNotAllowedResources(project, loggedInUserId),
      ),
    };
  }
  async fetchById(
    id: string,
    loggedInUserId?: string,
  ): Promise<gp2.ProjectResponse> {
    const project = await this.projectDataProvider.fetchById(id);
    if (!project) {
      throw new NotFoundError(undefined, `project with id ${id} not found`);
    }

    return removeNotAllowedResources(project, loggedInUserId);
  }
  async update(
    id: string,
    update: gp2.ProjectUpdateRequest,
    loggedInUserId: string,
  ): Promise<gp2.ProjectResponse> {
    await this.projectDataProvider.update(id, {
      ...update,
    });
    return this.fetchById(id, loggedInUserId);
  }
}
