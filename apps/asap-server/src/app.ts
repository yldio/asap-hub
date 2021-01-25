import 'express-async-errors';
import cors from 'cors';
import express, { Express, RequestHandler } from 'express';
import { errorHandler } from './middleware/error-handler';
import {
  authHandler as authHandlerLib,
  AuthHandler,
} from './middleware/authentication';
import { eventRouteFactory } from './routes/events.route';
import { groupRouteFactory } from './routes/groups.route';
import Groups, { GroupController } from './controllers/groups';

export const appFactory = (libs: Libs = {}): Express => {
  const app = express();

  const groupController = libs.groupController || new Groups();
  const authHandler = libs.authHandler || authHandlerLib;
  const eventRoutes = eventRouteFactory();
  const groupRoutes = groupRouteFactory(groupController);

  app.use(cors());
  app.use(authHandler);

  if (libs.mockRequestHandlers) {
    app.use(libs.mockRequestHandlers);
  }

  app.use(eventRoutes);
  app.use(groupRoutes);

  app.get('*', async (_req, res) => {
    res.status(404).json('Invalid route');
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
