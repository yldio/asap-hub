/* istanbul ignore file */
import { connectByCodeHandlerFactory } from '@asap-hub/server-common';
import { framework as lambda } from '@asap-hub/services-common';
import { gp2 as gp2Squidex, SquidexRest } from '@asap-hub/squidex';
import { appName, auth0SharedSecret, baseUrl } from '../../config';
import Users from '../../controllers/user.controller';
import { AssetSquidexDataProvider } from '../../data-providers/asset.data-provider';
import { getUserDataProvider } from '../../dependencies/users.dependencies';
import { getAuthToken } from '../../utils/auth';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';

const userRestClient = new SquidexRest<
  gp2Squidex.RestUser,
  gp2Squidex.InputUser
>(getAuthToken, 'users', {
  appName,
  baseUrl,
});
const userDataProvider = getUserDataProvider();

const assetDataProvider = new AssetSquidexDataProvider(userRestClient);
const users = new Users(userDataProvider, assetDataProvider);
const connectByCodeHandler = connectByCodeHandlerFactory(
  users,
  auth0SharedSecret,
  logger,
);

export const unloggedHandler = lambda.http(connectByCodeHandler);

/* istanbul ignore next */
export const handler = sentryWrapper(unloggedHandler);
