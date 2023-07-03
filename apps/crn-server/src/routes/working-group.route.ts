import { validateFetchOptions } from '@asap-hub/server-common';
import { Router } from 'express';
import WorkingGroupController from '../controllers/working-group.controller';
import { validateWorkingGroupParameters } from '../validation/working-group.validation';

export const workingGroupRouteFactory = (
  workingGroupController: WorkingGroupController,
): Router => {
  const workingGroupRoutes = Router();

  workingGroupRoutes.get<{ workingGroupId: string }>(
    '/working-groups/:workingGroupId',
    async (req, res) => {
      const { params } = req;
      const { workingGroupId } = validateWorkingGroupParameters(params);
      const result = await workingGroupController.fetchById(workingGroupId);

      res.json(result);
    },
  );

  workingGroupRoutes.get('/working-groups', async (req, res) => {
    const { query } = req;
    const options = validateFetchOptions(query);
    const result = await workingGroupController.fetch(options);

    res.json(result);
  });

  return workingGroupRoutes;
};
