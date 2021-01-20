import express, { Express } from 'express';
import { errorHandler } from './utils/error-handler';
import { eventRoutes } from './routes/events.route';

export const appFactory = (): Express => {
  const app = express();

  app.use(eventRoutes);
  app.use(errorHandler);

  return app;
};
