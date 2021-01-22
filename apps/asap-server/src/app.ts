import 'express-async-errors';
import cors from 'cors';
import express, { Express, RequestHandler } from 'express';
import { errorHandler } from './utils/error-handler';
import { eventRoutes } from './routes/events.route';

export const appFactory = (requestHandlers?: RequestHandler[]): Express => {
  const app = express();

  app.use(cors());

  if (requestHandlers) {
    app.use(requestHandlers);
  }

  app.use(eventRoutes);

  app.get('*', async (_req, res) => {
    res.status(404).json('Invalid route');
  });

  app.use(errorHandler);

  return app;
};
