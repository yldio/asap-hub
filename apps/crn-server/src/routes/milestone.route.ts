import Boom from '@hapi/boom';
import { Router } from 'express';
import MilestoneController from '../controllers/milestone.controller';

export const milestoneRouteFactory = (
  milestoneController: MilestoneController,
): Router => {
  const milestoneRoutes = Router();

  milestoneRoutes.get('/milestones/:milestoneId/articles', async (req, res) => {
    const { milestoneId } = req.params;
    const { loggedInUser } = req;

    if (!loggedInUser) throw Boom.forbidden();

    const articles = await milestoneController.fetchArticles(milestoneId);
    res.json(articles);
  });

  return milestoneRoutes;
};
