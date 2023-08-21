import { createClient as createCDAClient } from 'contentful';
import {
  Adapter,
  createClient,
  Environment,
  RestAdapter,
  ClientParams,
  MakeRequestOptions,
} from 'contentful-management';
import { GraphQLClient } from 'graphql-request';
import { RateLimiter, RateLimiterOpts } from 'limiter';

export type { MakeRequestOptions } from 'contentful-management';
export { RestAdapter } from 'contentful-management';

const cache = new Map<string, Environment>();

export type CreateClientParams = {
  space: string;
  environment: string;
  accessToken: string;
  apiAdapter?: Adapter;
};

type CreatePreviewClientParams = {
  space: string;
  previewAccessToken: string;
  environment: string;
};
export const getGraphQLClient = ({
  space,
  accessToken,
  environment,
}: CreateClientParams) =>
  new GraphQLClient(
    `https://graphql.contentful.com/content/v1/spaces/${space}/environments/${environment}`,
    {
      errorPolicy: 'ignore',
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    },
  );

class RateLimitedRestAdapter extends RestAdapter {
  private readonly rateLimiter;
  constructor(params: ClientParams & { rateLimiter: RateLimiter }) {
    super(params);
    this.rateLimiter = params.rateLimiter;
  }
  async makeRequest<R>(options: MakeRequestOptions): Promise<R> {
    await this.rateLimiter.removeTokens(1);
    return super.makeRequest(options);
  }
}

export const getRestClient = async ({
  space: spaceId,
  accessToken,
  environment: environmentId,
  apiAdapter,
}: CreateClientParams): Promise<Environment> => {
  const key = `${accessToken}-${spaceId}-${environmentId}`;
  const cached = cache.get(key);
  if (cached) {
    return cached;
  }
  const client = createClient(
    apiAdapter
      ? {
          apiAdapter,
        }
      : {
          accessToken,
        },
  );
  const space = await client.getSpace(spaceId);
  const environment = await space.getEnvironment(environmentId);
  cache.set(key, environment);
  return environment;
};

export const getRateLimitedClient = async ({
  space: spaceId,
  accessToken,
  environment: environmentId,
  rateLimit,
}: CreateClientParams & {
  rateLimit: number | RateLimiterOpts;
}): Promise<Environment> => {
  const rateLimiterOpts: RateLimiterOpts =
    typeof rateLimit === 'number'
      ? { tokensPerInterval: rateLimit, interval: 'second' }
      : rateLimit;
  const rateLimiter = new RateLimiter(rateLimiterOpts);
  const apiAdapter = new RateLimitedRestAdapter({ accessToken, rateLimiter });
  return getRestClient({
    space: spaceId,
    accessToken,
    apiAdapter,
    environment: environmentId,
  });
};

export const getCDAClient = ({
  space,
  accessToken,
  environment,
}: CreateClientParams) =>
  createCDAClient({
    space,
    accessToken,
    environment,
  });

export const getCPAClient = ({
  space,
  previewAccessToken,
  environment,
}: CreatePreviewClientParams) =>
  createCDAClient({
    space,
    accessToken: previewAccessToken,
    environment,
    host: 'preview.contentful.com',
  });
