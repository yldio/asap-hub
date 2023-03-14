import {
  Environment,
  getGraphQLClient as getContentfulGraphQLClient,
  getRestClient as getContentfulRestClient,
} from '@asap-hub/contentful';
import {
  CalendarController,
  EventController,
  EventDataProvider,
  UserResponse,
} from '@asap-hub/model';
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
  RestWorkingGroup,
  SquidexGraphql,
  SquidexRest,
} from '@asap-hub/squidex';

import * as Sentry from '@sentry/serverless';
import AWSXray from 'aws-xray-sdk';
import cors from 'cors';
import express, { ErrorRequestHandler, Express, RequestHandler } from 'express';
import 'express-async-errors';
import { Tracer } from 'opentracing';
import {
  appName,
  auth0Audience,
  baseUrl,
  contentfulAccessToken,
  contentfulManagementAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
  isContentfulEnabled,
} from './config';
import Calendars from './controllers/calendars';
import Dashboard, { DashboardController } from './controllers/dashboard';
import Discover, { DiscoverController } from './controllers/discover';
import Events from './controllers/events';
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
import Tutorials, { TutorialsController } from './controllers/tutorials';
import Users, { UserController } from './controllers/users';
import WorkingGroups, {
  WorkingGroupController,
} from './controllers/working-groups';
import {
  AssetDataProvider,
  AssetSquidexDataProvider,
} from './data-providers/assets.data-provider';
import { CalendarSquidexDataProvider } from './data-providers/calendars.data-provider';
import { DashboardContentfulDataProvider } from './data-providers/contentful/dashboard.data-provider';
import { NewsContentfulDataProvider } from './data-providers/contentful/news.data-provider';
import { PageContentfulDataProvider } from './data-providers/contentful/pages.data-provider';
import { TeamContentfulDataProvider } from './data-providers/contentful/teams.data-provider';
import { UserContentfulDataProvider } from './data-providers/contentful/users.data-provider';
import DashboardSquidexDataProvider, {
  DashboardDataProvider,
} from './data-providers/dashboard.data-provider';
import { EventSquidexDataProvider } from './data-providers/event.data-provider';
import {
  ExternalAuthorDataProvider,
  ExternalAuthorSquidexDataProvider,
} from './data-providers/external-authors.data-provider';
import {
  GroupDataProvider,
  GroupSquidexDataProvider,
} from './data-providers/groups.data-provider';
import { NewsSquidexDataProvider } from './data-providers/news.data-provider';
import {
  PageDataProvider,
  PageSquidexDataProvider,
} from './data-providers/pages.data-provider';
import {
  ReminderDataProvider,
  ReminderSquidexDataProvider,
} from './data-providers/reminders.data-provider';
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
  TutorialsDataProvider,
  TutorialsSquidexDataProvider,
} from './data-providers/tutorials.data-provider';
import { NewsDataProvider } from './data-providers/types';
import {
  UserDataProvider,
  UserSquidexDataProvider,
} from './data-providers/users.data-provider';
import {
  WorkingGroupDataProvider,
  WorkingGroupSquidexDataProvider,
} from './data-providers/working-groups.data-provider';
import { featureFlagMiddlewareFactory } from './middleware/feature-flag';
import { permissionHandler } from './middleware/permission-handler';
import { sentryTransactionIdMiddleware } from './middleware/sentry-transaction-id-handler';
import { tracingHandlerFactory } from './middleware/tracing-handler';
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
import { tutorialsRouteFactory } from './routes/tutorials.route';
import { userPublicRouteFactory, userRouteFactory } from './routes/user.route';
import { workingGroupRouteFactory } from './routes/working-groups.route';
import assignUserToContext from './utils/assign-user-to-context';
import { getAuthToken } from './utils/auth';
import { FeatureFlagDependencySwitch } from './utils/feature-flag';
import pinoLogger from './utils/logger';
import { shouldHandleError } from './utils/should-handle-error';

