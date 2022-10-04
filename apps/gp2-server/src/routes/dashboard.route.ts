import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';

export const dashboardRouteFactory = (
  dashboardController: DashboardController,
): Router => {
  const dashboardRoutes = Router();

  dashboardRoutes.get('/dashboard', async (_req, res) => {
    const dashboard = await dashboardController.fetch();

    res.json(dashboard);
  });

  return dashboardRoutes;
};
