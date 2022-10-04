import type { gp2 } from '@asap-hub/model';
import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller';
import { validateProjectParameters } from '../validation/project.validation';

export const projectRouteFactory = (
  projectController: ProjectController,
): Router => {
  const projectRoutes = Router();

  projectRoutes.get<unknown, gp2.ListProjectResponse>(
    '/projects',
    async (_req, res) => {
      const projects = await projectController.fetch();

      res.json(projects);
    },
  );

  projectRoutes.get<{ ProjectId: string }, gp2.ProjectResponse>(
    '/project/:projectId',
    async (req, res) => {
      const { params } = req;

      const { projectId } = validateProjectParameters(params);
      const project = await projectController.fetchById(projectId);

      res.json(project);
    },
  );
  return projectRoutes;
};
