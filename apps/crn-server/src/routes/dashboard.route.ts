import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard';

export const dashboardRouteFactory = (
  dashboardController: DashboardController,
): Router => {
  const dashboardRoutes = Router();

  dashboardRoutes.get('/dashboard', async (_req, res) => {
    const result = await dashboardController.fetch();

    res.json(result);
  });

  return dashboardRoutes;
};
