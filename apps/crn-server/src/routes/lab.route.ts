import { validateFetchOptions } from '@asap-hub/server-common';
import { Router } from 'express';
import LabController from '../controllers/lab.controller';

export const labRouteFactory = (labController: LabController): Router => {
  const labsRoutes = Router();

  labsRoutes.get('/labs', async (req, res) => {
    const options = validateFetchOptions(req.query);

    const result = await labController.fetch(options);

    res.json(result);
  });

  return labsRoutes;
};
