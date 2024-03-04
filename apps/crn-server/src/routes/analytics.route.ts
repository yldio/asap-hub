import { validateFetchPaginationOptions } from '@asap-hub/server-common';
import { Router } from 'express';
import AnalyticsController from '../controllers/analytics.controller';

export const analyticsRouteFactory = (
  analyticsController: AnalyticsController,
): Router => {
  const analyticsRoutes = Router();

  analyticsRoutes.get('/team-leadership', async (req, res) => {
    const parameters = req.query;
    const query = validateFetchPaginationOptions(parameters);

    const result = await analyticsController.fetchTeamLeaderShip(query);

    res.json(result);
  });

  return Router().use('/analytics', analyticsRoutes);
};
