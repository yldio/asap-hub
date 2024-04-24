import cors from 'cors';
import express, { Express, Router } from 'express';
import {
  getBasicHttpLogger,
  Logger,
  sentryTransactionIdMiddleware,
} from '@asap-hub/server-common';
import OutputController from './controllers/output.controller';
import {
  ExternalUserDataProvider,
  OutputDataProvider,
} from './data-providers/types';
import pinoLogger from './utils/logger';
import { OutputContentfulDataProvider } from './data-providers/output.data-provider';
import {
  getContentfulGraphQLClientFactory,
  getContentfulRestClientFactory,
} from './dependencies/clients.dependency';
import { ExternalUserContentfulDataProvider } from './data-providers/external-user.data-provider';
import { outputRouteFactory } from './routes/public/output.route';

export const publicAppFactory = (
  dependencies: PublicAppDependencies = {},
): Express => {
  const app = express();

  app.use(getBasicHttpLogger({ logger: dependencies.logger || pinoLogger }));
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
  const outputController =
    dependencies.outputController ||
    new OutputController(outputDataProvider, externalUserDataProvider);

  const basicRoutes = Router();

  // add healthcheck route
  basicRoutes.get('/healthcheck', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  const outputRoutes = outputRouteFactory(outputController);

  // add routes
  app.use('/public', [basicRoutes, outputRoutes]);

  // Catch all
  app.get('*', async (_req, res) => {
    res.status(404).json({
      statusCode: 404,
      error: 'Not Found',
      message: 'Not Found',
    });
  });

  return app;
};

type PublicAppDependencies = {
  logger?: Logger;
  outputController?: OutputController;
  outputDataProvider?: OutputDataProvider;
  externalUserDataProvider?: ExternalUserDataProvider;
};
