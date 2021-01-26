import 'express-async-errors';
import cors from 'cors';
import express, { Express, RequestHandler } from 'express';
import { errorHandler } from './middleware/error-handler';
import { authHandlerFactory, AuthHandler } from './middleware/auth-handler';
import { eventRouteFactory } from './routes/events.route';
import { groupRouteFactory } from './routes/groups.route';
import Groups, { GroupController } from './controllers/groups';
import decodeToken from './utils/validate-token';
import { teamRouteFactory } from './routes/teams.route';

export const appFactory = (libs: Libs = {}): Express => {
  const app = express();

  const groupController = libs.groupController || new Groups();
  const authHandler = libs.authHandler || authHandlerFactory(decodeToken);
  const eventRoutes = eventRouteFactory();
  const groupRoutes = groupRouteFactory(groupController);
  const teamRoutes = teamRouteFactory(groupController);

  app.use(cors());
  app.use(authHandler);

  if (libs.mockRequestHandlers) {
    app.use(libs.mockRequestHandlers);
  }

  app.use(eventRoutes);
  app.use(groupRoutes);
  app.use(teamRoutes);

  app.get('*', async (_req, res) => {
    res.status(404).json({
      message: 'Not Found',
    });
  });

  app.use(errorHandler);

  return app;
};

export type Libs = {
  groupController?: GroupController;
  authHandler?: AuthHandler;
  // extra handlers only for tests and local development
  mockRequestHandlers?: RequestHandler[];
};
