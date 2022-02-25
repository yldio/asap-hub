import { Router } from 'express';
import { LabsController } from '../controllers/labs';
import { validateFetchOptions } from '../validation';

export const labsRouteFactory = (labsController: LabsController): Router => {
  const labsRoutes = Router();

  labsRoutes.get('/labs', async (req, res) => {
    const options = validateFetchOptions(req.query);

    const result = await labsController.fetch(options);

    res.json(result);
  });

  return labsRoutes;
};
