import { Router } from 'express';
import { DiscoverController } from '../controllers/discover';

export const discoverRouteFactory = (
  discoverController: DiscoverController,
): Router => {
  const discoverRoutes = Router();

  discoverRoutes.get('/discover', async (_req, res) => {
    const result = await discoverController.fetch();

    res.json(result);
  });

  return discoverRoutes;
};
