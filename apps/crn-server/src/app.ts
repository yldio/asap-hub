import { UserResponse } from '@asap-hub/model';
import {
  AuthHandler,
  authHandlerFactory,
  decodeTokenFactory,
  errorHandlerFactory,
  getHttpLogger,
  HttpLogger,
  Logger,
  MemoryCacheClient,
} from '@asap-hub/server-common';
import {
  InputCalendar,
  InputUser,
  RestCalendar,
  RestEvent,
  RestExternalAuthor,
  RestNews,
  RestPage,
  RestResearchOutput,
  RestTeam,
  RestUser,
  SquidexGraphql,
  SquidexRest,
} from '@asap-hub/squidex';
import * as Sentry from '@sentry/serverless';
import AWSXray from 'aws-xray-sdk';
import cors from 'cors';
import express, { Express, RequestHandler } from 'express';
import 'express-async-errors';
import { Tracer } from 'opentracing';
import { appName, auth0Audience, baseUrl } from './config';
import Calendars, { CalendarController } from './controllers/calendars';
import Dashboard, { DashboardController } from './controllers/dashboard';
import Discover, { DiscoverController } from './controllers/discover';
import Events, { EventController } from './controllers/events';
import Groups, { GroupController } from './controllers/groups';
import Labs, { LabsController } from './controllers/labs';
import News, { NewsController } from './controllers/news';
import Pages, { PageController } from './controllers/pages';
import Reminders, { ReminderController } from './controllers/reminders';
import ResearchOutputs, {
  ResearchOutputController,
} from './controllers/research-outputs';
import ResearchTags, {
  ResearchTagController,
} from './controllers/research-tags';
import Teams, { TeamController } from './controllers/teams';
import Users, { UserController } from './controllers/users';
import {
  AssetDataProvider,
  AssetSquidexDataProvider,
} from './data-providers/assets.data-provider';
import {
  ExternalAuthorDataProvider,
  ExternalAuthorSquidexDataProvider,
} from './data-providers/external-authors.data-provider';
import {
  GroupDataProvider,
  GroupSquidexDataProvider,
} from './data-providers/groups.data-provider';
import {
  ResearchOutputDataProvider,
  ResearchOutputSquidexDataProvider,
} from './data-providers/research-outputs.data-provider';
import {
  ResearchTagDataProvider,
  ResearchTagSquidexDataProvider,
} from './data-providers/research-tags.data-provider';
import {
  TeamDataProvider,
  TeamSquidexDataProvider,
} from './data-providers/teams.data-provider';
import {
  UserDataProvider,
  UserSquidexDataProvider,
} from './data-providers/users.data-provider';
import { permissionHandler } from './middleware/permission-handler';
import { sentryTransactionIdMiddleware } from './middleware/sentry-transaction-id-handler';
import { tracingHandlerFactory } from './middleware/tracing-handler';
import { userLoggerHandler } from './middleware/user-logger-handler';
import { calendarRouteFactory } from './routes/calendars.route';
import { dashboardRouteFactory } from './routes/dashboard.route';
import { discoverRouteFactory } from './routes/discover.route';
import { eventRouteFactory } from './routes/events.route';
import { groupRouteFactory } from './routes/groups.route';
import { labsRouteFactory } from './routes/labs.route';
import { newsRouteFactory } from './routes/news.route';
import { pageRouteFactory } from './routes/pages.route';
import { reminderRouteFactory } from './routes/reminders.route';
import { researchOutputRouteFactory } from './routes/research-outputs.route';
import { researchTagsRouteFactory } from './routes/research-tags.route';
import { teamRouteFactory } from './routes/teams.route';
import { userPublicRouteFactory, userRouteFactory } from './routes/user.route';
import { getAuthToken } from './utils/auth';
import pinoLogger from './utils/logger';

