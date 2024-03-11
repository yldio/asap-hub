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

import * as Sentry from '@sentry/serverless';
import cors from 'cors';
import express, { Express, RequestHandler } from 'express';
import 'express-async-errors';
import {
  auth0Audience,
  contentfulAccessToken,
  contentfulEnvId,
  contentfulPreviewAccessToken,
  contentfulSpaceId,
} from './config';
import AnalyticsController from './controllers/analytics.controller';
import CalendarController from './controllers/calendar.controller';
import DashboardController from './controllers/dashboard.controller';
import DiscoverController from './controllers/discover.controller';
import EventController from './controllers/event.controller';
import GuideController from './controllers/guide.controller';
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
import { AssetContentfulDataProvider } from './data-providers/contentful/asset.data-provider';
import { CalendarContentfulDataProvider } from './data-providers/contentful/calendar.data-provider';
import { DashboardContentfulDataProvider } from './data-providers/contentful/dashboard.data-provider';
import { DiscoverContentfulDataProvider } from './data-providers/contentful/discover.data-provider';
import { EventContentfulDataProvider } from './data-providers/contentful/event.data-provider';
import { ExternalAuthorContentfulDataProvider } from './data-providers/contentful/external-author.data-provider';
import { InterestGroupContentfulDataProvider } from './data-providers/contentful/interest-group.data-provider';
import { LabContentfulDataProvider } from './data-providers/contentful/lab.data-provider';
import { NewsContentfulDataProvider } from './data-providers/contentful/news.data-provider';
import { PageContentfulDataProvider } from './data-providers/contentful/page.data-provider';
import { ReminderContentfulDataProvider } from './data-providers/contentful/reminder.data-provider';
import { ResearchOutputContentfulDataProvider } from './data-providers/contentful/research-output.data-provider';
import { ResearchTagContentfulDataProvider } from './data-providers/contentful/research-tag.data-provider';
import { TeamContentfulDataProvider } from './data-providers/contentful/team.data-provider';
import { TutorialContentfulDataProvider } from './data-providers/contentful/tutorial.data-provider';
import { UserContentfulDataProvider } from './data-providers/contentful/user.data-provider';
import { WorkingGroupContentfulDataProvider } from './data-providers/contentful/working-group.data-provider';

import { GuideContentfulDataProvider } from './data-providers/contentful/guide.data-provider';
import {
  AssetDataProvider,
  DashboardDataProvider,
  DiscoverDataProvider,
  GuideDataProvider,
  InterestGroupDataProvider,
  LabDataProvider,
  NewsDataProvider,
  PageDataProvider,
  ReminderDataProvider,
  ResearchOutputDataProvider,
  ResearchTagDataProvider,
  TutorialDataProvider,
  UserDataProvider,
  WorkingGroupDataProvider,
} from './data-providers/types';
import { getContentfulRestClientFactory } from './dependencies/clients.dependencies';
import { featureFlagMiddlewareFactory } from './middleware/feature-flag';
import { analyticsRouteFactory } from './routes/analytics.route';
import { calendarRouteFactory } from './routes/calendar.route';
import { dashboardRouteFactory } from './routes/dashboard.route';
import { discoverRouteFactory } from './routes/discover.route';
import { eventRouteFactory } from './routes/event.route';
import { guideRouteFactory } from './routes/guide.route';
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
import { FeatureFlagDependencySwitch } from './utils/feature-flag';
import pinoLogger from './utils/logger';
import { ExternalAuthorDataProvider } from './data-providers/types/external-authors.data-provider.types';
import { TeamDataProvider } from './data-providers/types/teams.data-provider.types';
import { AnalyticsContentfulDataProvider } from './data-providers/contentful/analytics.data-provider';

