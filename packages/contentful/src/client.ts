/* eslint-disable max-classes-per-file */
import { createClient as createCDAClient } from 'contentful';
import {
  createClient,
  Environment,
  MakeRequestOptions,
  RestAdapter,
} from 'contentful-management';
import { RateLimiter } from 'limiter';
import { GraphQLClient } from 'graphql-request';

export type { MakeRequestOptions } from 'contentful-management';
export { RestAdapter } from 'contentful-management';

const cache = new Map<string, Environment>();

export const contentfulManagementApiRateLimiter = new RateLimiter({
  tokensPerInterval: 3,
  interval: 'second',
});

export const contentDeliveryApiRateLimiter = new RateLimiter({
  tokensPerInterval: 15,
  interval: 'second',
});

export class RateLimitedRestAdapter extends RestAdapter {
  async makeRequest<R>(options: MakeRequestOptions): Promise<R> {
    await contentfulManagementApiRateLimiter.removeTokens(1);
    return super.makeRequest(options);
  }
}

export class RateLimitedGraphqlClient extends GraphQLClient {
  request = (async (
    ...args: Parameters<GraphQLClient['request']>
  ): Promise<ReturnType<GraphQLClient['request']>> => {
    await contentDeliveryApiRateLimiter.removeTokens(1);
    return super.request(...args);
  }) as GraphQLClient['request'];
}

export type CreateClientParams = {
  space: string;
  environment: string;
  accessToken: string;
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
  new RateLimitedGraphqlClient(
    `https://graphql.contentful.com/content/v1/spaces/${space}/environments/${environment}`,
    {
      errorPolicy: 'ignore',
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    },
  ) as GraphQLClient;

export const getRestClient = async ({
  space: spaceId,
  accessToken,
  environment: environmentId,
}: CreateClientParams): Promise<Environment> => {
  const key = `${accessToken}-${spaceId}-${environmentId}`;
  const cached = cache.get(key);
  if (cached) {
    return cached;
  }
  const client = createClient({
    apiAdapter: new RateLimitedRestAdapter({
      accessToken,
    }),
  });

  const space = await client.getSpace(spaceId);
  const environment = await space.getEnvironment(environmentId);
  cache.set(key, environment);
  return environment;
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
