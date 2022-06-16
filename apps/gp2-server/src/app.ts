import 'express-async-errors';
import cors from 'cors';
import express, { Express } from 'express';
import { SquidexGraphql, getAccessTokenFactory } from '@asap-hub/squidex';
import {
  AuthHandler,
  authHandlerFactory,
  decodeTokenFactory,
  errorHandlerFactory,
  getHttpLogger,
  Logger,
} from '@asap-hub/server-common';
import Dashboard, {
  DashboardController,
} from './controllers/dashboard.controller';
import { dashboardRouteFactory } from './routes/dashboard.route';
import pinoLogger from './utils/logger';
import {
  origin,
  auth0ClientId,
  clientId,
  clientSecret,
  baseUrl,
  appName,
} from './config';

export const appFactory = (libs: Libs = {}): Express => {
  const app = express();

  // Libs
  const logger = libs.logger || pinoLogger;

  // Middleware
  app.use(getHttpLogger({ logger }));
  app.use(cors());

  const errorHandler = errorHandlerFactory();

  // Clients
  const getAuthToken = getAccessTokenFactory({
    clientId,
    clientSecret,
    baseUrl,
  });
  const squidexGraphqlClient = new SquidexGraphql(getAuthToken, {
    appName,
    baseUrl,
  });
  const decodeToken = decodeTokenFactory(auth0ClientId);

  // Controllers
  const dashboardController =
    libs.dashboardController || new Dashboard(squidexGraphqlClient);

  // Handlers
  const authHandler =
    libs.authHandler || authHandlerFactory(decodeToken, logger, { origin });

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
