import { createClient as createCDAClient } from 'contentful';
import { createClient, Environment } from 'contentful-management';
import { GraphQLClient } from 'graphql-request';

const cache = new Map<string, Environment>();

export type CreateClientParams = {
  space: string;
  accessToken: string;
  environment: string;
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
    accessToken,
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
