import { Router } from 'express';
import AimController from '../controllers/aim.controller';

export const aimRouteFactory = (aimController: AimController): Router => {
  const aimRoutes = Router();

  aimRoutes.get('/aims/:aimId/articles', async (req, res) => {
    const { aimId } = req.params;
    const articles = await aimController.fetchArticles(aimId);
    res.json(articles);
  });

  return aimRoutes;
};
