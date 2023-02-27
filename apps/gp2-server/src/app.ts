import { gp2 } from '@asap-hub/model';
import {
  AuthHandler,
  authHandlerFactory,
  decodeTokenFactory,
  errorHandlerFactory,
  EventController,
  getHttpLogger,
  Logger,
  MemoryCacheClient,
} from '@asap-hub/server-common';
import {
  getAccessTokenFactory,
  gp2 as gp2Squidex,
  InputCalendar,
  RestCalendar,
  RestEvent,
  RestExternalAuthor,
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
import Calendars, {
  CalendarController,
} from './controllers/calendar.controller';
import ContributingCohorts, {
  ContributingCohortController,
} from './controllers/contributing-cohort.controller';
import Events from './controllers/event.controller';
import News, { NewsController } from './controllers/news.controller';
import Outputs, { OutputController } from './controllers/output.controller';
import Projects, { ProjectController } from './controllers/project.controller';
import Users, { UserController } from './controllers/user.controller';
import WorkingGroupNetwork, {
  WorkingGroupNetworkController,
} from './controllers/working-group-network.controller';
import WorkingGroups, {
  WorkingGroupController,
} from './controllers/working-group.controller';
import {
  AssetDataProvider,
  AssetSquidexDataProvider,
} from './data-providers/asset.data-provider';
import {
  CalendarDataProvider,
  CalendarSquidexDataProvider,
} from './data-providers/calendar.data-provider';
import {
  ContributingCohortDataProvider,
  ContributingCohortSquidexDataProvider,
} from './data-providers/contributing-cohort.data-provider';
import {
  EventDataProvider,
  EventSquidexDataProvider,
} from './data-providers/event.data-provider';
import {
  ExternalAuthorDataProvider,
  ExternalAuthorSquidexDataProvider,
} from './data-providers/external-authors.data-provider';
import {
  NewsDataProvider,
  NewsSquidexDataProvider,
} from './data-providers/news.data-provider';
import {
  OutputDataProvider,
  OutputSquidexDataProvider,
} from './data-providers/output.data-provider';
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
import { calendarRouteFactory } from './routes/calendar.route';
import { contributingCohortRouteFactory } from './routes/contributing-cohort.route';
import { eventRouteFactory } from './routes/event.route';
import { newsRouteFactory } from './routes/news.route';
import { outputRouteFactory } from './routes/output.route';
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
  app.use(express.json({ limit: '10MB' }));

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
  const externalAuthorRestClient = new SquidexRest<RestExternalAuthor>(
    getAuthToken,
    'external-authors',
    {
      appName,
      baseUrl,
    },
  );
  const decodeToken = decodeTokenFactory(auth0Audience);
  const userResponseCacheClient = new MemoryCacheClient<gp2.UserResponse>();

  // Data Providers
  const assetDataProvider =
    libs.assetDataProvider || new AssetSquidexDataProvider(userRestClient);
  const contributingCohortDataProvider =
    libs.contributingCohortDataProvider ||
    new ContributingCohortSquidexDataProvider(
      squidexGraphqlClient,
      contributingCohortRestClient,
    );
  const userDataProvider =
    libs.userDataProvider ||
    new UserSquidexDataProvider(squidexGraphqlClient, userRestClient);
  const newsDataProvider =
    libs.newsDataProvider || new NewsSquidexDataProvider(squidexGraphqlClient);
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

  const externalAuthorDataProvider =
    libs.externalAuthorDataProvider ||
    new ExternalAuthorSquidexDataProvider(externalAuthorRestClient);
  // Controllers

  const workingGroupController =
    libs.workingGroupController || new WorkingGroups(workingGroupDataProvider);
  const workingGroupNetworkController =
    libs.workingGroupNetworkController ||
    new WorkingGroupNetwork(workingGroupNetworkDataProvider);
  const projectController =
    libs.projectController || new Projects(projectDataProvider);
  const newsController = libs.newsController || new News(newsDataProvider);
  const eventController = libs.eventController || new Events(eventDataProvider);
  const calendarController =
    libs.calendarController || new Calendars(calendarDataProvider);
  const outputController =
    libs.outputController ||
    new Outputs(outputDataProvider, externalAuthorDataProvider);
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

  // Routes
  const userPublicRoutes = userPublicRouteFactory(userController);
  const userRoutes = userRouteFactory(userController);
  const newsRoutes = newsRouteFactory(newsController);
  const contributingCohortRoutes = contributingCohortRouteFactory(
    contributingCohortController,
  );
  const workingGroupRoutes = workingGroupRouteFactory(workingGroupController);
  const workingGroupNetworkRoutes = workingGroupNetworkRouteFactory(
    workingGroupNetworkController,
  );
  const projectRoutes = projectRouteFactory(projectController);
  const eventRoutes = eventRouteFactory(eventController);
  const calendarRoutes = calendarRouteFactory(calendarController);
  const outputRoutes = outputRouteFactory(outputController);
  app.use(userPublicRoutes);
  // Auth
  app.use(authHandler);

  /**
   * Routes requiring onboarding below
   */
  app.use(userRoutes);
  app.use(contributingCohortRoutes);
  app.use(newsRoutes);
  app.use(workingGroupRoutes);
  app.use(workingGroupNetworkRoutes);
  app.use(projectRoutes);
  app.use(eventRoutes);
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

  app.use(errorHandler);
  app.disable('x-powered-by');

  return app;
};

export type Libs = {
  assetDataProvider?: AssetDataProvider;
  authHandler?: AuthHandler;
  calendarController?: CalendarController;
  calendarDataProvider?: CalendarDataProvider;
  contributingCohortController?: ContributingCohortController;
  contributingCohortDataProvider?: ContributingCohortDataProvider;
  eventController?: EventController<
    gp2.EventResponse,
    gp2.ListEventResponse,
    gp2.EventCreateRequest,
    gp2.EventUpdateRequest
  >;
  eventDataProvider?: EventDataProvider;
  externalAuthorDataProvider?: ExternalAuthorDataProvider;
  logger?: Logger;
  newsController?: NewsController;
  newsDataProvider?: NewsDataProvider;
  outputController?: OutputController;
  outputDataProvider?: OutputDataProvider;
  projectController?: ProjectController;
  projectDataProvider?: ProjectDataProvider;
  userController?: UserController;
  userDataProvider?: UserDataProvider;
  workingGroupController?: WorkingGroupController;
  workingGroupDataProvider?: WorkingGroupDataProvider;
  workingGroupNetworkController?: WorkingGroupNetworkController;
  workingGroupNetworkDataProvider?: WorkingGroupNetworkDataProvider;
};
