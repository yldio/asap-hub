/* istanbul ignore file */
import { algoliaSearchClientNativeFactory } from '@asap-hub/algolia';
import { SquidexGraphql } from '@asap-hub/squidex';
import { algoliaApiKey, algoliaAppId } from '../../../config';
import Users from '../../../controllers/users';
import AssetDataProvider from '../../../data-providers/assets';
import UserDataProvider from '../../../data-providers/users';
import { Handler } from '../../../utils/types';
import { fetchUserByCodeHandlerFactory } from './fetch-by-code';

const squidexGraphqlClient = new SquidexGraphql();
const userDataProvider = new UserDataProvider(squidexGraphqlClient);
const assetDataProvider = new AssetDataProvider();
export const handler: Handler = fetchUserByCodeHandlerFactory(
  new Users(userDataProvider, assetDataProvider),
  algoliaSearchClientNativeFactory({ algoliaAppId, algoliaApiKey }),
);
