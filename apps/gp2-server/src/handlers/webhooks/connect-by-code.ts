/* istanbul ignore file */
import { connectByCodeHandlerFactory } from '@asap-hub/server-common';
import { framework as lambda } from '@asap-hub/services-common';
import { auth0SharedSecret } from '../../config';
import Users from '../../controllers/user.controller';
import { getContentfulGraphQLClientFactory } from '../../dependencies/clients.dependency';
import {
  getAssetDataProvider,
  getUserDataProvider,
} from '../../dependencies/user.dependency';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';

const contentfulGraphQLClient = getContentfulGraphQLClientFactory();
const userDataProvider = getUserDataProvider(contentfulGraphQLClient);
const assetDataProvider = getAssetDataProvider();

const users = new Users(userDataProvider, assetDataProvider);
const connectByCodeHandler = connectByCodeHandlerFactory(
  users,
  auth0SharedSecret,
  logger,
);

export const unloggedHandler = lambda.http(connectByCodeHandler);

/* istanbul ignore next */
export const handler = sentryWrapper(unloggedHandler);
