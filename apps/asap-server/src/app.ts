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

export const appFactory = (libs: Libs = {}): Express => {
  const app = express();

  const groupController = libs.groupController || new Groups();
  const teamController = libs.teamController || new Teams();
  const authHandler = libs.authHandler || authHandlerFactory(decodeToken);
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

  app.use(eventRoutes);
  app.use(groupRoutes);
  app.use(teamRoutes);
  app.use(userRoutes);

  app.get('*', async (_req, res) => {
    res.status(404).json('Invalid route');
  });

  app.use(errorHandler);

  return app;
};

export type Libs = {
  groupController?: GroupController;
  teamController?: TeamController;
  authHandler?: AuthHandler;
  tracer?: Tracer;
  // extra handlers only for tests and local development
  mockRequestHandlers?: RequestHandler[];
};
