import { getGraphQLClient as getContentfulGraphQLClient } from '@asap-hub/contentful';
import { gp2 } from '@asap-hub/model';
import {
  AuthHandler,
  authHandlerFactory,
  decodeTokenFactory,
  errorHandlerFactory,
  getHttpLogger,
  Logger,
  MemoryCacheClient,
  permissionHandler,
  sentryTransactionIdMiddleware,
  shouldHandleError,
} from '@asap-hub/server-common';
import * as Sentry from '@sentry/serverless';
import cors from 'cors';
import express, { Express, RequestHandler } from 'express';
import 'express-async-errors';
import {
  auth0Audience,
  contentfulAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
} from './config';
import Calendars from './controllers/calendar.controller';
import ContributingCohortController from './controllers/contributing-cohort.controller';
import DashboardController from './controllers/dashboard.controller';
import Events from './controllers/event.controller';
import ExternalUserController from './controllers/external-user.controller';
import NewsController from './controllers/news.controller';
import OutputController from './controllers/output.controller';
import PageController from './controllers/page.controller';
import ProjectController from './controllers/project.controller';
import UserController from './controllers/user.controller';
import WorkingGroupNetworkController from './controllers/working-group-network.controller';
import WorkingGroupController from './controllers/working-group.controller';
import { AssetContentfulDataProvider } from './data-providers/asset.data-provider';
import { ContributingCohortContentfulDataProvider } from './data-providers/contributing-cohort.data-provider';
import { DashboardContentfulDataProvider } from './data-providers/dashboard.data-provider';
import { ExternalUserContentfulDataProvider } from './data-providers/external-user.data-provider';
import { NewsContentfulDataProvider } from './data-providers/news.data-provider';
import { OutputContentfulDataProvider } from './data-providers/output.data-provider';
import { PageContentfulDataProvider } from './data-providers/page.data-provider';
import { ProjectContentfulDataProvider } from './data-providers/project.data-provider';
import {
  AssetDataProvider,
  ContributingCohortDataProvider,
  DashboardDataProvider,
  NewsDataProvider,
  OutputDataProvider,
  PageDataProvider,
  UserDataProvider,
  WorkingGroupNetworkDataProvider,
} from './data-providers/types';
import { ExternalUserDataProvider } from './data-providers/types/external-user.data-provider.type';
import { ProjectDataProvider } from './data-providers/types/project.data-provider.type';
import { WorkingGroupDataProvider } from './data-providers/types/working-group.data-provider.type';
import { WorkingGroupNetworkContentfulDataProvider } from './data-providers/working-group-network.data-provider';
import { WorkingGroupContentfulDataProvider } from './data-providers/working-group.data-provider';
import { getCalendarDataProvider } from './dependencies/calendar.dependency';
import { getContentfulRestClientFactory } from './dependencies/clients.dependency';
import { getEventDataProvider } from './dependencies/event.dependency';
import { getUserDataProvider } from './dependencies/user.dependency';
import { calendarRouteFactory } from './routes/calendar.route';
import { contributingCohortRouteFactory } from './routes/contributing-cohort.route';
import { dashboardRouteFactory } from './routes/dashboard.route';
import { eventRouteFactory } from './routes/event.route';
import { externalUserRouteFactory } from './routes/external-user.route';
import { newsRouteFactory } from './routes/news.route';
import { outputRouteFactory } from './routes/output.route';
import { pageRouteFactory } from './routes/page.route';
import { projectRouteFactory } from './routes/project.route';
import { userPublicRouteFactory, userRouteFactory } from './routes/user.route';
import { workingGroupNetworkRouteFactory } from './routes/working-group-network.route';
import { workingGroupRouteFactory } from './routes/working-group.route';
import assignUserToContext from './utils/assign-user-to-context';
import pinoLogger from './utils/logger';

