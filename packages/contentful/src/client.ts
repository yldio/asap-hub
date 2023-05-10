import { GraphQLClient } from 'graphql-request';
import { createClient } from 'contentful-management';
import { createClient as createCDAClient } from 'contentful';

export type CreateClientParams = {
  space: string;
  accessToken: string;
  environment: string;
};
export const getGraphQLClient = ({
  space,
  accessToken,
  environment,
}: CreateClientParams) => {
  const endpoint = `https://graphql.contentful.com/content/v1/spaces/${space}/environments/${environment}`;
  return new GraphQLClient(endpoint, {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getRestClient = async ({
  space: spaceId,
  accessToken,
  environment: environmentId,
}: CreateClientParams) => {
  const client = createClient({
    accessToken,
  });
  const space = await client.getSpace(spaceId);
  const environment = await space.getEnvironment(environmentId);
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
