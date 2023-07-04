import { Router } from 'express';
import GuideController from '../controllers/guide.controller';

export const guideRouteFactory = (guideController: GuideController): Router => {
  const guideRoutes = Router();

  guideRoutes.get('/guides', async (_req, res) => {
    const result = await guideController.fetch();

    res.json(result);
  });

  return guideRoutes;
};
