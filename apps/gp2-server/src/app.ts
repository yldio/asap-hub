import 'express-async-errors';
import cors from 'cors';
import express, { Express } from 'express';
import {
  SquidexGraphql,
  getAccessTokenFactory,
  SquidexRest,
  RestUser,
} from '@asap-hub/squidex';
import {
  AuthHandler,
  authHandlerFactory,
  decodeTokenFactory,
  errorHandlerFactory,
  getHttpLogger,
  Logger,
  MemoryCacheClient,
} from '@asap-hub/server-common';
import { UserResponse } from '@asap-hub/model';
import Dashboard, {
  DashboardController,
} from './controllers/dashboard.controller';
import { dashboardRouteFactory } from './routes/dashboard.route';
import pinoLogger from './utils/logger';
import {
  auth0Audience,
  clientId,
  clientSecret,
  baseUrl,
  appName,
} from './config';
import Users, { UserController } from './controllers/user.controller';
import {
  UserDataProvider,
  UserSquidexDataProvider,
} from './data-providers/users.data-provider';

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
  const userRestClient = new SquidexRest<RestUser>(getAuthToken, 'users', {
    appName,
    baseUrl,
  });
  const decodeToken = decodeTokenFactory(auth0Audience);
  const userResponseCacheClient = new MemoryCacheClient<UserResponse>();

  // Data Providers
  const userDataProvider =
    libs.userDataProvider ||
    new UserSquidexDataProvider(squidexGraphqlClient, userRestClient);

  // Controllers
  const dashboardController =
    libs.dashboardController || new Dashboard(squidexGraphqlClient);
  const userController = libs.userController || new Users(userDataProvider);

  // Handlers
  const authHandler =
    libs.authHandler ||
    authHandlerFactory(
      decodeToken,
      userController.fetchByCode.bind(userController),
      userResponseCacheClient,
      logger,
    );

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
  userDataProvider?: UserDataProvider;
  dashboardController?: DashboardController;
  userController?: UserController;
  authHandler?: AuthHandler;
  logger?: Logger;
};
