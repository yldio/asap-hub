/* istanbul ignore file */
import { algoliaSearchClientNative } from '@asap-hub/algolia';
import { SquidexGraphql } from '@asap-hub/squidex';
import Users from '../../../controllers/users';
import { Handler } from '../../../utils/types';
import { fetchUserByCodeHandlerFactory } from './fetch-by-code';

export const handler: Handler = fetchUserByCodeHandlerFactory(
  new Users(new SquidexGraphql()),
  algoliaSearchClientNative,
);
