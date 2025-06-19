import { validateFetchOptions } from '@asap-hub/server-common';
import { Router } from 'express';
import ImpactController from '../controllers/impact.controller';

export const impactRouteFactory = (
  impactController: ImpactController,
): Router => {
  const impactRoutes = Router();

  impactRoutes.get('/impact', async (req, res) => {
    const { query } = req;

    const options = validateFetchOptions(query);

    const result = await impactController.fetch(options);

    res.json(result);
  });

  return impactRoutes;
};
