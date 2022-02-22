import Labs from '../../src/controllers/labs';
import { FetchOptions } from '../../src/utils/types';
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
      const result = await labsMockGraphql.fetch({});
      expect(result).toMatchObject(getLabsResponse());
    });
    it('Should query with search query and return labs', async () => {
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        getSquidexLabsGraphqlResponse(),
      );
      const fetchOptions: FetchOptions = {
        search: 'lab name',
      };
      await labs.fetch(fetchOptions);
      const queryFilter = `contains(data/name/iv, 'lab') and contains(data/name/iv, 'name')`;
      expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        {
          top: 8,
          skip: 0,
          filter: queryFilter,
        },
      );
    });
    it('Should return an empty array when the client returns null', async () => {
      const squidexGraphqlResponse = getSquidexLabsGraphqlResponse();
      squidexGraphqlResponse.queryLabsContentsWithTotal = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );
      const result = await labs.fetch({});
      expect(result).toMatchObject({ items: [], total: 0 });
    });
    it('Should return an empty array when items returns null', async () => {
      const squidexGraphqlResponse = getSquidexLabsGraphqlResponse();
      squidexGraphqlResponse.queryLabsContentsWithTotal = {
        total: 0,
        items: null,
      };
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );
      const result = await labs.fetch({});
      expect(result).toMatchObject({ items: [], total: 0 });
    });
  });
});
