/* istanbul ignore file */
import { algoliaSearchClientNativeFactory } from '@asap-hub/algolia';
import { SquidexGraphql } from '@asap-hub/squidex';
import { algoliaAppId, algoliaApiKey } from '../../../config';
import Users from '../../../controllers/users';
import { Handler } from '../../../utils/types';
import { fetchUserByCodeHandlerFactory } from './fetch-by-code';

export const handler: Handler = fetchUserByCodeHandlerFactory(
  new Users(new SquidexGraphql()),
  algoliaSearchClientNativeFactory({ algoliaAppId, algoliaApiKey }),
);
