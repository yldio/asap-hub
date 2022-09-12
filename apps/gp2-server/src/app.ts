import { gp2 } from '@asap-hub/model';
import {
  assignUserToContext,
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
import Projects, { ProjectController } from './controllers/project.controller';
import Users, { UserController } from './controllers/user.controller';
import WorkingGroups, {
  WorkingGroupController,
} from './controllers/working-group.controller';
import {
  ProjectDataProvider,
  ProjectSquidexDataProvider,
} from './data-providers/project.data-provider';
import {
  UserDataProvider,
  UserSquidexDataProvider,
} from './data-providers/user.data-provider';
import {
  WorkingGroupDataProvider,
  WorkingGroupSquidexDataProvider,
} from './data-providers/working-group.data-provider';
import { dashboardRouteFactory } from './routes/dashboard.route';
import { projectRouteFactory } from './routes/project.route';
import { userPublicRouteFactory } from './routes/user.route';
import { workingGroupRouteFactory } from './routes/working-group.route';
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
  const userResponseCacheClient = new MemoryCacheClient<gp2.UserResponse>();

  // Data Providers

  const userDataProvider =
    libs.userDataProvider ||
    new UserSquidexDataProvider(squidexGraphqlClient, userRestClient);
  const workingGroupDataProvider =
    libs.workingGroupDataProvider ||
    new WorkingGroupSquidexDataProvider(squidexGraphqlClient);
  const projectDataProvider =
    libs.projectDataProvider ||
    new ProjectSquidexDataProvider(squidexGraphqlClient);

  // Controllers
  const dashboardController =
    libs.dashboardController || new Dashboard(squidexGraphqlClient);

  const workingGroupController =
    libs.workingGroupController || new WorkingGroups(workingGroupDataProvider);
  const projectController =
    libs.projectController || new Projects(projectDataProvider);
  /**
   * Public routes --->
   */
  const userController = libs.userController || new Users(userDataProvider);

  // Handlers
  const authHandler =
    libs.authHandler ||
    authHandlerFactory<gp2.UserResponse>(
      decodeToken,
      userController.fetchByCode.bind(userController),
      userResponseCacheClient,
      logger,
      assignUserToContext,
    );

  // Routes
  const dashboardRoutes = dashboardRouteFactory(dashboardController);
  const userPublicRoutes = userPublicRouteFactory(userController);
  const workingGroupRoutes = workingGroupRouteFactory(workingGroupController);
  const projectRoutes = projectRouteFactory(projectController);

  app.use(userPublicRoutes);
  // Auth
  app.use(authHandler);

  /**
   * Routes requiring onboarding below
   */
  app.use(dashboardRoutes);
  app.use(workingGroupRoutes);
  app.use(projectRoutes);

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
  workingGroupDataProvider?: WorkingGroupDataProvider;
  projectDataProvider?: ProjectDataProvider;
  userController?: UserController;
  workingGroupController?: WorkingGroupController;
  projectController?: ProjectController;
  authHandler?: AuthHandler;
  logger?: Logger;
};
