import { validateFetchOptions } from '@asap-hub/server-common';
import { Router } from 'express';
import { LabsController } from '../controllers/labs';

export const labsRouteFactory = (labsController: LabsController): Router => {
  const labsRoutes = Router();

  labsRoutes.get('/labs', async (req, res) => {
    const options = validateFetchOptions(req.query);

    const result = await labsController.fetch(options);

    res.json(result);
  });

  return labsRoutes;
};
