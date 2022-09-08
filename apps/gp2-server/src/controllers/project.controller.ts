import { NotFoundError } from '@asap-hub/errors';
import { gp2 } from '@asap-hub/model';
import { ProjectDataProvider } from '../data-providers/project.data-provider';

export interface ProjectController {
  fetchById(id: string): Promise<gp2.ProjectResponse>;
  fetch(): Promise<gp2.ListProjectResponse>;
}

export default class Projects implements ProjectController {
  constructor(private projectDataProvider: ProjectDataProvider) {}

  async fetch(): Promise<gp2.ListProjectResponse> {
    return this.projectDataProvider.fetch();
  }
  async fetchById(id: string): Promise<gp2.ProjectResponse> {
    const project = await this.projectDataProvider.fetchById(id);
    if (!project) {
      throw new NotFoundError(undefined, `project with id ${id} not found`);
    }

    return project;
  }
}
