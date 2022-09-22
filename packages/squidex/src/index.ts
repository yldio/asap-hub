import createClient, { GetAccessToken, SquidexConfig } from './auth';
import { SquidexGraphql as SquidexGraphqlNoAuth } from './graphql';
import { Squidex as SquidexRestNoAuth } from './rest';

export { getAccessTokenFactory } from './auth';
export * from './utils';
export * from './entities';
export { SquidexGraphqlError } from './graphql';
export type { SquidexGraphqlClient } from './graphql';
export type {
  SquidexRestClient,
  Query,
  Results,
  Filter,
  LogicalFilter,
} from './rest';

export class SquidexGraphql extends SquidexGraphqlNoAuth {
  constructor(
    getAuthToken: GetAccessToken,
    config: Pick<SquidexConfig, 'baseUrl' | 'appName'>,
  ) {
    super(getAuthToken, config);
  }
}

export class SquidexRest<
  T extends { id: string; data: Record<string, unknown> },
  C extends { id: string; data: Record<string, unknown> } = T,
> extends SquidexRestNoAuth<T, C> {
  constructor(
    getAuthToken: GetAccessToken,
    collection: string,
    config: Pick<SquidexConfig, 'baseUrl' | 'appName'>,
    options?: Parameters<typeof createClient>[2],
  ) {
    super(getAuthToken, collection, config, options);
  }
}
