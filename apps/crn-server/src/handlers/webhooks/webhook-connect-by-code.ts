import { connectByCodeHandlerFactory } from '@asap-hub/server-common';
import { framework as lambda } from '@asap-hub/services-common';
import {
  InputUser,
  RestUser,
  SquidexGraphql,
  SquidexRest,
} from '@asap-hub/squidex';
import { appName, auth0SharedSecret, baseUrl } from '../../config';
import Users from '../../controllers/users';
import { AssetSquidexDataProvider } from '../../data-providers/assets.data-provider';
import { UserSquidexDataProvider } from '../../data-providers/users.data-provider';
import { getAuthToken } from '../../utils/auth';

const squidexGraphqlClient = new SquidexGraphql(getAuthToken, {
  appName,
  baseUrl,
});
const userRestClient = new SquidexRest<RestUser, InputUser>(
  getAuthToken,
  'users',
  {
    appName,
    baseUrl,
  },
);
const userDataProvider = new UserSquidexDataProvider(
  squidexGraphqlClient,
  userRestClient,
);
const assetDataProvider = new AssetSquidexDataProvider(userRestClient);
const users = new Users(userDataProvider, assetDataProvider);
const connectByCodeHandler = connectByCodeHandlerFactory(
  users,
  auth0SharedSecret,
);

export const handler: lambda.Handler = lambda.http(connectByCodeHandler);
