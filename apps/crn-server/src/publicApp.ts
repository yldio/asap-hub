import { getGraphQLClient as getContentfulGraphQLClient } from '@asap-hub/contentful';
import {
  errorHandlerFactory,
  getHttpLogger,
  Logger,
  sentryTransactionIdMiddleware,
  shouldHandleError,
} from '@asap-hub/server-common';
import * as Sentry from '@sentry/serverless';
import cors from 'cors';
import express, { Express, RequestHandler, Router } from 'express';
import 'express-async-errors';
import {
  contentfulAccessToken,
  contentfulEnvId,
  contentfulPreviewAccessToken,
  contentfulSpaceId,
} from './config';
import ResearchOutputController from './controllers/research-output.controller';
import UserController from './controllers/user.controller';
import { AssetContentfulDataProvider } from './data-providers/contentful/asset.data-provider';
import { ExternalAuthorContentfulDataProvider } from './data-providers/contentful/external-author.data-provider';
import { GenerativeContentDataProvider } from './data-providers/contentful/generative-content.data-provider';
import { ResearchOutputContentfulDataProvider } from './data-providers/contentful/research-output.data-provider';
import { ResearchTagContentfulDataProvider } from './data-providers/contentful/research-tag.data-provider';
import { UserContentfulDataProvider } from './data-providers/contentful/user.data-provider';
import {
  ResearchOutputDataProvider,
  ResearchTagDataProvider,
  UserDataProvider,
} from './data-providers/types';
import { ExternalAuthorDataProvider } from './data-providers/types/external-authors.data-provider.types';
import { getContentfulRestClientFactory } from './dependencies/clients.dependencies';
import { researchOutputRouteFactory } from './routes/public/research-output.route';
import { userRouteFactory } from './routes/public/user.route';
import pinoLogger from './utils/logger';

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

  const researchOutputDataProvider =
    dependencies.researchOutputDataProvider ||
    new ResearchOutputContentfulDataProvider(
      contentfulGraphQLClient,
      contentfulPreviewGraphQLClient,
      getContentfulRestClientFactory,
    );

  const researchTagDataProvider =
    dependencies.researchTagDataProvider ||
    new ResearchTagContentfulDataProvider(
      contentfulGraphQLClient,
      getContentfulRestClientFactory,
    );

  const externalAuthorDataProvider =
    dependencies.externalAuthorDataProvider ||
    new ExternalAuthorContentfulDataProvider(
      contentfulGraphQLClient,
      getContentfulRestClientFactory,
    );

  const generativeContentDataProvider = new GenerativeContentDataProvider();

  const userDataProvider =
    dependencies.userDataProvider ||
    new UserContentfulDataProvider(
      contentfulGraphQLClient,
      getContentfulRestClientFactory,
    );

  const assetDataProvider = new AssetContentfulDataProvider(
    getContentfulRestClientFactory,
  );

  const researchOutputController =
    dependencies.researchOutputController ||
    new ResearchOutputController(
      researchOutputDataProvider,
      researchTagDataProvider,
      externalAuthorDataProvider,
      generativeContentDataProvider,
    );

  const userController =
    dependencies.userController ||
    new UserController(
      userDataProvider,
      assetDataProvider,
      researchTagDataProvider,
    );

  const basicRoutes = Router();

  // add healthcheck route
  basicRoutes.get('/healthcheck', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  const researchOutputRoutes = researchOutputRouteFactory(
    researchOutputController,
  );

  const userRoutes = userRouteFactory(userController);

  // add routes
  app.use('/public', [basicRoutes, researchOutputRoutes, userRoutes]);

  // Catch all
  app.get('/public/*', async (_req, res) => {
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
  externalAuthorDataProvider?: ExternalAuthorDataProvider;
  logger?: Logger;
  researchOutputController?: ResearchOutputController;
  researchOutputDataProvider?: ResearchOutputDataProvider;
  researchTagDataProvider?: ResearchTagDataProvider;
  userDataProvider?: UserDataProvider;
  userController?: UserController;
  sentryErrorHandler?: typeof Sentry.Handlers.errorHandler;
  sentryRequestHandler?: typeof Sentry.Handlers.requestHandler;
  sentryTransactionIdHandler?: RequestHandler;
};
