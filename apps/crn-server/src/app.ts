import { getGraphQLClient as getContentfulGraphQLClient } from '@asap-hub/contentful';
import {
  CalendarDataProvider,
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
  permissionHandler,
  sentryTransactionIdMiddleware,
  shouldHandleError,
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
import cors from 'cors';
import express, { Express, RequestHandler } from 'express';
import 'express-async-errors';
import {
  appName,
  auth0Audience,
  baseUrl,
  contentfulAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
  isContentfulEnabled,
} from './config';
import GuideController from './controllers/guide.controller';
import CalendarController from './controllers/calendar.controller';
import DashboardController from './controllers/dashboard.controller';
import DiscoverController from './controllers/discover.controller';
import EventController from './controllers/event.controller';
import InterestGroupController from './controllers/interest-group.controller';
import LabController from './controllers/lab.controller';
import NewsController from './controllers/news.controller';
import PageController from './controllers/page.controller';
import ReminderController from './controllers/reminder.controller';
import ResearchOutputController from './controllers/research-output.controller';
import ResearchTagController from './controllers/research-tag.controller';
import TeamController from './controllers/team.controller';
import TutorialController from './controllers/tutorial.controller';
import UserController from './controllers/user.controller';
import WorkingGroupController from './controllers/working-group.controller';
import { AssetSquidexDataProvider } from './data-providers/asset.data-provider';
import { CalendarSquidexDataProvider } from './data-providers/calendar.data-provider';
import { CalendarContentfulDataProvider } from './data-providers/contentful/calendars.data-provider';
import { AssetContentfulDataProvider } from './data-providers/contentful/assets.data-provider';
import { DashboardContentfulDataProvider } from './data-providers/contentful/dashboard.data-provider';
import { EventContentfulDataProvider } from './data-providers/contentful/event.data-provider';
import { ExternalAuthorContentfulDataProvider } from './data-providers/contentful/external-authors.data-provider';
import { InterestGroupContentfulDataProvider } from './data-providers/contentful/interest-groups.data-provider';
import { NewsContentfulDataProvider } from './data-providers/contentful/news.data-provider';
import { PageContentfulDataProvider } from './data-providers/contentful/pages.data-provider';
import { TeamContentfulDataProvider } from './data-providers/contentful/teams.data-provider';
import { TutorialsContentfulDataProvider } from './data-providers/contentful/tutorials.data-provider';
import { UserContentfulDataProvider } from './data-providers/contentful/users.data-provider';
import { WorkingGroupContentfulDataProvider } from './data-providers/contentful/working-groups.data-provider';
import { DiscoverContentfulDataProvider } from './data-providers/contentful/discover.data-provider';
import { ResearchTagContentfulDataProvider } from './data-providers/contentful/research-tags.data-provider';
import { ReminderContentfulDataProvider } from './data-providers/contentful/reminder.data-provider';

import DashboardSquidexDataProvider from './data-providers/dashboard.data-provider';
import { EventSquidexDataProvider } from './data-providers/event.data-provider';
import {
  ExternalAuthorDataProvider,
  ExternalAuthorSquidexDataProvider,
} from './data-providers/external-author.data-provider';
import { InterestGroupSquidexDataProvider } from './data-providers/interest-group.data-provider';
import { NewsSquidexDataProvider } from './data-providers/news.data-provider';
import { PageSquidexDataProvider } from './data-providers/page.data-provider';
import {
  ReminderDataProvider,
  ReminderSquidexDataProvider,
} from './data-providers/reminder.data-provider';
import {
  ResearchOutputDataProvider,
  ResearchOutputSquidexDataProvider,
} from './data-providers/research-output.data-provider';
import { ResearchTagSquidexDataProvider } from './data-providers/research-tag.data-provider';
import {
  TeamDataProvider,
  TeamSquidexDataProvider,
} from './data-providers/team.data-provider';
import { TutorialsSquidexDataProvider } from './data-providers/tutorial.data-provider';
import {
  AssetDataProvider,
  InterestGroupDataProvider,
  NewsDataProvider,
  PageDataProvider,
  UserDataProvider,
  DashboardDataProvider,
  DiscoverDataProvider,
  GuideDataProvider,
  WorkingGroupDataProvider,
  TutorialsDataProvider,
  ResearchTagDataProvider,
  ReminderDataProvider,
} from './data-providers/types';
import { UserSquidexDataProvider } from './data-providers/user.data-provider';
import { WorkingGroupSquidexDataProvider } from './data-providers/working-group.data-provider';
import { getContentfulRestClientFactory } from './dependencies/clients.dependencies';
import { featureFlagMiddlewareFactory } from './middleware/feature-flag';
import { calendarRouteFactory } from './routes/calendar.route';
import { dashboardRouteFactory } from './routes/dashboard.route';
import { discoverRouteFactory } from './routes/discover.route';
import { guideRouteFactory } from './routes/guide.route';
import { eventRouteFactory } from './routes/event.route';
import { interestGroupRouteFactory } from './routes/interest-group.route';
import { labRouteFactory } from './routes/lab.route';
import { newsRouteFactory } from './routes/news.route';
import { pageRouteFactory } from './routes/page.route';
import { reminderRouteFactory } from './routes/reminder.route';
import { researchOutputRouteFactory } from './routes/research-output.route';
import { researchTagRouteFactory } from './routes/research-tag.route';
import { teamRouteFactory } from './routes/team.route';
import { tutorialRouteFactory } from './routes/tutorial.route';
import { userPublicRouteFactory, userRouteFactory } from './routes/user.route';
import { workingGroupRouteFactory } from './routes/working-group.route';
import assignUserToContext from './utils/assign-user-to-context';
import { getAuthToken } from './utils/auth';
import { FeatureFlagDependencySwitch } from './utils/feature-flag';
import pinoLogger from './utils/logger';
import {
  LabDataProvider,
  LabSquidexDataProvider,
} from './data-providers/lab.data-provider';
import { DiscoverSquidexDataProvider } from './data-providers/discover.data-provider';
import { GuideContentfulDataProvider } from './data-providers/contentful/guides.data-provider';

export const appFactory = (libs: Libs = {}): Express => {
  const app = express();

  const contentfulGraphQLClient = getContentfulGraphQLClient({
    space: contentfulSpaceId,
    accessToken: contentfulAccessToken,
    environment: contentfulEnvId,
  });

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
        getContentfulRestClientFactory,
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

  featureFlagDependencySwitch.setDependency(
    'assets',
    libs.assetSquidexDataProvider ||
      new AssetSquidexDataProvider(userRestClient),
    'IS_CONTENTFUL_ENABLED_V2',
    false,
  );
  featureFlagDependencySwitch.setDependency(
    'assets',
    libs.assetContentfulDataProvider ||
      new AssetContentfulDataProvider(getContentfulRestClientFactory),
    'IS_CONTENTFUL_ENABLED_V2',
    true,
  );
  featureFlagDependencySwitch.setDependency(
    'users',
    libs.userSquidexDataProvider ||
      new UserSquidexDataProvider(squidexGraphqlClient, userRestClient),
    'IS_CONTENTFUL_ENABLED_V2',
    false,
  );
  featureFlagDependencySwitch.setDependency(
    'users',
    libs.userContentfulDataProvider ||
      new UserContentfulDataProvider(
        contentfulGraphQLClient,
        getContentfulRestClientFactory,
      ),
    'IS_CONTENTFUL_ENABLED_V2',
    true,
  );
  const userDataProvider =
    libs.userDataProvider ||
    featureFlagDependencySwitch.getDependency(
      'users',
      'IS_CONTENTFUL_ENABLED_V2',
    );
  const assetDataProvider =
    libs.assetDataProvider ||
    featureFlagDependencySwitch.getDependency(
      'assets',
      'IS_CONTENTFUL_ENABLED_V2',
    );
  featureFlagDependencySwitch.setDependency(
    'interestGroups',
    libs.interestGroupSquidexDataProvider ||
      new InterestGroupSquidexDataProvider(squidexGraphqlClient),
    'IS_CONTENTFUL_ENABLED_V2',
    false,
  );
  featureFlagDependencySwitch.setDependency(
    'interestGroups',
    libs.interestGroupContentfulDataProvider ||
      new InterestGroupContentfulDataProvider(contentfulGraphQLClient),
    'IS_CONTENTFUL_ENABLED_V2',
    true,
  );
  const interestGroupDataProvider =
    libs.interestGroupDataProvider ||
    featureFlagDependencySwitch.getDependency(
      'interestGroups',
      'IS_CONTENTFUL_ENABLED_V2',
    );

  featureFlagDependencySwitch.setDependency(
    'reminders',
    libs.reminderSquidexDataProvider ||
      new ReminderSquidexDataProvider(squidexGraphqlClient),
    'IS_CONTENTFUL_ENABLED_V2',
    false,
  );
  featureFlagDependencySwitch.setDependency(
    'reminders',
    libs.reminderContentfulDataProvider ||
      new ReminderContentfulDataProvider(contentfulGraphQLClient),
    'IS_CONTENTFUL_ENABLED_V2',
    true,
  );
  const reminderDataProvider =
    libs.reminderDataProvider ||
    featureFlagDependencySwitch.getDependency(
      'reminders',
      'IS_CONTENTFUL_ENABLED_V2',
    );

  const researchOutputDataProvider =
    libs.researchOutputDataProvider ||
    new ResearchOutputSquidexDataProvider(
      squidexGraphqlClient,
      researchOutputRestClient,
    );

  featureFlagDependencySwitch.setDependency(
    'externalAuthors',
    libs.externalAuthorSquidexDataProvider ||
      new ExternalAuthorSquidexDataProvider(
        externalAuthorRestClient,
        squidexGraphqlClient,
      ),
    'IS_CONTENTFUL_ENABLED_V2',
    false,
  );
  featureFlagDependencySwitch.setDependency(
    'externalAuthors',
    libs.externalAuthorContentfulDataProvider ||
      new ExternalAuthorContentfulDataProvider(
        contentfulGraphQLClient,
        getContentfulRestClientFactory,
      ),
    'IS_CONTENTFUL_ENABLED_V2',
    true,
  );

  const externalAuthorDataProvider =
    libs.externalAuthorDataProvider ||
    featureFlagDependencySwitch.getDependency(
      'externalAuthors',
      'IS_CONTENTFUL_ENABLED_V2',
    );

  featureFlagDependencySwitch.setDependency(
    'calendars',
    libs.calendarSquidexDataProvider ||
      new CalendarSquidexDataProvider(calendarRestClient, squidexGraphqlClient),
    'IS_CONTENTFUL_ENABLED_V2',
    false,
  );
  featureFlagDependencySwitch.setDependency(
    'calendars',
    libs.calendarContentfulDataProvider ||
      new CalendarContentfulDataProvider(
        contentfulGraphQLClient,
        getContentfulRestClientFactory,
      ),
    'IS_CONTENTFUL_ENABLED_V2',
    true,
  );

  const calendarDataProvider =
    libs.calendarDataProvider ||
    featureFlagDependencySwitch.getDependency(
      'calendars',
      'IS_CONTENTFUL_ENABLED_V2',
    );

  featureFlagDependencySwitch.setDependency(
    'workingGroups',
    libs.workingGroupSquidexDataProvider ||
      new WorkingGroupSquidexDataProvider(
        squidexGraphqlClient,
        workingGroupRestClient,
      ),
    'IS_CONTENTFUL_ENABLED_V2',
    false,
  );
  featureFlagDependencySwitch.setDependency(
    'workingGroups',
    libs.workingGroupContentfulDataProvider ||
      new WorkingGroupContentfulDataProvider(
        contentfulGraphQLClient,
        getContentfulRestClientFactory,
      ),
    'IS_CONTENTFUL_ENABLED_V2',
    true,
  );

  const workingGroupDataProvider =
    libs.workingGroupDataProvider ||
    featureFlagDependencySwitch.getDependency(
      'workingGroups',
      'IS_CONTENTFUL_ENABLED_V2',
    );

  featureFlagDependencySwitch.setDependency(
    'events',
    libs.eventSquidexDataProvider ||
      new EventSquidexDataProvider(eventRestClient, squidexGraphqlClient),
    'IS_CONTENTFUL_ENABLED_V2',
    false,
  );
  featureFlagDependencySwitch.setDependency(
    'events',
    libs.eventContentfulDataProvider ||
      new EventContentfulDataProvider(
        contentfulGraphQLClient,
        getContentfulRestClientFactory,
      ),
    'IS_CONTENTFUL_ENABLED_V2',
    true,
  );
  const eventDataProvider =
    libs.eventDataProvider ||
    featureFlagDependencySwitch.getDependency(
      'events',
      'IS_CONTENTFUL_ENABLED_V2',
    );

  featureFlagDependencySwitch.setDependency(
    'tutorials',
    libs.tutorialsSquidexDataProvider ||
      new TutorialsSquidexDataProvider(squidexGraphqlClient),
    'IS_CONTENTFUL_ENABLED_V2',
    false,
  );
  featureFlagDependencySwitch.setDependency(
    'tutorials',
    libs.tutorialsContentfulDataProvider ||
      new TutorialsContentfulDataProvider(contentfulGraphQLClient),
    'IS_CONTENTFUL_ENABLED_V2',
    true,
  );
  const tutorialsDataProvider =
    libs.tutorialsDataProvider ||
    featureFlagDependencySwitch.getDependency(
      'tutorials',
      'IS_CONTENTFUL_ENABLED_V2',
    );

  featureFlagDependencySwitch.setDependency(
    'discover',
    libs.discoverSquidexDataProvider ||
      new DiscoverSquidexDataProvider(squidexGraphqlClient),
    'IS_CONTENTFUL_ENABLED_V2',
    false,
  );
  featureFlagDependencySwitch.setDependency(
    'discover',
    libs.discoverContentfulDataProvider ||
      new DiscoverContentfulDataProvider(contentfulGraphQLClient),
    'IS_CONTENTFUL_ENABLED_V2',
    true,
  );
  const discoverDataProvider =
    libs.discoverDataProvider ||
    featureFlagDependencySwitch.getDependency(
      'discover',
      'IS_CONTENTFUL_ENABLED_V2',
    );

  const guideDataProvider =
    libs.guideDataProvider ||
    new GuideContentfulDataProvider(contentfulGraphQLClient);

  featureFlagDependencySwitch.setDependency(
    'researchTags',
    libs.researchTagSquidexDataProvider ||
      new ResearchTagSquidexDataProvider(squidexGraphqlClient),
    'IS_CONTENTFUL_ENABLED_V2',
    false,
  );
  featureFlagDependencySwitch.setDependency(
    'researchTags',
    libs.researchTagContentfulDataProvider ||
      new ResearchTagContentfulDataProvider(contentfulGraphQLClient),
    'IS_CONTENTFUL_ENABLED_V2',
    true,
  );
  const researchTagDataProvider =
    libs.researchTagDataProvider ||
    featureFlagDependencySwitch.getDependency(
      'researchTags',
      'IS_CONTENTFUL_ENABLED_V2',
    );

  const labDataProvider =
    libs.labDataProvider || new LabSquidexDataProvider(squidexGraphqlClient);

  // Controllers
  const calendarController =
    libs.calendarController || new CalendarController(calendarDataProvider);
  const dashboardController =
    libs.dashboardController || new DashboardController(dashboardDataProvider);
  const newsController =
    libs.newsController || new NewsController(newsDataProvider);
  const discoverController =
    libs.discoverController || new DiscoverController(discoverDataProvider);
  const eventController =
    libs.eventController || new EventController(eventDataProvider);
  const guideController =
    libs.guideController || new GuideController(guideDataProvider);
  const interestGroupController =
    libs.interestGroupController ||
    new InterestGroupController(interestGroupDataProvider, userDataProvider);
  const pageController =
    libs.pageController || new PageController(pageDataProvider);
  const reminderController =
    libs.reminderController || new ReminderController(reminderDataProvider);
  const researchOutputController =
    libs.researchOutputController ||
    new ResearchOutputController(
      researchOutputDataProvider,
      researchTagDataProvider,
      externalAuthorDataProvider,
    );
  const researchTagController =
    libs.researchTagController ||
    new ResearchTagController(researchTagDataProvider);
  const teamController =
    libs.teamController || new TeamController(teamDataProvider);
  const tutorialsController =
    libs.tutorialsController || new TutorialController(tutorialsDataProvider);
  const userController =
    libs.userController ||
    new UserController(userDataProvider, assetDataProvider);
  const labsController =
    libs.labsController || new LabController(labDataProvider);
  const workingGroupsController =
    libs.workingGroupsController ||
    new WorkingGroupController(workingGroupDataProvider);

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
  const sentryTransactionIdHandler =
    libs.sentryTransactionIdHandler || sentryTransactionIdMiddleware;

  // Routes
  const calendarRoutes = calendarRouteFactory(calendarController);
  const dashboardRoutes = dashboardRouteFactory(dashboardController);
  const discoverRoutes = discoverRouteFactory(discoverController);
  const guideRoutes = guideRouteFactory(guideController);
  const eventRoutes = eventRouteFactory(eventController);
  const interestGroupRoutes = interestGroupRouteFactory(
    interestGroupController,
    eventController,
  );
  const labsRoutes = labRouteFactory(labsController);
  const newsRoutes = newsRouteFactory(newsController);
  const pageRoutes = pageRouteFactory(pageController);
  const reminderRoutes = reminderRouteFactory(reminderController);
  const researchOutputsRoutes = researchOutputRouteFactory(
    researchOutputController,
  );
  const researchTagsRoutes = researchTagRouteFactory(researchTagController);
  const teamRoutes = teamRouteFactory(interestGroupController, teamController);
  const tutorialsRoutes = tutorialRouteFactory(tutorialsController);
  const userPublicRoutes = userPublicRouteFactory(userController);
  const userRoutes = userRouteFactory(userController, interestGroupController);
  const workingGroupRoutes = workingGroupRouteFactory(workingGroupsController);

  /**
   * --- end of dependency inection
   */

  /* istanbul ignore next */
  if (libs.sentryRequestHandler) {
    app.use(libs.sentryRequestHandler());
  }
  app.use(httpLogger);
  app.use(sentryTransactionIdHandler);
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
  app.use(guideRoutes);
  app.use(eventRoutes);
  app.use(interestGroupRoutes);
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
  guideController?: GuideController;
  eventController?: EventController;
  interestGroupController?: InterestGroupController;
  labsController?: LabController;
  newsController?: NewsController;
  pageController?: PageController;
  reminderController?: ReminderController;
  researchOutputController?: ResearchOutputController;
  researchTagController?: ResearchTagController;
  teamController?: TeamController;
  tutorialsController?: TutorialController;
  userController?: UserController;
  workingGroupsController?: WorkingGroupController;
  assetDataProvider?: AssetDataProvider;
  assetSquidexDataProvider?: AssetDataProvider;
  assetContentfulDataProvider?: AssetDataProvider;
  calendarDataProvider?: CalendarDataProvider;
  calendarSquidexDataProvider?: CalendarDataProvider;
  calendarContentfulDataProvider?: CalendarDataProvider;
  dashboardDataProvider?: DashboardDataProvider;
  dashboardSquidexDataProvider?: DashboardDataProvider;
  dashboardContentfulDataProvider?: DashboardDataProvider;
  discoverDataProvider?: DiscoverDataProvider;
  discoverSquidexDataProvider?: DiscoverDataProvider;
  discoverContentfulDataProvider?: DiscoverDataProvider;
  guideDataProvider?: GuideDataProvider;
  externalAuthorSquidexDataProvider?: ExternalAuthorDataProvider;
  externalAuthorContentfulDataProvider?: ExternalAuthorDataProvider;
  externalAuthorDataProvider?: ExternalAuthorDataProvider;
  interestGroupDataProvider?: InterestGroupDataProvider;
  interestGroupSquidexDataProvider?: InterestGroupDataProvider;
  interestGroupContentfulDataProvider?: InterestGroupDataProvider;
  labDataProvider?: LabDataProvider;
  newsContentfulDataProvider?: NewsDataProvider;
  newsDataProvider?: NewsDataProvider;
  newsSquidexDataProvider?: NewsDataProvider;
  pageSquidexDataProvider?: PageDataProvider;
  pageContentfulDataProvider?: PageDataProvider;
  reminderDataProvider?: ReminderDataProvider;
  reminderSquidexDataProvider?: ReminderDataProvider;
  reminderContentfulDataProvider?: ReminderDataProvider;
  researchOutputDataProvider?: ResearchOutputDataProvider;
  researchTagDataProvider?: ResearchTagDataProvider;
  researchTagSquidexDataProvider?: ResearchTagDataProvider;
  researchTagContentfulDataProvider?: ResearchTagDataProvider;
  teamSquidexDataProvider?: TeamDataProvider;
  teamContentfulDataProvider?: TeamDataProvider;
  teamDataProvider?: TeamDataProvider;
  tutorialsDataProvider?: TutorialsDataProvider;
  tutorialsSquidexDataProvider?: TutorialsDataProvider;
  tutorialsContentfulDataProvider?: TutorialsDataProvider;
  userDataProvider?: UserDataProvider;
  userSquidexDataProvider?: UserDataProvider;
  userContentfulDataProvider?: UserDataProvider;
  eventDataProvider?: EventDataProvider;
  eventSquidexDataProvider?: EventDataProvider;
  eventContentfulDataProvider?: EventDataProvider;
  workingGroupSquidexDataProvider?: WorkingGroupDataProvider;
  workingGroupContentfulDataProvider?: WorkingGroupDataProvider;
  workingGroupDataProvider?: WorkingGroupDataProvider;
  authHandler?: AuthHandler;
  httpLogger?: HttpLogger;
  logger?: Logger;
  sentryErrorHandler?: typeof Sentry.Handlers.errorHandler;
  sentryRequestHandler?: typeof Sentry.Handlers.requestHandler;
  sentryTransactionIdHandler?: RequestHandler;
  // extra handlers only for tests and local development
  mockRequestHandlers?: RequestHandler[];
};
