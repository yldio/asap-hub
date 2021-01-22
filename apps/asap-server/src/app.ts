import 'express-async-errors';
import cors from 'cors';
import express, { Express, RequestHandler } from 'express';
import { errorHandler } from './utils/error-handler';
import { eventRouteFactory } from './routes/events.route';
import { groupRouteFactory } from './routes/groups.route';
import Groups, { GroupController } from './controllers/groups';

export const appFactory = (libs: Libs = {}): Express => {
  const app = express();

  const groupController = libs.groupController || new Groups();
  const eventRoutes = eventRouteFactory();
  const groupRoutes = groupRouteFactory(groupController);

  app.use(cors());

  if (libs.requestHandlers) {
    app.use(libs.requestHandlers);
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
  requestHandlers?: RequestHandler[]
};
