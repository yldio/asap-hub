import 'express-async-errors';
import cors from 'cors';
import { Logger } from 'pino';
import pinoHttp from 'pino-http';
import express, { Express } from 'express';
import { SquidexGraphql } from '@asap-hub/squidex';
import { decodeToken } from '@asap-hub/server-common';
import Dashboard, {
  DashboardController,
} from './controllers/dashboard.controller';
import { dashboardRouteFactory } from './routes/dashboard.route';
import { AuthHandler, authHandlerFactory } from './middleware/auth-handler';
import { errorHandlerFactory } from './middleware/error-handler';
import pinoLogger, { redaction } from './utils/logger';

export const appFactory = (libs: Libs = {}): Express => {
  const app = express();

  // Libs
  const logger = libs.logger || pinoLogger;

  // Middleware
  const httpLogger = pinoHttp({
    logger,
    serializers: redaction,
  });
  app.use(httpLogger);
  app.use(cors());

  const errorHandler = errorHandlerFactory();

  // Clients
  const squidexGraphqlClient = new SquidexGraphql();

  // Controllers
  const dashboardController =
    libs.dashboardController || new Dashboard(squidexGraphqlClient);

  // Handlers
  const authHandler = libs.authHandler || authHandlerFactory(decodeToken);

  // Routes
  const dashboardRoutes = dashboardRouteFactory(dashboardController);

  // Auth
  app.use(authHandler);

  /**
   * Routes requiring onboarding below
   */
  app.use(dashboardRoutes);

  // Catch all
  app.get('*', async (_req, res) => {
    res.status(404).json({
      statusCode: 404,
      error: 'Not Found',
      message: 'Not Found',
    });
  });

  app.use(errorHandler);
  app.disable('x-powered-by');

  return app;
};

export type Libs = {
  dashboardController?: DashboardController;
  authHandler?: AuthHandler;
  logger?: Logger;
};
