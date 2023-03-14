import * as gqlRequest from 'graphql-request';
import * as contentfulManagement from 'contentful-management';
import { getGraphQLClient, getRestClient } from '../src/client';

jest.mock('contentful-management');
const mockContentfulManagement = contentfulManagement as jest.Mocked<
  typeof contentfulManagement
>;
mockContentfulManagement.createClient.mockReturnValue({
  getSpace: jest.fn().mockResolvedValue({ getEnvironment: jest.fn() }),
} as any as jest.Mocked<contentfulManagement.PlainClientAPI>);

describe('getRestClient', () => {
  it('should create a client', async () => {
    const accessToken = 'token';
    const spaceId = 'space-id';
    const environmentId = 'env-id';

    await getRestClient({
      space: spaceId,
      accessToken,
      environment: environmentId,
    });

    expect(contentfulManagement.createClient).toHaveBeenCalledWith({
      accessToken,
    });

    expect(
      contentfulManagement.createClient({ accessToken }).getSpace,
    ).toHaveBeenCalledWith(spaceId);

    expect(
      (
        await contentfulManagement
          .createClient({ accessToken })
          .getSpace(spaceId)
      ).getEnvironment,
    ).toHaveBeenCalledWith(environmentId);
  });
});

jest.mock('graphql-request');
const mockgqlRequest = gqlRequest as jest.Mocked<typeof gqlRequest>;
mockgqlRequest.GraphQLClient.mockReturnValue(
  {} as any as jest.Mocked<gqlRequest.GraphQLClient>,
);

describe('getGraphQLClient', () => {
  it('should create a client', async () => {
    const accessToken = 'token';
    const spaceId = 'space-id';
    const environmentId = 'env-id';

    await getGraphQLClient({
      space: spaceId,
      accessToken,
      environment: environmentId,
    });

    expect(gqlRequest.GraphQLClient).toHaveBeenCalledWith(
      `https://graphql.contentful.com/content/v1/spaces/${spaceId}/environments/${environmentId}`,
      { headers: { authorization: `Bearer ${accessToken}` } },
    );
  });
});
