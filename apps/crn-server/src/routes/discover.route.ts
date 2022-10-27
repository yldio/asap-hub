import { DiscoverResponse } from '@asap-hub/model';
import { Router } from 'express';
import { DiscoverController } from '../controllers/discover';

export const discoverRouteFactory = (
  discoverController: DiscoverController,
): Router => {
  const discoverRoutes = Router();

  discoverRoutes.get<unknown, DiscoverResponse>(
    '/discover',
    async (_req, res) => {
      const result = await discoverController.fetch();

      res.json(result);
    },
  );

  return discoverRoutes;
};
