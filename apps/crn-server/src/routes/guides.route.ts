import { Router } from 'express';
import { GuideController} from '../controllers/guides';

export const guideRouteFactory = (
  guideController: GuideController,
): Router => {
  const guideRoutes = Router();

  guideRoutes.get('/guide', async (_req, res) => {
    const result = await guideController.fetch();

    res.json(result);
  });

  return guideRoutes;
};
