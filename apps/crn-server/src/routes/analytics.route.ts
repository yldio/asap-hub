import {
  ListAnalyticsTeamLeadershipResponse,
  ListTeamProductivityResponse,
  ListUserCollaborationResponse,
  ListUserProductivityResponse,
} from '@asap-hub/model';
import {
  validateFetchAnalyticsOptions,
  validateFetchPaginationOptions,
} from '@asap-hub/server-common';
import { Response, Router } from 'express';
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

  analyticsRoutes.get(
    '/productivity/user',
    async (req, res: Response<ListUserProductivityResponse>) => {
      const parameters = req.query;
      const query = validateFetchAnalyticsOptions(parameters);
      const result = await analyticsController.fetchUserProductivity(query);

      res.json(result);
    },
  );

  analyticsRoutes.get(
    '/productivity/team',
    async (req, res: Response<ListTeamProductivityResponse>) => {
      const parameters = req.query;
      const query = validateFetchAnalyticsOptions(parameters);

      const result = await analyticsController.fetchTeamProductivity(query);

      res.json(result);
    },
  );

  analyticsRoutes.get(
    '/collaboration/user',
    async (req, res: Response<ListUserCollaborationResponse>) => {
      const parameters = req.query;
      const query = validateFetchAnalyticsOptions(parameters);
      const result = await analyticsController.fetchUserCollaboration(query);

      res.json(result);
    },
  );

  return Router().use('/analytics', analyticsRoutes);
};
