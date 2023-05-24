import type { gp2 } from '@asap-hub/model';
import Boom from '@hapi/boom';
import { Router } from 'express';
import { isContentfulEnabled } from '../config';
import { ProjectController } from '../controllers/project.controller';
import {
  validateFetchProjectsParameters,
  validateProjectParameters,
  validateProjectPutRequest,
} from '../validation/project.validation';

export const projectRouteFactory = (
  projectController: ProjectController,
): Router => {
  const projectRoutes = Router();

  projectRoutes.get<unknown, gp2.ListProjectResponse>(
    '/projects',
    async (req, res) => {
      if (isContentfulEnabled) {
        res.json({
          total: 0,
          items: [],
        });
      } else {
        const query = validateFetchProjectsParameters(req.query);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const loggedInUserId = req.loggedInUser!.id;
        const projects = await projectController.fetch(query, loggedInUserId);

        res.json(projects);
      }
    },
  );

  projectRoutes.get<{ projectId: string }, gp2.ProjectResponse>(
    '/project/:projectId',
    async (req, res) => {
      const { params } = req;

      const { projectId } = validateProjectParameters(params);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const loggedInUserId = req.loggedInUser!.id;
      const project = await projectController.fetchById(
        projectId,
        loggedInUserId,
      );

      res.json(project);
    },
  );
  projectRoutes.put<{ projectId: string }, gp2.ProjectResponse>(
    '/project/:projectId/resources',
    async (req, res) => {
      const { params, body } = req;

      const { projectId } = validateProjectParameters(params);
      const resources = validateProjectPutRequest(body);

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const { id: loggedInUserId, role } = req.loggedInUser!;
      const { members } = await projectController.fetchById(
        projectId,
        loggedInUserId,
      );
      if (
        !(
          role === 'Administrator' &&
          members.some(({ userId }) => userId === loggedInUserId)
        )
      ) {
        throw Boom.forbidden();
      }

      const project = await projectController.update(
        projectId,
        { resources },
        loggedInUserId,
      );

      res.json(project);
    },
  );
  return projectRoutes;
};
