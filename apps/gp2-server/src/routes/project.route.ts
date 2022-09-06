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
      const result = await projectController.fetch();

      res.json(result);
    },
  );

  projectRoutes.get<{ ProjectId: string }, gp2.ProjectResponse>(
    '/project/:projectId',
    async (req, res) => {
      const { params } = req;

      const { projectId } = validateProjectParameters(params);
      const result = await projectController.fetchById(projectId);

      res.json(result);
    },
  );
  return projectRoutes;
};