export const appFactory = (libs: Libs = {}): Express => {
  const app = express();

  /**
   * Dependency Injection -->
   */
  // Libs
  const logger = libs.logger || pinoLogger;
  // Middleware
  const httpLogger = libs.httpLogger || getHttpLogger({ logger });
  const errorHandler = errorHandlerFactory();

  // Clients
  const decodeToken = decodeTokenFactory(auth0Audience);
  const squidexGraphqlClient = new SquidexGraphql(getAuthToken, {
    appName,
    baseUrl,
  });
  const calendarRestClient = new SquidexRest<RestCalendar, InputCalendar>(
    getAuthToken,
    'calendars',
    { appName, baseUrl },
  );
  const eventRestClient = new SquidexRest<RestEvent>(getAuthToken, 'events', {
    appName,
    baseUrl,
  });
  const userRestClient = new SquidexRest<RestUser, InputUser>(
    getAuthToken,
    'users',
    {
      appName,
      baseUrl,
    },
  );
  const newsRestClient = new SquidexRest<RestNews>(
    getAuthToken,
    'news-and-events',
    { appName, baseUrl },
  );
  const pageRestClient = new SquidexRest<RestPage>(getAuthToken, 'pages', {
    appName,
    baseUrl,
  });
  const researchOutputRestClient = new SquidexRest<RestResearchOutput>(
    getAuthToken,
    'research-outputs',
    { appName, baseUrl },
  );
  const teamRestClient = new SquidexRest<RestTeam>(getAuthToken, 'teams', {
    appName,
    baseUrl,
  });
  const externalAuthorRestClient = new SquidexRest<RestExternalAuthor>(
    getAuthToken,
    'external-authors',
    { appName, baseUrl },
  );
  const userResponseCacheClient = new MemoryCacheClient<UserResponse>();

  // Data Providers
  const assetDataProvider =
    libs.assetDataProvider || new AssetSquidexDataProvider(userRestClient);
  const groupDataProvider =
    libs.groupDataProvider ||
    new GroupSquidexDataProvider(squidexGraphqlClient);
  const teamDataProvider =
    libs.teamDataProvider ||
    new TeamSquidexDataProvider(squidexGraphqlClient, teamRestClient);
  const userDataProvider =
    libs.userDataProvider ||
    new UserSquidexDataProvider(squidexGraphqlClient, userRestClient);
  const researchOutputDataProvider =
    libs.researchOutputDataProvider ||
    new ResearchOutputSquidexDataProvider(
      squidexGraphqlClient,
      researchOutputRestClient,
      teamRestClient,
    );
  const researchTagDataProvider =
    libs.researchTagDataProvider ||
    new ResearchTagSquidexDataProvider(squidexGraphqlClient);
  const externalAuthorDataProvider =
    libs.externalAuthorDataProvider ||
    new ExternalAuthorSquidexDataProvider(externalAuthorRestClient);

  // Controllers
  const calendarController =
    libs.calendarController ||
    new Calendars(squidexGraphqlClient, calendarRestClient);
  const dashboardController =
    libs.dashboardController || new Dashboard(squidexGraphqlClient);
  const newsController = libs.newsController || new News(newsRestClient);
  const discoverController =
    libs.discoverController || new Discover(squidexGraphqlClient);
  const eventController =
    libs.eventController || new Events(squidexGraphqlClient, eventRestClient);
  const groupController =
    libs.groupController || new Groups(groupDataProvider, userDataProvider);
  const pageController = libs.pageController || new Pages(pageRestClient);
  const reminderController = libs.reminderController || new Reminders();
  const researchOutputController =
    libs.researchOutputController ||
    new ResearchOutputs(
      researchOutputDataProvider,
      researchTagDataProvider,
      externalAuthorDataProvider,
    );
  const researchTagController =
    libs.researchTagController || new ResearchTags(squidexGraphqlClient);
  const teamController = libs.teamController || new Teams(teamDataProvider);
  const userController =
    libs.userController || new Users(userDataProvider, assetDataProvider);
  const labsController = libs.labsController || new Labs(squidexGraphqlClient);

  // Handlers
  const authHandler =
    libs.authHandler ||
    authHandlerFactory(
      decodeToken,
      userController.fetchByCode.bind(userController),
      userResponseCacheClient,
      logger,
    );
  const tracingHandler = tracingHandlerFactory(libs.tracer);
  const sentryTransactionIdHandler =
    libs.sentryTransactionIdHandler || sentryTransactionIdMiddleware;

  // Routes
  const calendarRoutes = calendarRouteFactory(calendarController);
  const dashboardRoutes = dashboardRouteFactory(dashboardController);
  const discoverRoutes = discoverRouteFactory(discoverController);
  const eventRoutes = eventRouteFactory(eventController);
  const groupRoutes = groupRouteFactory(groupController, eventController);
  const labsRoutes = labsRouteFactory(labsController);
  const newsRoutes = newsRouteFactory(newsController);
  const pageRoutes = pageRouteFactory(pageController);
  const reminderRoutes = reminderRouteFactory(reminderController);
  const researchOutputsRoutes = researchOutputRouteFactory(
    researchOutputController,
  );
  const researchTagsRoutes = researchTagsRouteFactory(researchTagController);
  const teamRoutes = teamRouteFactory(groupController, teamController);
  const userPublicRoutes = userPublicRouteFactory(userController);
  const userRoutes = userRouteFactory(userController, groupController);

  /**
   * --- end of dependency inection
   */

  /* istanbul ignore next */
  if (libs.xRay) {
    app.use(libs.xRay.express.openSegment('default'));
    libs.xRay.middleware.enableDynamicNaming('*.hub.asap.science');
  }

  /* istanbul ignore next */
  if (libs.sentryRequestHandler) {
    app.use(libs.sentryRequestHandler());
  }
  app.use(httpLogger);
  app.use(sentryTransactionIdHandler);
  app.use(tracingHandler);
  app.use(cors());
  app.use(express.json({ limit: '10MB' }));

  /**
   * Public routes --->
   */
  app.use(pageRoutes);
  app.use(userPublicRoutes);

  /**
   * --- end of public routes
   */

  // Auth
  app.use(authHandler);
  app.use(userLoggerHandler);

  /**
   * Routes requiring authentication below
   */
  if (libs.mockRequestHandlers) {
    app.use(libs.mockRequestHandlers);
  }

  app.use(userRoutes);

  // Permission check
  app.use(permissionHandler);

  /**
   * Routes requiring onboarding below
   */
  app.use(calendarRoutes);
  app.use(dashboardRoutes);
  app.use(discoverRoutes);
  app.use(eventRoutes);
  app.use(groupRoutes);
  app.use(labsRoutes);
  app.use(newsRoutes);
  app.use(reminderRoutes);
  app.use(researchOutputsRoutes);
  app.use(researchTagsRoutes);
  app.use(teamRoutes);

  app.get('*', async (_req, res) => {
    res.status(404).json({
      statusCode: 404,
      error: 'Not Found',
      message: 'Not Found',
    });
  });

  /* istanbul ignore next */
  if (libs.xRay) {
    app.use(libs.xRay.express.closeSegment());
  }

  /* istanbul ignore next */
  if (libs.sentryErrorHandler) {
    app.use(libs.sentryErrorHandler());
  }

  app.use(errorHandler);
  app.disable('x-powered-by');

  return app;
};

