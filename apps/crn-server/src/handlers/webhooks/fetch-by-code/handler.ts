/* istanbul ignore file */
import { algoliaSearchClientNativeFactory } from '@asap-hub/algolia';
import { Handler } from 'aws-lambda/handler';
import { algoliaApiKey, algoliaAppId } from '../../../config';
import Users from '../../../controllers/users.controller';
import { fetchUserByCodeHandlerFactory } from './fetch-by-code';
import { sentryWrapper } from '../../../utils/sentry-wrapper';
import {
  getUserDataProvider,
  getAssetDataProvider,
} from '../../../dependencies/users.dependencies';

export const handler: Handler = sentryWrapper(
  fetchUserByCodeHandlerFactory(
    new Users(getUserDataProvider(), getAssetDataProvider()),
    algoliaSearchClientNativeFactory({ algoliaAppId, algoliaApiKey }),
  ),
);
