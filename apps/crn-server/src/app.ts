import 'express-async-errors';
import cors from 'cors';
import express, { Express, RequestHandler } from 'express';
import { Tracer } from 'opentracing';
import { Logger } from 'pino';
import pinoHttp from 'pino-http';
import AWSXray from 'aws-xray-sdk';
import * as Sentry from '@sentry/serverless';
import { SquidexGraphql } from '@asap-hub/squidex';

import decodeToken from './utils/validate-token';

import { errorHandlerFactory } from './middleware/error-handler';
import { tracingHandlerFactory } from './middleware/tracing-handler';
import { authHandlerFactory, AuthHandler } from './middleware/auth-handler';

import Groups, { GroupController } from './controllers/groups';
import Users, { UserController } from './controllers/users';
import Teams, { TeamController } from './controllers/teams';
import Events, { EventController } from './controllers/events';
import Dashboard, { DashboardController } from './controllers/dashboard';
import Calendars, { CalendarController } from './controllers/calendars';
import ResearchOutputs, {
  ResearchOutputController,
} from './controllers/research-outputs';

import { dashboardRouteFactory } from './routes/dashboard.route';
import { calendarRouteFactory } from './routes/calendars.route';
import { researchOutputRouteFactory } from './routes/research-outputs.route';
import { teamRouteFactory } from './routes/teams.route';
import { userPublicRouteFactory, userRouteFactory } from './routes/user.route';
import { eventRouteFactory } from './routes/events.route';
import { groupRouteFactory } from './routes/groups.route';
import Pages, { PageController } from './controllers/pages';
import { pageRouteFactory } from './routes/pages.route';
import News, { NewsController } from './controllers/news';
import { newsRouteFactory } from './routes/news.route';
import Discover, { DiscoverController } from './controllers/discover';
import { discoverRouteFactory } from './routes/discover.route';
import pinoLogger, { redaction } from './utils/logger';
import { userLoggerHandler } from './middleware/user-logger-handler';
import { permissionHandler } from './middleware/permission-handler';
import { sentryTransactionIdMiddleware } from './middleware/sentry-transaction-id-handler';
import Labs, { LabsController } from './controllers/labs';
import { labsRouteFactory } from './routes/labs.route';
import ExternalAuthors, {
  ExternalAuthorsController,
} from './controllers/external-authors';
import { externalAuthorsRouteFactory } from './routes/external-authors';

export const appFactory = (libs: Libs = {}): Express => {
  const app = express();

  /**
   * Dependency Injection -->
   */
  // Libs
  const logger = libs.logger || pinoLogger;

  // Middleware
  const httpLogger = pinoHttp({
    logger,
    serializers: redaction,
  });
  const errorHandler = errorHandlerFactory();

  // Clients
  const squidexGraphqlClient = new SquidexGraphql();

  // Controllers
  const calendarController =
    libs.calendarController || new Calendars(squidexGraphqlClient);
  const dashboardController =
    libs.dashboardController || new Dashboard(squidexGraphqlClient);
  const newsController = libs.newsController || new News();
  const discoverController =
    libs.discoverController || new Discover(squidexGraphqlClient);
  const eventController =
    libs.eventController || new Events(squidexGraphqlClient);
  const groupController =
    libs.groupController || new Groups(squidexGraphqlClient);
  const pageController = libs.pageController || new Pages();
  const researchOutputController =
    libs.researchOutputController || new ResearchOutputs(squidexGraphqlClient);
  const teamController = libs.teamController || new Teams(squidexGraphqlClient);
  const userController = libs.userController || new Users(squidexGraphqlClient);
  const labsController = libs.labsController || new Labs(squidexGraphqlClient);
  const externalAuthorsController =
    libs.externalAuthorsController || new ExternalAuthors(squidexGraphqlClient);

  // Handlers
  const authHandler = libs.authHandler || authHandlerFactory(decodeToken);
  const tracingHandler = tracingHandlerFactory(libs.tracer);
  const sentryTransactionIdHandler =
    libs.sentryTransactionIdHandler || sentryTransactionIdMiddleware;

  // Routes
  const calendarRoutes = calendarRouteFactory(calendarController);
  const dashboardRoutes = dashboardRouteFactory(dashboardController);
  const newsRoutes = newsRouteFactory(newsController);
  const discoverRoutes = discoverRouteFactory(discoverController);
  const eventRoutes = eventRouteFactory(eventController);
  const groupRoutes = groupRouteFactory(groupController, eventController);
  const pageRoutes = pageRouteFactory(pageController);
  const researchOutputsRoutes = researchOutputRouteFactory(
    researchOutputController,
  );
  const teamRoutes = teamRouteFactory(groupController, teamController);
  const userRoutes = userRouteFactory(userController, groupController);
  const userPublicRoutes = userPublicRouteFactory(userController);
  const labsRoutes = labsRouteFactory(labsController);
  const externalAuthorsRoutes = externalAuthorsRouteFactory(
    externalAuthorsController,
  );

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
  app.use(newsRoutes);
  app.use(groupRoutes);
  app.use(researchOutputsRoutes);
  app.use(teamRoutes);
  app.use(labsRoutes);
  app.use(externalAuthorsRoutes);

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
  pageController?: PageController;
  newsController?: NewsController;
  researchOutputController?: ResearchOutputController;
  teamController?: TeamController;
  userController?: UserController;
  labsController?: LabsController;
  externalAuthorsController?: ExternalAuthorsController;
  authHandler?: AuthHandler;
  tracer?: Tracer;
  logger?: Logger;
  // extra handlers only for tests and local development
  mockRequestHandlers?: RequestHandler[];
  xRay?: typeof AWSXray;
  sentryErrorHandler?: typeof Sentry.Handlers.errorHandler;
  sentryRequestHandler?: typeof Sentry.Handlers.requestHandler;
  sentryTransactionIdHandler?: RequestHandler;
};
