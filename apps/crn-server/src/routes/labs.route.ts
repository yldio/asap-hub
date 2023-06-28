import { validateFetchOptions } from '@asap-hub/server-common';
import { Router } from 'express';
import LabController from '../controllers/labs.controller';

export const labsRouteFactory = (labsController: LabController): Router => {
  const labsRoutes = Router();

  labsRoutes.get('/labs', async (req, res) => {
    const options = validateFetchOptions(req.query);

    const result = await labsController.fetch(options);

    res.json(result);
  });

  return labsRoutes;
};
