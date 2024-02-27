import { Router } from 'express';
import AnalyticsController from '../controllers/analytics.controller';

export const analyticsRouteFactory = (
  analyticsController: AnalyticsController,
): Router => {
  const analyticsRoutes = Router();

  analyticsRoutes.get('/team-leadership', async (_req, res) => {
    const result = await analyticsController.fetchTeamLeaderShip();

    res.json(result);
  });

  return Router().use('/analytics', analyticsRoutes);
};
