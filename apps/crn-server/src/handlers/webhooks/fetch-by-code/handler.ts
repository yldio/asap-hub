/* istanbul ignore file */
import { algoliaSearchClientNativeFactory } from '@asap-hub/algolia';
import { framework as lambda } from '@asap-hub/services-common';
import {
  InputUser,
  RestUser,
  SquidexGraphql,
  SquidexRest,
} from '@asap-hub/squidex';
import { algoliaApiKey, algoliaAppId, appName, baseUrl } from '../../../config';
import Users from '../../../controllers/users';
import { AssetSquidexDataProvider } from '../../../data-providers/assets.data-provider';
import { UserSquidexDataProvider } from '../../../data-providers/users.data-provider';
import { getAuthToken } from '../../../utils/auth';
import { fetchUserByCodeHandlerFactory } from './fetch-by-code';

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
export const handler: lambda.Handler = fetchUserByCodeHandlerFactory(
  new Users(userDataProvider, assetDataProvider),
  algoliaSearchClientNativeFactory({ algoliaAppId, algoliaApiKey }),
);
