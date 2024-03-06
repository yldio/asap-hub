import { ListAnalyticsTeamLeadershipResponse } from '@asap-hub/model';
import { validateFetchPaginationOptions } from '@asap-hub/server-common';
import { Router, Response } from 'express';
import AnalyticsController from '../controllers/analytics.controller';

export const analyticsRouteFactory = (
  analyticsController: AnalyticsController,
): Router => {
  const analyticsRoutes = Router();

  analyticsRoutes.get(
    '/team-leadership',
    async (req, res: Response<ListAnalyticsTeamLeadershipResponse>) => {
      const parameters = req.query;
      const query = validateFetchPaginationOptions(parameters);

      const result = await analyticsController.fetchTeamLeadership(query);

      res.json(result);
    },
  );

  return Router().use('/analytics', analyticsRoutes);
};