export const appFactory = (libs: Libs = {}): Express => {
  const app = express();

  const contentfulGraphQLClient = getContentfulGraphQLClient({
    space: contentfulSpaceId,
    accessToken: contentfulAccessToken,
    environment: contentfulEnvId,
  });

  const contentfulPreviewGraphQLClient = getContentfulGraphQLClient({
    space: contentfulSpaceId,
    accessToken: contentfulPreviewAccessToken,
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
  const userResponseCacheClient = new MemoryCacheClient<UserResponse>();

  // Data Providers
  const analyticsDataProvider =
    libs.analyticsDataProvider ||
    new AnalyticsContentfulDataProvider(contentfulGraphQLClient);
  const dashboardDataProvider =
    libs.dashboardDataProvider ||
    new DashboardContentfulDataProvider(contentfulGraphQLClient);

  const newsDataProvider =
    libs.newsDataProvider ||
    new NewsContentfulDataProvider(contentfulGraphQLClient);

  const pageDataProvider =
    libs.pageDataProvider ||
    new PageContentfulDataProvider(contentfulGraphQLClient);

  const teamDataProvider =
    libs.teamDataProvider ||
    new TeamContentfulDataProvider(
      contentfulGraphQLClient,
      getContentfulRestClientFactory,
    );

  const userDataProvider =
    libs.userDataProvider ||
    new UserContentfulDataProvider(
      contentfulGraphQLClient,
      getContentfulRestClientFactory,
    );
  const assetDataProvider =
    libs.assetDataProvider ||
    new AssetContentfulDataProvider(getContentfulRestClientFactory);

  const interestGroupDataProvider =
    libs.interestGroupDataProvider ||
    new InterestGroupContentfulDataProvider(contentfulGraphQLClient);

  const reminderDataProvider =
    libs.reminderDataProvider ||
    new ReminderContentfulDataProvider(contentfulPreviewGraphQLClient);

  const externalAuthorDataProvider =
    libs.externalAuthorDataProvider ||
    new ExternalAuthorContentfulDataProvider(
      contentfulGraphQLClient,
      getContentfulRestClientFactory,
    );

  const calendarDataProvider =
    libs.calendarDataProvider ||
    new CalendarContentfulDataProvider(
      contentfulGraphQLClient,
      getContentfulRestClientFactory,
    );

  const workingGroupDataProvider =
    libs.workingGroupDataProvider ||
    new WorkingGroupContentfulDataProvider(
      contentfulGraphQLClient,
      getContentfulRestClientFactory,
    );

  const eventDataProvider =
    libs.eventDataProvider ||
    new EventContentfulDataProvider(
      contentfulGraphQLClient,
      getContentfulRestClientFactory,
    );

  const tutorialDataProvider =
    libs.tutorialDataProvider ||
    new TutorialContentfulDataProvider(contentfulGraphQLClient);

  const discoverDataProvider =
    libs.discoverDataProvider ||
    new DiscoverContentfulDataProvider(contentfulGraphQLClient);

  const guideDataProvider =
    libs.guideDataProvider ||
    new GuideContentfulDataProvider(contentfulGraphQLClient);

  const researchTagDataProvider =
    libs.researchTagDataProvider ||
    new ResearchTagContentfulDataProvider(
      contentfulGraphQLClient,
      getContentfulRestClientFactory,
    );

  const researchOutputDataProvider =
    libs.researchOutputDataProvider ||
    new ResearchOutputContentfulDataProvider(
      contentfulGraphQLClient,
      contentfulPreviewGraphQLClient,
      getContentfulRestClientFactory,
    );

  const labDataProvider =
    libs.labDataProvider ||
    new LabContentfulDataProvider(contentfulGraphQLClient);

  // Controllers
  const analyticsController =
    libs.analyticsController || new AnalyticsController(analyticsDataProvider);
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
    libs.tutorialsController || new TutorialController(tutorialDataProvider);
  const userController =
    libs.userController ||
    new UserController(
      userDataProvider,
      assetDataProvider,
      researchTagDataProvider,
    );
  const labController =
    libs.labController || new LabController(labDataProvider);
  const workingGroupsController =
    libs.workingGroupController ||
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
  const analyticsRoutes = analyticsRouteFactory(analyticsController);
  const calendarRoutes = calendarRouteFactory(calendarController);
  const dashboardRoutes = dashboardRouteFactory(dashboardController);
  const discoverRoutes = discoverRouteFactory(discoverController);
  const guideRoutes = guideRouteFactory(guideController);
  const eventRoutes = eventRouteFactory(eventController);
  const interestGroupRoutes = interestGroupRouteFactory(
    interestGroupController,
    eventController,
  );
  const labRoutes = labRouteFactory(labController);
  const newsRoutes = newsRouteFactory(newsController);
  const pageRoutes = pageRouteFactory(pageController);
  const reminderRoutes = reminderRouteFactory(reminderController);
  const researchOutputRoutes = researchOutputRouteFactory(
    researchOutputController,
  );
  const researchTagRoutes = researchTagRouteFactory(researchTagController);
  const teamRoutes = teamRouteFactory(interestGroupController, teamController);
  const tutorialRoutes = tutorialRouteFactory(tutorialsController);
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
  app.use(researchTagRoutes);

  // Permission check
  app.use(permissionHandler);

  /**
   * Routes requiring onboarding below
   */
  app.use(analyticsRoutes);
  app.use(calendarRoutes);
  app.use(dashboardRoutes);
  app.use(discoverRoutes);
  app.use(guideRoutes);
  app.use(eventRoutes);
  app.use(interestGroupRoutes);
  app.use(labRoutes);
  app.use(newsRoutes);
  app.use(reminderRoutes);
  app.use(researchOutputRoutes);
  app.use(teamRoutes);
  app.use(tutorialRoutes);
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
  analyticsDataProvider?: AnalyticsContentfulDataProvider;
  analyticsController?: AnalyticsController;
  calendarController?: CalendarController;
  dashboardController?: DashboardController;
  discoverController?: DiscoverController;
  guideController?: GuideController;
  eventController?: EventController;
  interestGroupController?: InterestGroupController;
  labController?: LabController;
  newsController?: NewsController;
  pageController?: PageController;
  reminderController?: ReminderController;
  researchOutputController?: ResearchOutputController;
  researchTagController?: ResearchTagController;
  teamController?: TeamController;
  tutorialsController?: TutorialController;
  userController?: UserController;
  workingGroupController?: WorkingGroupController;
  assetDataProvider?: AssetDataProvider;
  calendarDataProvider?: CalendarDataProvider;
  dashboardDataProvider?: DashboardDataProvider;
  discoverDataProvider?: DiscoverDataProvider;
  guideDataProvider?: GuideDataProvider;
  externalAuthorDataProvider?: ExternalAuthorDataProvider;
  interestGroupDataProvider?: InterestGroupDataProvider;
  labDataProvider?: LabDataProvider;
  newsDataProvider?: NewsDataProvider;
  pageDataProvider?: PageDataProvider;
  reminderDataProvider?: ReminderDataProvider;
  researchOutputDataProvider?: ResearchOutputDataProvider;
  researchTagDataProvider?: ResearchTagDataProvider;
  teamDataProvider?: TeamDataProvider;
  tutorialDataProvider?: TutorialDataProvider;
  userDataProvider?: UserDataProvider;
  eventDataProvider?: EventDataProvider;
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
