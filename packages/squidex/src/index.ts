import config from './config';
import createClient, { getAccessTokenFactory } from './auth';
import { SquidexGraphql as SquidexGraphqlNoAuth } from './graphql';
import { Squidex as SquidexRestNoAuth } from './rest';

export { config };
export * from './entities';
export { SquidexGraphqlError } from './graphql';
export type { SquidexGraphqlClient } from './graphql';
export type { SquidexRestClient, Query, Results } from './rest';

const getAuthToken = getAccessTokenFactory();
export class SquidexGraphql extends SquidexGraphqlNoAuth {
  constructor() {
    super(getAuthToken);
  }
}

export class SquidexRest<
  T extends { id: string; data: Record<string, unknown> },
  C extends { id: string; data: Record<string, unknown> } = T,
> extends SquidexRestNoAuth<T, C> {
  constructor(
    collection: string,
    options?: Parameters<typeof createClient>[1],
  ) {
    super(collection, getAuthToken, options);
  }
}
