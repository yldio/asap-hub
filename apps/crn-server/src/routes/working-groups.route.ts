import { validateFetchOptions } from '@asap-hub/server-common';
import { Router } from 'express';
import { WorkingGroupController } from '../controllers/working-groups';
import { validateWorkingGroupParameters } from '../validation/working-group.validation';

export const workingGroupRouteFactory = (
  workingGroupsController: WorkingGroupController,
): Router => {
  const workingGroupRoutes = Router();

  workingGroupRoutes.get<{ workingGroupId: string }>(
    '/working-groups/:workingGroupId',
    async (req, res) => {
      const { params } = req;
      const { workingGroupId } = validateWorkingGroupParameters(params);
      const result = await workingGroupsController.fetchById(workingGroupId);

      res.json(result);
    },
  );

  workingGroupRoutes.get('/working-groups', async (req, res) => {
    const { params } = req;

    const query = validateFetchOptions(params);

    const result = await workingGroupsController.fetch(query);

    res.json(result);
  });

  return workingGroupRoutes;
};
