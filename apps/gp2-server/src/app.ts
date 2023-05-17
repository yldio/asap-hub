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
import {
  getAccessTokenFactory,
  gp2 as gp2Squidex,
  InputCalendar,
  RestCalendar,
  RestEvent,
  RestPage,
  SquidexGraphql,
  SquidexRest,
} from '@asap-hub/squidex';
import * as Sentry from '@sentry/serverless';
import cors from 'cors';
import express, { Express, RequestHandler } from 'express';
import 'express-async-errors';
import {
  appName,
  auth0Audience,
  baseUrl,
  clientId,
  clientSecret,
  contentfulAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
  isContentfulEnabled,
} from './config';
import Calendars from './controllers/calendar.controller';
import ContributingCohorts, {
  ContributingCohortController,
} from './controllers/contributing-cohort.controller';
import Events from './controllers/event.controller';
import ExternalUsers, {
  ExternalUsersController,
} from './controllers/external-users.controller';
import News, { NewsController } from './controllers/news.controller';
import Outputs, { OutputController } from './controllers/output.controller';
import Pages, { PageController } from './controllers/page.controller';
import Projects, { ProjectController } from './controllers/project.controller';
import Users, { UserController } from './controllers/user.controller';
import WorkingGroupNetwork, {
  WorkingGroupNetworkController,
} from './controllers/working-group-network.controller';
import WorkingGroups, {
  WorkingGroupController,
} from './controllers/working-group.controller';
import { AssetSquidexDataProvider } from './data-providers/asset.data-provider';
import { CalendarSquidexDataProvider } from './data-providers/calendar.data-provider';
import { AssetContentfulDataProvider } from './data-providers/contentful/asset.data-provider';
import { ContributingCohortsContentfulDataProvider } from './data-providers/contentful/contributing-cohorts.data-provider';
import { NewsContentfulDataProvider } from './data-providers/contentful/news.data-provider';
import { PageContentfulDataProvider } from './data-providers/contentful/page.data-provider';
import { UserContentfulDataProvider } from './data-providers/contentful/user.data-provider';
import { ContributingCohortSquidexDataProvider } from './data-providers/contributing-cohort.data-provider';
import { EventSquidexDataProvider } from './data-providers/event.data-provider';
import {
  ExternalUserDataProvider,
  ExternalUserSquidexDataProvider,
} from './data-providers/external-users.data-provider';
import { NewsSquidexDataProvider } from './data-providers/news.data-provider';
import {
  OutputDataProvider,
  OutputSquidexDataProvider,
} from './data-providers/output.data-provider';
import { PageSquidexDataProvider } from './data-providers/page.data-provider';
import {
  ProjectDataProvider,
  ProjectSquidexDataProvider,
} from './data-providers/project.data-provider';
import {
  AssetDataProvider,
  ContributingCohortDataProvider,
  NewsDataProvider,
  PageDataProvider,
  UserDataProvider,
} from './data-providers/types';
import { UserSquidexDataProvider } from './data-providers/user.data-provider';
import {
  WorkingGroupNetworkDataProvider,
  WorkingGroupNetworkSquidexDataProvider,
} from './data-providers/working-group-network.data-provider';
import {
  WorkingGroupDataProvider,
  WorkingGroupSquidexDataProvider,
} from './data-providers/working-group.data-provider';
import { getContentfulRestClientFactory } from './dependencies/clients.dependencies';
import { calendarRouteFactory } from './routes/calendar.route';
import { contributingCohortRouteFactory } from './routes/contributing-cohort.route';
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
    gp2Squidex.RestUser,
    gp2Squidex.InputUser
  >(getAuthToken, 'users', {
    appName,
    baseUrl,
  });
  const contributingCohortRestClient = new SquidexRest<
    gp2Squidex.RestContributingCohort,
    gp2Squidex.InputContributingCohort
  >(getAuthToken, 'contributing-cohorts', {
    appName,
    baseUrl,
  });
  const workingGroupRestClient = new SquidexRest<
    gp2Squidex.RestWorkingGroup,
    gp2Squidex.InputWorkingGroup
  >(getAuthToken, 'working-groups', {
    appName,
    baseUrl,
  });
  const projectRestClient = new SquidexRest<
    gp2Squidex.RestProject,
    gp2Squidex.InputProject
  >(getAuthToken, 'projects', {
    appName,
    baseUrl,
  });
  const eventRestClient = new SquidexRest<RestEvent>(getAuthToken, 'events', {
    appName,
    baseUrl,
  });
  const calendarRestClient = new SquidexRest<RestCalendar, InputCalendar>(
    getAuthToken,
    'calendars',
    {
      appName,
      baseUrl,
    },
  );
  const outputRestClient = new SquidexRest<
    gp2Squidex.RestOutput,
    gp2Squidex.InputOutput
  >(getAuthToken, 'outputs', {
    appName,
    baseUrl,
  });
  const externalUserRestClient = new SquidexRest<gp2Squidex.RestExternalUser>(
    getAuthToken,
    'external-users',
    {
      appName,
      baseUrl,
    },
  );
  const pageRestClient = new SquidexRest<RestPage>(getAuthToken, 'pages', {
    appName,
    baseUrl,
  });
  const decodeToken = decodeTokenFactory(auth0Audience);
  const userResponseCacheClient = new MemoryCacheClient<gp2.UserResponse>();

  // Data Providers
  const assetSquidexDataProvider =
    libs.assetSquidexDataProvider ||
    new AssetSquidexDataProvider(userRestClient);
  const assetContentfulDataProvider =
    libs.assetContentfulDataProvider ||
    new AssetContentfulDataProvider(getContentfulRestClientFactory);
  const contributingCohortSquidexDataProvider =
    libs.contributingCohortSquidexDataProvider ||
    new ContributingCohortSquidexDataProvider(
      squidexGraphqlClient,
      contributingCohortRestClient,
    );
  const contributingCohortContentfulDataProvider =
    libs.contributingCohortContentfulDataProvider ||
    new ContributingCohortsContentfulDataProvider(
      contentfulGraphQLClient,
      getContentfulRestClientFactory,
    );
  const userContentfulDataProvider =
    libs.userContentfulDataProvider ||
    new UserContentfulDataProvider(
      contentfulGraphQLClient,
      getContentfulRestClientFactory,
    );
  const userSquidexDataProvider =
    libs.userSquidexDataProvider ||
    new UserSquidexDataProvider(squidexGraphqlClient, userRestClient);
  const newsSquidexDataProvider =
    libs.newsSquidexDataProvider ||
    new NewsSquidexDataProvider(squidexGraphqlClient);
  const newsContentfulDataProvider =
    libs.newsContentfulDataProvider ||
    new NewsContentfulDataProvider(contentfulGraphQLClient);
  const workingGroupDataProvider =
    libs.workingGroupDataProvider ||
    new WorkingGroupSquidexDataProvider(
      squidexGraphqlClient,
      workingGroupRestClient,
    );
  const workingGroupNetworkDataProvider =
    libs.workingGroupNetworkDataProvider ||
    new WorkingGroupNetworkSquidexDataProvider(squidexGraphqlClient);
  const projectDataProvider =
    libs.projectDataProvider ||
    new ProjectSquidexDataProvider(squidexGraphqlClient, projectRestClient);
  const calendarDataProvider =
    libs.calendarDataProvider ||
    new CalendarSquidexDataProvider(calendarRestClient, squidexGraphqlClient);
  const eventDataProvider =
    libs.eventDataProvider ||
    new EventSquidexDataProvider(eventRestClient, squidexGraphqlClient);
  const outputDataProvider =
    libs.outputDataProvider ||
    new OutputSquidexDataProvider(squidexGraphqlClient, outputRestClient);

  const externalUserDataProvider =
    libs.externalUsersDataProvider ||
    new ExternalUserSquidexDataProvider(
      squidexGraphqlClient,
      externalUserRestClient,
    );
  const pageSquidexDataProvider =
    libs.pageSquidexDataProvider || new PageSquidexDataProvider(pageRestClient);
  const pageContentfulDataProvider =
    libs.pageContentfulDataProvider ||
    new PageContentfulDataProvider(contentfulGraphQLClient);

  const assetDataProvider =
    libs.assetDataProvider || isContentfulEnabled
      ? assetContentfulDataProvider
      : assetSquidexDataProvider;
  const pageDataProvider =
    libs.pageDataProvider || isContentfulEnabled
      ? pageContentfulDataProvider
      : pageSquidexDataProvider;

  const newsDataProvider =
    libs.newsDataProvider || isContentfulEnabled
      ? newsContentfulDataProvider
      : newsSquidexDataProvider;
  const userDataProvider =
    libs.userDataProvider || isContentfulEnabled
      ? userContentfulDataProvider
      : userSquidexDataProvider;
  const contributingCohortDataProvider =
    libs.contributingCohortDataProvider || isContentfulEnabled
      ? contributingCohortContentfulDataProvider
      : contributingCohortSquidexDataProvider;
  // Controllers

  const workingGroupController =
    libs.workingGroupController || new WorkingGroups(workingGroupDataProvider);
  const workingGroupNetworkController =
    libs.workingGroupNetworkController ||
    new WorkingGroupNetwork(workingGroupNetworkDataProvider);
  const projectController =
    libs.projectController || new Projects(projectDataProvider);
  const newsController = libs.newsController || new News(newsDataProvider);
  const pageController = libs.pageController || new Pages(pageDataProvider);
  const eventController = libs.eventController || new Events(eventDataProvider);
  const externalUsersController =
    libs.externalUsersController || new ExternalUsers(externalUserDataProvider);
  const calendarController =
    libs.calendarController || new Calendars(calendarDataProvider);
  const outputController =
    libs.outputController ||
    new Outputs(outputDataProvider, externalUserDataProvider);
  const contributingCohortController =
    libs.contributingCohortController ||
    new ContributingCohorts(contributingCohortDataProvider);

  /**
   * Public routes --->
   */
  const userController =
    libs.userController || new Users(userDataProvider, assetDataProvider);

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
  const externalUsersRoutes = externalUserRouteFactory(externalUsersController);
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
  assetDataProvider?: AssetDataProvider;
  assetSquidexDataProvider?: AssetDataProvider;
  assetContentfulDataProvider?: AssetDataProvider;
  authHandler?: AuthHandler;
  calendarController?: gp2.CalendarController;
  calendarDataProvider?: gp2.CalendarDataProvider;
  contributingCohortController?: ContributingCohortController;
  contributingCohortDataProvider?: ContributingCohortDataProvider;
  contributingCohortSquidexDataProvider?: ContributingCohortDataProvider;
  contributingCohortContentfulDataProvider?: ContributingCohortDataProvider;
  eventController?: gp2.EventController;
  eventDataProvider?: gp2.EventDataProvider;
  externalUsersController?: ExternalUsersController;
  externalUsersDataProvider?: ExternalUserDataProvider;
  logger?: Logger;
  newsContentfulDataProvider?: NewsDataProvider;
  newsController?: NewsController;
  newsSquidexDataProvider?: NewsDataProvider;
  newsDataProvider?: NewsDataProvider;
  outputController?: OutputController;
  outputDataProvider?: OutputDataProvider;
  pageContentfulDataProvider?: PageDataProvider;
  pageDataProvider?: PageDataProvider;
  pageController?: PageController;
  pageSquidexDataProvider?: PageDataProvider;
  projectController?: ProjectController;
  projectDataProvider?: ProjectDataProvider;
  sentryErrorHandler?: typeof Sentry.Handlers.errorHandler;
  sentryRequestHandler?: typeof Sentry.Handlers.requestHandler;
  sentryTransactionIdHandler?: RequestHandler;
  userController?: UserController;
  userDataProvider?: UserDataProvider;
  userContentfulDataProvider?: UserDataProvider;
  userSquidexDataProvider?: UserDataProvider;
  workingGroupController?: WorkingGroupController;
  workingGroupDataProvider?: WorkingGroupDataProvider;
  workingGroupNetworkController?: WorkingGroupNetworkController;
  workingGroupNetworkDataProvider?: WorkingGroupNetworkDataProvider;
  // extra handlers only for tests and local development
  mockRequestHandlers?: RequestHandler[];
};
