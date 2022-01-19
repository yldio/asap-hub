/* istanbul ignore file */
import { SquidexGraphql } from '@asap-hub/squidex';
import { algoliasearch } from '@asap-hub/algolia';
import { algoliaAppId, algoliaSearchApiKey } from '../../../config';
import Users from '../../../controllers/users';
import { Handler } from '../../../utils/types';
import { fetchUserByCodeHandlerFactory } from './fetch-by-code';

export const handler: Handler = fetchUserByCodeHandlerFactory(
  new Users(new SquidexGraphql()),
  algoliasearch(algoliaAppId, algoliaSearchApiKey),
);
