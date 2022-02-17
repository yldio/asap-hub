import ExternalAuthors from '../../src/controllers/external-authors';
import { identity } from '../helpers/squidex';
import {
  getExternalAuthorResponse,
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
        items: [
          getExternalAuthorResponse(),
          getExternalAuthorResponse()
        ]
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
  });
});
