import * as Sentry from '@sentry/serverless';
import cors from 'cors';
import express, { Express, RequestHandler, Router } from 'express';
import 'express-async-errors';
import { middleware as cacheMiddleware } from 'apicache';
import {
  errorHandlerFactory,
  getHttpLogger,
  Logger,
  sentryTransactionIdMiddleware,
  shouldHandleError,
} from '@asap-hub/server-common';
import OutputController from './controllers/output.controller';
import {
  ExternalUserDataProvider,
  OutputDataProvider,
  UserDataProvider,
} from './data-providers/types';
import pinoLogger from './utils/logger';
import { OutputContentfulDataProvider } from './data-providers/output.data-provider';
import {
  getContentfulGraphQLClientFactory,
  getContentfulRestClientFactory,
} from './dependencies/clients.dependency';
import { ExternalUserContentfulDataProvider } from './data-providers/external-user.data-provider';
import { outputRouteFactory } from './routes/public/output.route';
import UserController from './controllers/user.controller';
import { userRouteFactory } from './routes/public/user.route';
import { UserContentfulDataProvider } from './data-providers/user.data-provider';
import { AssetContentfulDataProvider } from './data-providers/asset.data-provider';
import WorkingGroupController from './controllers/working-group.controller';
import { workingGroupRouteFactory } from './routes/public/working-group.route';
import { WorkingGroupContentfulDataProvider } from './data-providers/working-group.data-provider';

export const publicAppFactory = (
  dependencies: PublicAppDependencies = {},
): Express => {
  const app = express();

  const errorHandler = errorHandlerFactory();
  const sentryTransactionIdHandler =
    dependencies.sentryTransactionIdHandler || sentryTransactionIdMiddleware;

  /* istanbul ignore next */
  if (dependencies.sentryRequestHandler) {
    app.use(dependencies.sentryRequestHandler());
  }
  app.use(getHttpLogger({ logger: dependencies.logger || pinoLogger }));
  app.use(sentryTransactionIdHandler);
  app.use(sentryTransactionIdMiddleware);
  app.use(cors());

  // Resolve dependencies
  const contentfulGraphQLClient = getContentfulGraphQLClientFactory();

  const outputDataProvider =
    dependencies.outputDataProvider ||
    new OutputContentfulDataProvider(
      contentfulGraphQLClient,
      getContentfulRestClientFactory,
    );
  const externalUserDataProvider =
    dependencies.externalUserDataProvider ||
    new ExternalUserContentfulDataProvider(
      contentfulGraphQLClient,
      getContentfulRestClientFactory,
    );
  const userDataProvider =
    dependencies.userDataProvider ||
    new UserContentfulDataProvider(
      contentfulGraphQLClient,
      getContentfulRestClientFactory,
    );
  const assetDataProvider = new AssetContentfulDataProvider(
    getContentfulRestClientFactory,
  );
  const workingGroupDataProvider = new WorkingGroupContentfulDataProvider(
    contentfulGraphQLClient,
    getContentfulRestClientFactory,
  );

  const userController =
    dependencies.userController ||
    new UserController(userDataProvider, assetDataProvider);
  const outputController =
    dependencies.outputController ||
    new OutputController(outputDataProvider, externalUserDataProvider);
  const workingGroupController =
    dependencies.workingGroupController ||
    new WorkingGroupController(workingGroupDataProvider);

  const basicRoutes = Router();

  // add healthcheck route
  basicRoutes.get('/healthcheck', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  const outputRoutes = outputRouteFactory(outputController);
  const userRoutes = userRouteFactory(userController);
  const workingGroupRoutes = workingGroupRouteFactory(workingGroupController);

  // add routes
  app.use(
    '/public',
    dependencies.cacheMiddleware || cacheMiddleware('1 hour'),
    [basicRoutes, outputRoutes, userRoutes, workingGroupRoutes],
  );

  // Catch all
  app.get('*', async (_req, res) => {
    res.status(404).json({
      statusCode: 404,
      error: 'Not Found',
      message: 'Not Found',
    });
  });

  /* istanbul ignore next */
  if (dependencies.sentryErrorHandler) {
    app.use(dependencies.sentryErrorHandler({ shouldHandleError }));
  }

  app.use(errorHandler);
  app.disable('x-powered-by');

  return app;
};

type PublicAppDependencies = {
  logger?: Logger;
  outputController?: OutputController;
  outputDataProvider?: OutputDataProvider;
  userDataProvider?: UserDataProvider;
  userController?: UserController;
  externalUserDataProvider?: ExternalUserDataProvider;
  workingGroupController?: WorkingGroupController;
  sentryErrorHandler?: typeof Sentry.Handlers.errorHandler;
  sentryRequestHandler?: typeof Sentry.Handlers.requestHandler;
  sentryTransactionIdHandler?: RequestHandler;
  cacheMiddleware?: RequestHandler;
};