export const appFactory = (libs: Libs = {}): Express => {
  const app = express();

  const contentfulGraphQLClient = getContentfulGraphQLClient({
    space: contentfulSpaceId,
    accessToken: contentfulAccessToken,
    environment: contentfulEnvId,
  });

  let contentfulRestClient: Environment | undefined;

  (async () => {
    contentfulRestClient = await getContentfulRestClient({
      space: contentfulSpaceId,
      accessToken: contentfulManagementAccessToken,
      environment: contentfulEnvId,
    });
  })();

  /**
   * Dependency Injection -->
   */
  // Libs
  const logger = libs.logger || pinoLogger;
  const featureFlagDependencySwitch = new FeatureFlagDependencySwitch();
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
  const workingGroupRestClient = new SquidexRest<RestWorkingGroup>(
    getAuthToken,
    'working-groups',
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
  const dashboardSquidexDataProvider =
    libs.dashboardSquidexDataProvider ||
    new DashboardSquidexDataProvider(squidexGraphqlClient);
  const dashboardContentfulDataProvider =
    libs.dashboardContentfulDataProvider ||
    new DashboardContentfulDataProvider(contentfulGraphQLClient);
  const dashboardDataProvider =
    libs.dashboardDataProvider || isContentfulEnabled
      ? dashboardContentfulDataProvider
      : dashboardSquidexDataProvider;
  const groupDataProvider =
    libs.groupDataProvider ||
    new GroupSquidexDataProvider(squidexGraphqlClient);
  const newsSquidexDataProvider =
    libs.newsSquidexDataProvider || new NewsSquidexDataProvider(newsRestClient);
  const newsContentfulDataProvider =
    libs.newsContentfulDataProvider ||
    new NewsContentfulDataProvider(contentfulGraphQLClient);
  const newsDataProvider =
    libs.newsDataProvider || isContentfulEnabled
      ? newsContentfulDataProvider
      : newsSquidexDataProvider;
  const pageSquidexDataProvider =
    libs.pageSquidexDataProvider || new PageSquidexDataProvider(pageRestClient);
  const pageContentfulDataProvider =
    libs.pageContentfulDataProvider ||
    new PageContentfulDataProvider(contentfulGraphQLClient);
  const pageDataProvider = isContentfulEnabled
    ? pageContentfulDataProvider
    : pageSquidexDataProvider;

  featureFlagDependencySwitch.setDependency(
    'teams',
    libs.teamSquidexDataProvider ||
      new TeamSquidexDataProvider(squidexGraphqlClient, teamRestClient),
    'IS_CONTENTFUL_ENABLED_V2',
    false,
  );

  featureFlagDependencySwitch.setDependency(
    'teams',
    libs.teamContentfulDataProvider ||
      new TeamContentfulDataProvider(
        contentfulGraphQLClient,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        contentfulRestClient!,
      ),
    'IS_CONTENTFUL_ENABLED_V2',
    true,
  );
  const teamDataProvider =
    libs.teamDataProvider ||
    featureFlagDependencySwitch.getDependency(
      'teams',
      'IS_CONTENTFUL_ENABLED_V2',
    );

  const tutorialsDataProvider =
    libs.tutorialsDataProvider ||
    new TutorialsSquidexDataProvider(squidexGraphqlClient);
  featureFlagDependencySwitch.setDependency(
    'users',
    libs.userSquidexDataProvider ||
      new UserSquidexDataProvider(squidexGraphqlClient, userRestClient),
    'IS_CONTENTFUL_ENABLED_V2',
    false,
  );
  featureFlagDependencySwitch.setDependency(
    'users',
    libs.userContentfulDataProvider || new UserContentfulDataProvider(),
    'IS_CONTENTFUL_ENABLED_V2',
    true,
  );
  const userDataProvider =
    libs.userDataProvider ||
    featureFlagDependencySwitch.getDependency(
      'users',
      'IS_CONTENTFUL_ENABLED_V2',
    );
  const reminderDataProvider =
    libs.reminderDataProvider ||
    new ReminderSquidexDataProvider(squidexGraphqlClient);
  const researchOutputDataProvider =
    libs.researchOutputDataProvider ||
    new ResearchOutputSquidexDataProvider(
      squidexGraphqlClient,
      researchOutputRestClient,
    );
  const researchTagDataProvider =
    libs.researchTagDataProvider ||
    new ResearchTagSquidexDataProvider(squidexGraphqlClient);
  const externalAuthorDataProvider =
    libs.externalAuthorDataProvider ||
    new ExternalAuthorSquidexDataProvider(externalAuthorRestClient);
  const calendarDataProvider =
    libs.calendarDataProvider ||
    new CalendarSquidexDataProvider(calendarRestClient, squidexGraphqlClient);
  const workingGroupDataProvider =
    libs.workingGroupDataProvider ||
    new WorkingGroupSquidexDataProvider(
      squidexGraphqlClient,
      workingGroupRestClient,
    );
  const eventDataProvider =
    libs.eventDataProvider ||
    new EventSquidexDataProvider(eventRestClient, squidexGraphqlClient);

  // Controllers
  const calendarController =
    libs.calendarController || new Calendars(calendarDataProvider);
  const dashboardController =
    libs.dashboardController || new Dashboard(dashboardDataProvider);
  const newsController = libs.newsController || new News(newsDataProvider);
  const discoverController =
    libs.discoverController || new Discover(squidexGraphqlClient);
  const eventController = libs.eventController || new Events(eventDataProvider);
  const groupController =
    libs.groupController || new Groups(groupDataProvider, userDataProvider);
  const pageController = libs.pageController || new Pages(pageDataProvider);
  const reminderController =
    libs.reminderController || new Reminders(reminderDataProvider);
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
  const tutorialsController =
    libs.tutorialsController || new Tutorials(tutorialsDataProvider);
  const userController =
    libs.userController || new Users(userDataProvider, assetDataProvider);
  const labsController = libs.labsController || new Labs(squidexGraphqlClient);
  const workingGroupsController =
    libs.workingGroupsController || new WorkingGroups(workingGroupDataProvider);

  // Handlers
  const authHandler =
    libs.authHandler ||
    authHandlerFactory<UserResponse>(
      decodeToken,
      userController.fetchByCode.bind(userController),
      userResponseCacheClient,
      logger,
      assignUserToContext,
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
  const tutorialsRoutes = tutorialsRouteFactory(tutorialsController);
  const userPublicRoutes = userPublicRouteFactory(userController);
  const userRoutes = userRouteFactory(userController, groupController);
  const workingGroupRoutes = workingGroupRouteFactory(workingGroupsController);

  /**
   * --- end of dependency inection
   */

  /* istanbul ignore next */
  if (libs.xRay) {
    app.use(libs.xRay.express.openSegment('default') as RequestHandler);
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
  app.use(featureFlagMiddlewareFactory(featureFlagDependencySwitch));

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
  app.use(tutorialsRoutes);
  app.use(workingGroupRoutes);

  app.get('*', async (_req, res) => {
    res.status(404).json({
      statusCode: 404,
      error: 'Not Found',
      message: 'Not Found',
    });
  });

  /* istanbul ignore next */
  if (libs.xRay) {
    app.use(libs.xRay.express.closeSegment() as ErrorRequestHandler);
  }

  /* istanbul ignore next */
  if (libs.sentryErrorHandler) {
    app.use(libs.sentryErrorHandler({ shouldHandleError }));
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
  tutorialsController?: TutorialsController;
  userController?: UserController;
  workingGroupsController?: WorkingGroupController;
  assetDataProvider?: AssetDataProvider;
  calendarDataProvider?: CalendarSquidexDataProvider;
  dashboardDataProvider?: DashboardDataProvider;
  dashboardSquidexDataProvider?: DashboardDataProvider;
  dashboardContentfulDataProvider?: DashboardDataProvider;
  externalAuthorDataProvider?: ExternalAuthorDataProvider;
  groupDataProvider?: GroupDataProvider;
  newsContentfulDataProvider?: NewsDataProvider;
  newsDataProvider?: NewsDataProvider;
  newsSquidexDataProvider?: NewsDataProvider;
  pageSquidexDataProvider?: PageDataProvider;
  pageContentfulDataProvider?: PageDataProvider;
  reminderDataProvider?: ReminderDataProvider;
  researchOutputDataProvider?: ResearchOutputDataProvider;
  researchTagDataProvider?: ResearchTagDataProvider;
  teamSquidexDataProvider?: TeamDataProvider;
  teamContentfulDataProvider?: TeamDataProvider;
  teamDataProvider?: TeamDataProvider;
  tutorialsDataProvider?: TutorialsDataProvider;
  userDataProvider?: UserDataProvider;
  userSquidexDataProvider?: UserDataProvider;
  userContentfulDataProvider?: UserDataProvider;
  eventDataProvider?: EventDataProvider;
  workingGroupDataProvider?: WorkingGroupDataProvider;
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
