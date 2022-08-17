import { Router } from 'express';
import type { gp2 } from '@asap-hub/model';
import { WorkingGroupController } from '../controllers/working-group.controller';

export const workingGroupRouteFactory = (
  workingGroupController: WorkingGroupController,
): Router => {
  const workingGroupRoutes = Router();

  workingGroupRoutes.get<unknown, gp2.ListWorkingGroupResponse>(
    '/working-groups',
    async (_req, res) => {
      const result = await workingGroupController.fetch();

      res.json(result);
    },
  );

  return workingGroupRoutes;
};
