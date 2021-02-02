import 'express-async-errors';
import cors from 'cors';
import express, { Express, RequestHandler } from 'express';
import { Tracer } from 'opentracing';

import { errorHandler } from './middleware/error-handler';
import { tracingHandlerFactory } from './middleware/tracing-handler';
import { authHandlerFactory, AuthHandler } from './middleware/auth-handler';
import { eventRouteFactory } from './routes/events.route';
import { groupRouteFactory } from './routes/groups.route';
import Groups, { GroupController } from './controllers/groups';
import decodeToken from './utils/validate-token';
import { teamRouteFactory } from './routes/teams.route';
import { userRouteFactory } from './routes/user.route';
import Teams, { TeamController } from './controllers/teams';
import Dashboard, { DashboardController } from './controllers/dashboard';
import { dashboardRouteFactory } from './routes/dashboard.route';

export const appFactory = (libs: Libs = {}): Express => {
  const app = express();

  const dashboardController = libs.dashboardController || new Dashboard();
  const groupController = libs.groupController || new Groups();
  const teamController = libs.teamController || new Teams();
  const authHandler = libs.authHandler || authHandlerFactory(decodeToken);
  const dashboardRoutes = dashboardRouteFactory(dashboardController);
  const eventRoutes = eventRouteFactory();
  const groupRoutes = groupRouteFactory(groupController);
  const teamRoutes = teamRouteFactory(groupController, teamController);
  const userRoutes = userRouteFactory(groupController);
  const tracingHandler = tracingHandlerFactory(libs.tracer);

  app.use(tracingHandler);
  app.use(cors());
  app.use(express.json());

  app.use(authHandler);

  if (libs.mockRequestHandlers) {
    app.use(libs.mockRequestHandlers);
  }

  app.use(dashboardRoutes);
  app.use(eventRoutes);
  app.use(groupRoutes);
  app.use(teamRoutes);
  app.use(userRoutes);

  app.get('*', async (_req, res) => {
    res.status(404).json({
      statusCode: 404,
      error: 'Not Found',
      message: 'Not Found',
    });
  });

  app.use(errorHandler);

  return app;
};

export type Libs = {
  dashboardController?: DashboardController;
  groupController?: GroupController;
  teamController?: TeamController;
  authHandler?: AuthHandler;
  tracer?: Tracer;
  // extra handlers only for tests and local development
  mockRequestHandlers?: RequestHandler[];
};
