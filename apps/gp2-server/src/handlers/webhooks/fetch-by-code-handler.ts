/* istanbul ignore file */
import { algoliaSearchClientNativeFactory } from '@asap-hub/algolia';
import { algoliaApiKey, algoliaAppId } from '../../config';
import UserController from '../../controllers/user.controller';
import { getContentfulGraphQLClientFactory } from '../../dependencies/clients.dependency';
import {
  getAssetDataProvider,
  getUserDataProvider,
} from '../../dependencies/user.dependency';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import { fetchUserByCodeHandlerFactory } from './fetch-by-code';

const contentfulGraphQLClient = getContentfulGraphQLClientFactory();
const userDataProvider = getUserDataProvider(contentfulGraphQLClient);
const assetDataProvider = getAssetDataProvider();

export const handler = sentryWrapper(
  fetchUserByCodeHandlerFactory(
    new UserController(userDataProvider, assetDataProvider),
    algoliaSearchClientNativeFactory({ algoliaAppId, algoliaApiKey }),
  ),
);