export const appFactory = (libs: Libs = {}): Express => {
  const app = express();

  const contentfulGraphQLClient = getContentfulGraphQLClient({
    space: contentfulSpaceId,
    accessToken: contentfulAccessToken,
    environment: contentfulEnvId,
  });

  // Libs
  const logger = libs.logger || pinoLogger;

  // Middleware

  const errorHandler = errorHandlerFactory();

  // Clients
  const decodeToken = decodeTokenFactory(auth0Audience);
  const userResponseCacheClient = new MemoryCacheClient<gp2.UserResponse>();

  // Data Providers
  const assetContentfulDataProvider =
    libs.assetContentfulDataProvider ||
    new AssetContentfulDataProvider(getContentfulRestClientFactory);
  const contributingCohortContentfulDataProvider =
    libs.contributingCohortContentfulDataProvider ||
    new ContributingCohortContentfulDataProvider(
      contentfulGraphQLClient,
      getContentfulRestClientFactory,
    );
  const userContentfulDataProvider =
    libs.userContentfulDataProvider ||
    getUserDataProvider(contentfulGraphQLClient);

  const dashboardContentfulDataProvider =
    libs.dashboardContentfulDataProvider ||
    new DashboardContentfulDataProvider(contentfulGraphQLClient);
  const workingGroupContentfulDataProvider =
    libs.workingGroupContentfulDataProvider ||
    new WorkingGroupContentfulDataProvider(
      contentfulGraphQLClient,
      getContentfulRestClientFactory,
    );
  const workingGroupNetworkContentfulDataProvider =
    libs.workingGroupNetworkContentfulDataProvider ||
    new WorkingGroupNetworkContentfulDataProvider(contentfulGraphQLClient);
  const projectContentfulDataProvider =
    libs.projectContentfulDataProvider ||
    new ProjectContentfulDataProvider(
      contentfulGraphQLClient,
      getContentfulRestClientFactory,
    );
  const calendarContentfulDataProvider =
    libs.calendarContentfulDataProvider ||
    getCalendarDataProvider(contentfulGraphQLClient);

  const eventContentfulDataProvider =
    libs.eventContentfulDataProvider ||
    getEventDataProvider(contentfulGraphQLClient);

  const outputContentfulDataProvider =
    libs.outputContentfulDataProvider ||
    new OutputContentfulDataProvider(
      contentfulGraphQLClient,
      getContentfulRestClientFactory,
    );

  const externalUserContentfulDataProvider =
    libs.externalUserContentfulDataProvider ||
    new ExternalUserContentfulDataProvider(
      contentfulGraphQLClient,
      getContentfulRestClientFactory,
    );
  const pageContentfulDataProvider =
    libs.pageContentfulDataProvider ||
    new PageContentfulDataProvider(contentfulGraphQLClient);

  const assetDataProvider =
    libs.assetDataProvider || assetContentfulDataProvider;
  const pageDataProvider = libs.pageDataProvider || pageContentfulDataProvider;

  const newsDataProvider =
    libs.newsDataProvider ||
    new NewsContentfulDataProvider(contentfulGraphQLClient);
  const userDataProvider = libs.userDataProvider || userContentfulDataProvider;
  const contributingCohortDataProvider =
    libs.contributingCohortDataProvider ||
    contributingCohortContentfulDataProvider;
  const externalUserDataProvider =
    libs.externalUserDataProvider || externalUserContentfulDataProvider;
  const projectDataProvider =
    libs.projectDataProvider || projectContentfulDataProvider;
  const workingGroupDataProvider =
    libs.workingGroupDataProvider || workingGroupContentfulDataProvider;
  const workingGroupNetworkDataProvider =
    libs.workingGroupNetworkDataProvider ||
    workingGroupNetworkContentfulDataProvider;
  const eventDataProvider =
    libs.eventDataProvider || eventContentfulDataProvider;
  const calendarDataProvider =
    libs.calendarDataProvider || calendarContentfulDataProvider;
  const outputDataProvider =
    libs.outputDataProvider || outputContentfulDataProvider;

  // Controllers

  const workingGroupController =
    libs.workingGroupController ||
    new WorkingGroupController(workingGroupDataProvider);
  const workingGroupNetworkController =
    libs.workingGroupNetworkController ||
    new WorkingGroupNetworkController(workingGroupNetworkDataProvider);
  const projectController =
    libs.projectController || new ProjectController(projectDataProvider);
  const dashboardController =
    libs.dashboardController ||
    new DashboardController(dashboardContentfulDataProvider);
  const newsController =
    libs.newsController || new NewsController(newsDataProvider);
  const pageController =
    libs.pageController || new PageController(pageDataProvider);
  const eventController = libs.eventController || new Events(eventDataProvider);
  const externalUserController =
    libs.externalUserController ||
    new ExternalUserController(externalUserDataProvider);
  const calendarController =
    libs.calendarController || new Calendars(calendarDataProvider);
  const outputController =
    libs.outputController ||
    new OutputController(outputDataProvider, externalUserDataProvider);
  const contributingCohortController =
    libs.contributingCohortController ||
    new ContributingCohortController(contributingCohortDataProvider);

  /**
   * Public routes --->
   */
  const userController =
    libs.userController ||
    new UserController(userDataProvider, assetDataProvider);

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
  const sentryTransactionIdHandler =
    libs.sentryTransactionIdHandler || sentryTransactionIdMiddleware;

  // Routes
  const userPublicRoutes = userPublicRouteFactory(userController);
  const userRoutes = userRouteFactory(userController);
  const newsRoutes = newsRouteFactory(newsController);
  const dashboardRoutes = dashboardRouteFactory(dashboardController);
  const pageRoutes = pageRouteFactory(pageController);
  const contributingCohortRoutes = contributingCohortRouteFactory(
    contributingCohortController,
  );
  const workingGroupRoutes = workingGroupRouteFactory(workingGroupController);
  const workingGroupNetworkRoutes = workingGroupNetworkRouteFactory(
    workingGroupNetworkController,
  );
  const projectRoutes = projectRouteFactory(projectController);
  const eventRoutes = eventRouteFactory(eventController);
  const externalUsersRoutes = externalUserRouteFactory(externalUserController);
  const calendarRoutes = calendarRouteFactory(calendarController);
  const outputRoutes = outputRouteFactory(outputController);

  /* istanbul ignore next */
  if (libs.sentryRequestHandler) {
    app.use(libs.sentryRequestHandler());
  }
  app.use(getHttpLogger({ logger }));
  app.use(sentryTransactionIdHandler);
  app.use(cors());
  app.use(express.json({ limit: '10MB' }));
  /**
   * Public routes --->
   */
  app.use(pageRoutes);
  app.use(userPublicRoutes);
  // Auth
  app.use(authHandler);

  if (libs.mockRequestHandlers) {
    app.use(libs.mockRequestHandlers);
  }

  app.use(userRoutes);
  app.use(contributingCohortRoutes);
  // Permission check
  app.use(permissionHandler);

  /**
   * Routes requiring onboarding below
   */
  app.use(dashboardRoutes);
  app.use(newsRoutes);
  app.use(workingGroupRoutes);
  app.use(workingGroupNetworkRoutes);
  app.use(projectRoutes);
  app.use(eventRoutes);
  app.use(externalUsersRoutes);
  app.use(calendarRoutes);
  app.use(outputRoutes);

  // Catch all
  app.get('*', async (_req, res) => {
    res.status(404).json({
      statusCode: 404,
      error: 'Not Found',
      message: 'Not Found',
    });
  });

  /* istanbul ignore next */
  if (libs.sentryErrorHandler) {
    app.use(libs.sentryErrorHandler({ shouldHandleError }));
  }

  app.use(errorHandler);
  app.disable('x-powered-by');

  return app;
};

