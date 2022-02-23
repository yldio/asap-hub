import { framework } from '@asap-hub/services-common';
import { Router } from 'express';
import { LabsController } from '../controllers/labs';
import { querySchema } from './teams.route';
import { FetchOptions } from '../utils/types';

export const labsRouteFactory = (labsController: LabsController): Router => {
  const labsRoutes = Router();

  labsRoutes.get('/labs', async (req, res) => {
    const options = framework.validate(
      'query',
      req.query,
      querySchema,
    ) as unknown as FetchOptions;

    const result = await labsController.fetch(options);

    res.json(result);
  });

  return labsRoutes;
};