export type Libs = {
  calendarController?: CalendarController;
  dashboardController?: DashboardController;
  discoverController?: DiscoverController;
  eventController?: EventController;
  groupController?: GroupController;
  labsController?: LabsController;
  newsController?: NewsController;
  pageController?: PageController;
  reminderController?: ReminderController;
  researchOutputController?: ResearchOutputController;
  researchTagController?: ResearchTagController;
  teamController?: TeamController;
  userController?: UserController;
  assetDataProvider?: AssetDataProvider;
  groupDataProvider?: GroupDataProvider;
  teamDataProvider?: TeamDataProvider;
  userDataProvider?: UserDataProvider;
  researchOutputDataProvider?: ResearchOutputDataProvider;
  researchTagDataProvider?: ResearchTagDataProvider;
  externalAuthorDataProvider?: ExternalAuthorDataProvider;
  authHandler?: AuthHandler;
  tracer?: Tracer;
  httpLogger?: HttpLogger;
  logger?: Logger;
  // extra handlers only for tests and local development
  mockRequestHandlers?: RequestHandler[];
  xRay?: typeof AWSXray;
  sentryErrorHandler?: typeof Sentry.Handlers.errorHandler;
  sentryRequestHandler?: typeof Sentry.Handlers.requestHandler;
  sentryTransactionIdHandler?: RequestHandler;
};
