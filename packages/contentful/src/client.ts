import { GraphQLClient } from 'graphql-request';
import { createClient } from 'contentful-management';

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
}: CreateClientParams) =>
  createClient({
    accessToken,
  })
    .getSpace(spaceId)
    .then((space) => space.getEnvironment(environmentId));
