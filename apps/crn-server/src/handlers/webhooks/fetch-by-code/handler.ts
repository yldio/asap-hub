/* istanbul ignore file */
import { algoliaSearchClientNativeFactory } from '@asap-hub/algolia';
import { RestUser, SquidexGraphql, SquidexRest } from '@asap-hub/squidex';
import { algoliaApiKey, algoliaAppId, appName, baseUrl } from '../../../config';
import Users from '../../../controllers/users';
import AssetDataProvider from '../../../data-providers/assets.data-provider';
import UserDataProvider from '../../../data-providers/users.data-provider';
import { getAuthToken } from '../../../utils/auth';
import { Handler } from '../../../utils/types';
import { fetchUserByCodeHandlerFactory } from './fetch-by-code';

const squidexGraphqlClient = new SquidexGraphql(getAuthToken, {
  appName,
  baseUrl,
});
const userRestClient = new SquidexRest<RestUser>(getAuthToken, 'users', {
  appName,
  baseUrl,
});
const userDataProvider = new UserDataProvider(
  squidexGraphqlClient,
  userRestClient,
);
const assetDataProvider = new AssetDataProvider(userRestClient);
export const handler: Handler = fetchUserByCodeHandlerFactory(
  new Users(userDataProvider, assetDataProvider),
  algoliaSearchClientNativeFactory({ algoliaAppId, algoliaApiKey }),
);
