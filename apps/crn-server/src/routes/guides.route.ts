import { Router } from 'express';
import { GuideController } from '../controllers/guides.controller';

export const guideRouteFactory = (guideController: GuideController): Router => {
  const guideRoutes = Router();

  guideRoutes.get<{ title: string }>('/guides/:title', async (_req, res) => {
    const title = _req.params.title;
    const result = await guideController.fetchByCollectionTitle(title);

    res.json(result);
  });

  return guideRoutes;
};
