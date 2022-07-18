import { UserResponse } from '@asap-hub/model';
import {
  AuthHandler,
  authHandlerFactory,
  decodeTokenFactory,
  errorHandlerFactory,
  getHttpLogger,
  Logger,
  MemoryCacheClient,
} from '@asap-hub/server-common';
import {
  getAccessTokenFactory,
  RestUser,
  SquidexGraphql,
  SquidexRest,
} from '@asap-hub/squidex';
import cors from 'cors';
import express, { Express } from 'express';
import 'express-async-errors';
import {
  appName,
  auth0Audience,
  baseUrl,
  clientId,
  clientSecret,
} from './config';
import Dashboard, {
  DashboardController,
} from './controllers/dashboard.controller';
import Users, { UserController } from './controllers/user.controller';
import UserSquidexDataProvider, {
  UserDataProvider,
} from './data-providers/users.data-provider';
import { dashboardRouteFactory } from './routes/dashboard.route';
import { userPublicRouteFactory } from './routes/user.route';
import pinoLogger from './utils/logger';

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

  const userPublicRoutes = userPublicRouteFactory(userController);
  // Auth
  app.use(authHandler);

  /**
   * Routes requiring onboarding below
   */
  app.use(dashboardRoutes);
  app.use(userPublicRoutes);

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
