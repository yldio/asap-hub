import * as gqlRequest from 'graphql-request';
import * as contentfulManagement from 'contentful-management';
import * as contentfulDeliveryApi from 'contentful';
import {
  getGraphQLClient,
  getRestClient,
  getCDAClient,
  getCPAClient,
  RateLimitedGraphqlClient,
  RateLimitedRestAdapter,
  contentfulManagementApiRateLimiter,
  contentDeliveryApiRateLimiter,
  MakeRequestOptions,
} from '../src/client';

jest.mock('contentful-management');
jest.mock('graphql-request');
jest.mock('contentful');

jest.mock('limiter', () => {
  return {
    RateLimiter: jest.fn().mockImplementation(() => ({
      removeTokens: jest.fn(),
    })),
  };
});

describe('graphQL and Rest clients', () => {
  beforeEach(jest.resetAllMocks);
  describe('getRestClient', () => {
    const getEnvironment = jest.fn();
    const space = { getEnvironment };
    const getSpaceFn = jest.fn();
    beforeEach(() => {
      getSpaceFn.mockResolvedValue(space);
      const mockContentfulManagement = contentfulManagement as jest.Mocked<
        typeof contentfulManagement
      >;
      mockContentfulManagement.createClient.mockReturnValue({
        getSpace: getSpaceFn,
      } as any as jest.Mocked<contentfulManagement.PlainClientAPI>);
      getEnvironment.mockImplementation(async () => ({}));
    });

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
        apiAdapter: expect.anything(),
      });
      expect(RateLimitedRestAdapter).toHaveBeenCalledWith({ accessToken });
      expect(getSpaceFn).toHaveBeenCalledWith(spaceId);
      expect(getEnvironment).toHaveBeenCalledWith(environmentId);
    });

    it('returns the same client instance if called with the same credentials', async () => {
      const accessToken = 'token';
      const spaceId = 'space-id';
      const environmentId = 'env-id-0';

      const client1 = await getRestClient({
        space: spaceId,
        accessToken,
        environment: environmentId,
      });

      const client2 = await getRestClient({
        space: spaceId,
        accessToken,
        environment: environmentId,
      });

      expect(contentfulManagement.createClient).toBeCalledTimes(1);
      expect(getSpaceFn).toHaveBeenCalledTimes(1);
      expect(getEnvironment).toHaveBeenCalledTimes(1);
      expect(client1).toBe(client2);
    });

    it('returns different client instances if called with different credentials', async () => {
      const accessToken = 'token';
      const spaceId = 'space-id';

      const client1 = await getRestClient({
        space: spaceId,
        accessToken,
        environment: 'env-id-1',
      });

      const client2 = await getRestClient({
        space: spaceId,
        accessToken,
        environment: 'env-id-2',
      });

      expect(contentfulManagement.createClient).toBeCalledTimes(2);
      expect(getSpaceFn).toHaveBeenCalledTimes(2);
      expect(getEnvironment).toHaveBeenCalledTimes(2);
      expect(client1).not.toBe(client2);
    });
  });

  describe('getGraphQLClient', () => {
    beforeEach(() => {
      const mockgqlRequest = gqlRequest as jest.Mocked<typeof gqlRequest>;
      mockgqlRequest.GraphQLClient.mockReturnValue(
        {} as any as jest.Mocked<gqlRequest.GraphQLClient>,
      );
    });
    it('should create a client', async () => {
      const accessToken = 'token';
      const spaceId = 'space-id';
      const environmentId = 'env-id';

      getGraphQLClient({
        space: spaceId,
        accessToken,
        environment: environmentId,
      });

      expect(gqlRequest.GraphQLClient).toHaveBeenCalledWith(
        `https://graphql.contentful.com/content/v1/spaces/${spaceId}/environments/${environmentId}`,
        {
          errorPolicy: 'ignore',
          headers: { authorization: `Bearer ${accessToken}` },
        },
      );
      expect(RateLimitedGraphqlClient).toHaveBeenCalled();
    });
  });

  describe('getCDAClient', () => {
    beforeEach(() => {
      const mockContentful = contentfulDeliveryApi as jest.Mocked<
        typeof contentfulDeliveryApi
      >;
      mockContentful.createClient.mockReturnValue({
        getEntry: jest.fn(),
      } as any as jest.Mocked<
        contentfulDeliveryApi.ContentfulClientApi<undefined>
      >);
    });
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

  test('RateLimitedGraphqlClient request method should trigger remove token when called', async () => {
    const client = new RateLimitedGraphqlClient('url', {});

    await client.request(`query {}`);

    expect(contentDeliveryApiRateLimiter.removeTokens).toHaveBeenCalledWith(1);
  });

  test('RateLimitedRestAdapter makeRequest method should trigger remove token when called', async () => {
    const adapter = new RateLimitedRestAdapter({
      accessToken: 'token',
    });

    await adapter.makeRequest({} as MakeRequestOptions);

    expect(
      contentfulManagementApiRateLimiter.removeTokens,
    ).toHaveBeenCalledWith(1);
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
