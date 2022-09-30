import type { gp2 } from '@asap-hub/model';
import { Router } from 'express';
import { WorkingGroupNetworkController } from '../controllers/working-group-network.controller';

export const workingGroupNetworkRouteFactory = (
  workingGroupNetworkController: WorkingGroupNetworkController,
): Router => {
  const workingGroupNetworkRoutes = Router();

  workingGroupNetworkRoutes.get<unknown, gp2.ListWorkingGroupNetworkResponse>(
    '/working-group-network',
    async (_req, res) => {
      const workingGroupNetwork = await workingGroupNetworkController.fetch();

      res.json(workingGroupNetwork);
    },
  );

  return workingGroupNetworkRoutes;
};
