import { gp2 } from '@asap-hub/model';
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
  gp2 as gp2Squidex,
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
import WorkingGroupNetwork, {
  WorkingGroupNetworkController,
} from './controllers/working-group-network.controller';
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
  WorkingGroupNetworkDataProvider,
  WorkingGroupNetworkSquidexDataProvider,
} from './data-providers/working-group-network.data-provider';
import {
  WorkingGroupDataProvider,
  WorkingGroupSquidexDataProvider,
} from './data-providers/working-group.data-provider';
import { dashboardRouteFactory } from './routes/dashboard.route';
import { projectRouteFactory } from './routes/project.route';
import { userPublicRouteFactory, userRouteFactory } from './routes/user.route';
import { workingGroupNetworkRouteFactory } from './routes/working-group-network.route';
import { workingGroupRouteFactory } from './routes/working-group.route';
import assignUserToContext from './utils/assign-user-to-context';
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

  const userRestClient = new SquidexRest<
    gp2squidex.RestUser,
    gp2squidex.InputUser
  >(getAuthToken, 'users', {
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
  const workingGroupNetworkDataProvider =
    libs.workingGroupNetworkDataProvider ||
    new WorkingGroupNetworkSquidexDataProvider(squidexGraphqlClient);
  const projectDataProvider =
    libs.projectDataProvider ||
    new ProjectSquidexDataProvider(squidexGraphqlClient);

  // Controllers
  const dashboardController =
    libs.dashboardController || new Dashboard(squidexGraphqlClient);

  const workingGroupController =
    libs.workingGroupController || new WorkingGroups(workingGroupDataProvider);
  const workingGroupNetworkController =
    libs.workingGroupNetworkController ||
    new WorkingGroupNetwork(workingGroupNetworkDataProvider);
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
  const userRoutes = userRouteFactory(userController);
  const workingGroupRoutes = workingGroupRouteFactory(workingGroupController);
  const workingGroupNetworkRoutes = workingGroupNetworkRouteFactory(
    workingGroupNetworkController,
  );
  const projectRoutes = projectRouteFactory(projectController);

  app.use(userPublicRoutes);
  // Auth
  app.use(authHandler);

  /**
   * Routes requiring onboarding below
   */
  app.use(userRoutes);
  app.use(dashboardRoutes);
  app.use(workingGroupRoutes);
  app.use(workingGroupNetworkRoutes);
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
  workingGroupNetworkDataProvider?: WorkingGroupNetworkDataProvider;
  projectDataProvider?: ProjectDataProvider;
  userController?: UserController;
  workingGroupController?: WorkingGroupController;
  workingGroupNetworkController?: WorkingGroupNetworkController;
  projectController?: ProjectController;
  authHandler?: AuthHandler;
  logger?: Logger;
};
