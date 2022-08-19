import type { gp2 } from '@asap-hub/model';
import { Router } from 'express';
import { WorkingGroupController } from '../controllers/working-group.controller';
import { validateWorkingGroupParameters } from '../validation/working-group.validation';

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

  workingGroupRoutes.get<{ workingGroupId: string }, gp2.WorkingGroupResponse>(
    '/working-group/:workingGroupId',
    async (req, res) => {
      const { params } = req;

      const { workingGroupId } = validateWorkingGroupParameters(params);
      const result = await workingGroupController.fetchById(workingGroupId);

      res.json(result);
    },
  );
  return workingGroupRoutes;
};
