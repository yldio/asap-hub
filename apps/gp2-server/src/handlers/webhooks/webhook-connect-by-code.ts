/* istanbul ignore file */
// ignore this file for coverage since we don't have the requirements yet to test it
import { connectByCodeHandlerFactory } from '@asap-hub/server-common';
import { framework as lambda } from '@asap-hub/services-common';
import { RestUser, SquidexGraphql, SquidexRest } from '@asap-hub/squidex';
import { appName, auth0SharedSecret, baseUrl } from '../../config';
import Users from '../../controllers/user.controller';
import { UserSquidexDataProvider } from '../../data-providers/user.data-provider';
import { getAuthToken } from '../../utils/auth';
import { sentryWrapper } from '../../utils/sentry-wrapper';

const squidexGraphqlClient = new SquidexGraphql(getAuthToken, {
  appName,
  baseUrl,
});
const userRestClient = new SquidexRest<RestUser>(getAuthToken, 'users', {
  appName,
  baseUrl,
});
const userDataProvider = new UserSquidexDataProvider(
  squidexGraphqlClient,
  userRestClient,
);
const users = new Users(userDataProvider);
const connectByCodeHandler = connectByCodeHandlerFactory(
  users,
  auth0SharedSecret,
);

export const rawHandler = lambda.http(connectByCodeHandler);

/* istanbul ignore next */
export const handler = sentryWrapper(rawHandler);
