/* istanbul ignore file */
import { algoliaSearchClientNativeFactory } from '@asap-hub/algolia';
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
import { sentryWrapper } from '../../../utils/sentry-wrapper';
import { Handler } from 'aws-lambda/handler';

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

export const handler: Handler = sentryWrapper(
  fetchUserByCodeHandlerFactory(
    new Users(userDataProvider, assetDataProvider),
    algoliaSearchClientNativeFactory({ algoliaAppId, algoliaApiKey }),
  ),
);
