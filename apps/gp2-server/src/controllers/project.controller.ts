import { NotFoundError } from '@asap-hub/errors';
import { gp2 } from '@asap-hub/model';
import { ProjectDataProvider } from '../data-providers/types/project.data-provider.type';
import { removeNotAllowedResources } from '../utils/resources';

const processProject = (
  project: gp2.ProjectDataObject,
  loggedInUserId?: string,
): gp2.ProjectResponse => ({
  ...removeNotAllowedResources(project, loggedInUserId),
  _tags: project.opportunitiesLink ? [gp2.opportunitiesAvailable] : [],
});

export type FetchOptions = Omit<gp2.FetchProjectOptions, 'filter'>;
export default class ProjectController {
  constructor(private projectDataProvider: ProjectDataProvider) {}

  async fetch(
    options: FetchOptions,
    loggedInUserId?: string,
  ): Promise<gp2.ListProjectResponse> {
    const projects = await this.projectDataProvider.fetch(options);
    return {
      ...projects,
      items: projects.items.map((project) =>
        processProject(project, loggedInUserId),
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

    return processProject(project, loggedInUserId);
  }
  async update(
    id: string,
    update: gp2.ProjectUpdateRequest,
    loggedInUserId?: string,
  ): Promise<gp2.ProjectResponse> {
    await this.projectDataProvider.update(id, {
      ...update,
    });
    return this.fetchById(id, loggedInUserId);
  }
}
