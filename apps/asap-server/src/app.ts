import 'express-async-errors';
import cors from 'cors';
import express, { Express, RequestHandler } from 'express';
import { Tracer } from 'opentracing';
import { Logger } from 'winston';

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
import { userRouteFactory } from './routes/user.route';
import { eventRouteFactory } from './routes/events.route';
import { groupRouteFactory } from './routes/groups.route';
import Pages, { PageController } from './controllers/pages';
import { pageRouteFactory } from './routes/pages.route';
import NewsAndEvents, {
  NewsAndEventsController,
} from './controllers/news-and-events';
import { newsAndEventsRouteFactory } from './routes/news-and-events.route';
import Discover, { DiscoverController } from './controllers/discover';
import { discoverRouteFactory } from './routes/discover.route';
import { loggerFactory } from './utils/logger';

export const appFactory = (libs: Libs = {}): Express => {
  const app = express();

  /**
   * Dependency Injection -->
   */
  // Libs
  const logger = libs.logger || loggerFactory();

  // Middleware
  const errorHandler = errorHandlerFactory(logger);

  // Controllers
  const calendarController = libs.calendarController || new Calendars(logger);
  const dashboardController = libs.dashboardController || new Dashboard();
  const newsAndEventsController =
    libs.newsAndEventsController || new NewsAndEvents();
  const discoverController = libs.discoverController || new Discover();
  const eventController = libs.eventController || new Events();
  const groupController = libs.groupController || new Groups();
  const pageController = libs.pageController || new Pages();
  const researchOutputController =
    libs.researchOutputController || new ResearchOutputs();
  const teamController = libs.teamController || new Teams();
  const userController = libs.userController || new Users();

  // Handlers
  const authHandler = libs.authHandler || authHandlerFactory(decodeToken);
  const tracingHandler = tracingHandlerFactory(libs.tracer);

  // Routes
  const calendarRoutes = calendarRouteFactory(calendarController);
  const dashboardRoutes = dashboardRouteFactory(dashboardController);
  const newsAndEventsRoutes = newsAndEventsRouteFactory(
    newsAndEventsController,
  );
  const discoverRoutes = discoverRouteFactory(discoverController);
  const eventRoutes = eventRouteFactory(eventController);
  const groupRoutes = groupRouteFactory(groupController, eventController);
  const pageRoutes = pageRouteFactory(pageController);
  const researchOutputsRoutes = researchOutputRouteFactory(
    researchOutputController,
  );
  const teamRoutes = teamRouteFactory(groupController, teamController);
  const userRoutes = userRouteFactory(userController, groupController);

  /**
   * --- end of dependency inection
   */

  app.use(tracingHandler);
  app.use(cors());
  app.use(express.json());

  /**
   * Public routes --->
   */
  app.use(pageRoutes);

  /**
   * --- end of public routes
   */

  // Auth
  app.use(authHandler);

  /**
   * Routes requiring authorisation below
   */
  if (libs.mockRequestHandlers) {
    app.use(libs.mockRequestHandlers);
  }

  app.use(calendarRoutes);
  app.use(dashboardRoutes);
  app.use(discoverRoutes);
  app.use(eventRoutes);
  app.use(newsAndEventsRoutes);
  app.use(groupRoutes);
  app.use(researchOutputsRoutes);
  app.use(teamRoutes);
  app.use(userRoutes);

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
  calendarController?: CalendarController;
  dashboardController?: DashboardController;
  discoverController?: DiscoverController;
  eventController?: EventController;
  groupController?: GroupController;
  pageController?: PageController;
  newsAndEventsController?: NewsAndEventsController;
  researchOutputController?: ResearchOutputController;
  teamController?: TeamController;
  userController?: UserController;
  authHandler?: AuthHandler;
  tracer?: Tracer;
  // extra handlers only for tests and local development
  mockRequestHandlers?: RequestHandler[];
  logger?: Logger;
};
