import * as gqlRequest from 'graphql-request';
import * as contentfulManagement from 'contentful-management';
import * as contentfulDeliveryApi from 'contentful';
import {
  getGraphQLClient,
  getRestClient,
  getCDAClient,
  getCPAClient,
} from '../src/client';

jest.mock('contentful-management');
const mockContentfulManagement = contentfulManagement as jest.Mocked<
  typeof contentfulManagement
>;
const space = { getEnvironment: jest.fn() };
const getSpaceFn = jest.fn().mockResolvedValue(space);
mockContentfulManagement.createClient.mockReturnValue({
  getSpace: getSpaceFn,
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
    expect(getSpaceFn).toHaveBeenCalledWith(spaceId);
    expect(space.getEnvironment).toHaveBeenCalledWith(environmentId);
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

jest.mock('contentful');
const mockContentful = contentfulDeliveryApi as jest.Mocked<
  typeof contentfulDeliveryApi
>;
mockContentful.createClient.mockReturnValue({
  getEntry: jest.fn(),
} as any as jest.Mocked<contentfulDeliveryApi.ContentfulClientApi<undefined>>);

describe('getCDAClient', () => {
  it('should create a client', () => {
    const accessToken = 'token';
    const spaceId = 'space-id';
    const environmentId = 'env-id';

    getCDAClient({
      space: spaceId,
      accessToken,
      environment: environmentId,
    });

    expect(contentfulDeliveryApi.createClient).toHaveBeenCalledWith({
      space: spaceId,
      accessToken,
      environment: environmentId,
    });
  });
});

describe('getCPAClient', () => {
  it('should create a client', () => {
    const previewAccessToken = 'token';
    const spaceId = 'space-id';
    const environmentId = 'env-id';

    getCPAClient({
      space: spaceId,
      previewAccessToken,
      environment: environmentId,
    });

    expect(contentfulDeliveryApi.createClient).toHaveBeenCalledWith({
      space: spaceId,
      accessToken: previewAccessToken,
      environment: environmentId,
      host: 'preview.contentful.com',
    });
  });
});
