import { gp2 } from '@asap-hub/model';
import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';

export const dashboardRouteFactory = (
  dashboardController: DashboardController,
): Router => {
  const dashboardRoutes = Router();

  dashboardRoutes.get<unknown, gp2.ListDashboardResponse>(
    '/dashboard',
    async (_req, res) => {
      const dashboard = await dashboardController.fetch({});

      res.json(dashboard);
    },
  );

  return dashboardRoutes;
};