export type Libs = {
  assetContentfulDataProvider?: AssetDataProvider;
  assetDataProvider?: AssetDataProvider;
  authHandler?: AuthHandler;
  calendarContentfulDataProvider?: gp2.CalendarDataProvider;
  calendarController?: gp2.CalendarController;
  calendarDataProvider?: gp2.CalendarDataProvider;
  contributingCohortContentfulDataProvider?: ContributingCohortDataProvider;
  contributingCohortController?: ContributingCohortController;
  contributingCohortDataProvider?: ContributingCohortDataProvider;
  dashboardContentfulDataProvider?: DashboardDataProvider;
  dashboardController?: DashboardController;
  eventContentfulDataProvider?: gp2.EventDataProvider;
  eventController?: gp2.EventController;
  eventDataProvider?: gp2.EventDataProvider;
  externalUserContentfulDataProvider?: ExternalUserDataProvider;
  externalUserController?: ExternalUserController;
  externalUserDataProvider?: ExternalUserDataProvider;
  logger?: Logger;
  newsController?: NewsController;
  newsDataProvider?: NewsDataProvider;
  outputContentfulDataProvider?: OutputDataProvider;
  outputController?: OutputController;
  outputDataProvider?: OutputDataProvider;
  pageContentfulDataProvider?: PageDataProvider;
  pageController?: PageController;
  pageDataProvider?: PageDataProvider;
  projectContentfulDataProvider?: ProjectDataProvider;
  projectController?: ProjectController;
  projectDataProvider?: ProjectDataProvider;
  sentryErrorHandler?: typeof Sentry.Handlers.errorHandler;
  sentryRequestHandler?: typeof Sentry.Handlers.requestHandler;
  sentryTransactionIdHandler?: RequestHandler;
  userContentfulDataProvider?: UserDataProvider;
  userController?: UserController;
  userDataProvider?: UserDataProvider;
  workingGroupContentfulDataProvider?: WorkingGroupDataProvider;
  workingGroupController?: WorkingGroupController;
  workingGroupDataProvider?: WorkingGroupDataProvider;
  workingGroupNetworkContentfulDataProvider?: WorkingGroupNetworkDataProvider;
  workingGroupNetworkController?: WorkingGroupNetworkController;
  workingGroupNetworkDataProvider?: WorkingGroupNetworkDataProvider;
  // extra handlers only for tests and local development
  mockRequestHandlers?: RequestHandler[];
};
