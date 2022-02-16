import Labs from '../../src/controllers/labs';
import {
  getLabsResponse,
  getSquidexLabsGraphqlResponse,
} from '../fixtures/labs.fixtures';
import { identity } from '../helpers/squidex';
import { getSquidexGraphqlClientMockServer } from '../mocks/squidex-graphql-client-with-server.mock';
import { getSquidexGraphqlClientMock } from '../mocks/squidex-graphql-client.mock';

describe('labs controller', () => {
  const squidexGraphqlClientMock = getSquidexGraphqlClientMock();
  const labs = new Labs(squidexGraphqlClientMock);

  const squidexGraphqlClientMockServer = getSquidexGraphqlClientMockServer();
  const labsMockGraphql = new Labs(squidexGraphqlClientMockServer);
  beforeAll(() => {
    identity();
  });
  describe('fetch', () => {
    it('Should fetch labs from squidex graphql', async () => {
      const result = await labsMockGraphql.fetch();
      expect(result).toMatchObject(getLabsResponse());
    });
    it('Should return an empty array when the client returns null', async () => {
      const squidexGraphqlResponse = getSquidexLabsGraphqlResponse();
      squidexGraphqlResponse.queryLabsContents = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );
      const result = await labs.fetch();
      expect(result).toMatchObject([]);
    });
  });
});
