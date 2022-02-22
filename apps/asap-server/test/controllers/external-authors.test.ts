import ExternalAuthors from '../../src/controllers/external-authors';
import { identity } from '../helpers/squidex';
import {
  getExternalAuthorResponse,
  getSquidexExternalAuthorGraphqlResponse,
  getSquidexExternalAuthorsGraphqlResponse,
} from '../fixtures/external-authors.fixtures';
import { getSquidexGraphqlClientMockServer } from '../mocks/squidex-graphql-client-with-server.mock';
import { getSquidexGraphqlClientMock } from '../mocks/squidex-graphql-client.mock';

describe('External Authors controller', () => {
  const squidexGraphqlClientMock = getSquidexGraphqlClientMock();
  const usersMockGraphqlClient = new ExternalAuthors(squidexGraphqlClientMock);

  const squidexGraphqlClientMockServer = getSquidexGraphqlClientMockServer();
  const usersMockGraphqlServer = new ExternalAuthors(
    squidexGraphqlClientMockServer,
  );

  beforeAll(() => {
    identity();
  });

  describe('Fetch', () => {
    test('Should fetch the users from squidex graphql', async () => {
      const result = await usersMockGraphqlServer.fetch({});

      expect(result).toMatchObject({
        total: 8,
        items: [getExternalAuthorResponse(), getExternalAuthorResponse()],
      });
    });

    test('Should return an empty result', async () => {
      const mockResponse = getSquidexExternalAuthorsGraphqlResponse();
      mockResponse.queryExternalAuthorsContentsWithTotal!.items = [];
      mockResponse.queryExternalAuthorsContentsWithTotal!.total = 0;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await usersMockGraphqlClient.fetch({});
      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should return an empty result when the client returns a response with query property set to null', async () => {
      const mockResponse = getSquidexExternalAuthorsGraphqlResponse();
      mockResponse.queryExternalAuthorsContentsWithTotal = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await usersMockGraphqlClient.fetch({});
      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should return an empty result when the client returns a response with items property set to null', async () => {
      const mockResponse = getSquidexExternalAuthorsGraphqlResponse();
      mockResponse.queryExternalAuthorsContentsWithTotal!.items = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await usersMockGraphqlClient.fetch({});
      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should use take and skip parameters', async () => {
      const mockResponse = getSquidexExternalAuthorsGraphqlResponse();
      mockResponse.queryExternalAuthorsContentsWithTotal!.items = [];
      mockResponse.queryExternalAuthorsContentsWithTotal!.total = 0;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await usersMockGraphqlClient.fetch({ take: 15, skip: 11 });
      expect(result).toEqual({ items: [], total: 0 });

      expect(squidexGraphqlClientMock.request).toBeCalledWith(
        expect.anything(),
        {
          top: 15,
          skip: 11,
        },
      );
    });
  });

  describe('FetchById', () => {
    test('Should fetch the users from squidex graphql', async () => {
      const result = await usersMockGraphqlServer.fetchById('user-id');

      expect(result).toMatchObject(getExternalAuthorResponse());
    });

    test('Should throw when user is not found', async () => {
      const mockResponse = getSquidexExternalAuthorGraphqlResponse();
      mockResponse.findExternalAuthorsContent = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      await expect(
        usersMockGraphqlClient.fetchById('not-found'),
      ).rejects.toThrow('Not Found');
    });

    test('Should return the user when it finds it', async () => {
      const mockResponse = getSquidexExternalAuthorGraphqlResponse();
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await usersMockGraphqlClient.fetchById('user-id');
      expect(result).toEqual(getExternalAuthorResponse());
    });
  });
});
