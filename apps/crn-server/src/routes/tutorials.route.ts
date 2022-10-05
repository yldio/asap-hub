import { Router } from 'express';
import { TutorialsController } from '../controllers/tutorials';
import { validateNewsParameters } from '../validation/news.validation';

export const tutorialsRouteFactory = (
  tutorialsController: TutorialsController,
): Router => {
  const tutorialsRoutes = Router();

  tutorialsRoutes.get<{ tutorialsId: string }>(
    '/tutorials/:tutorialsId',
    async (req, res) => {
      const { params } = req;
      const { newsId } = validateNewsParameters(params);

      const result = await tutorialsController.fetchById(newsId);

      res.json(result);
    },
  );

  return tutorialsRoutes;
};
