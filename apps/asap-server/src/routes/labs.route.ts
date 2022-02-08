import { Router } from 'express';
import { LabsController } from '../controllers/labs';

export const labsRouteFactory = (labsController: LabsController): Router => {
  const labsRoutes = Router();

  labsRoutes.get('/labs', async (_req, res) => {
    const result = await labsController.fetch();

    res.json(result);
  });

  return labsRoutes;
};
