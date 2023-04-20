import { FetchOptions } from '@asap-hub/model';
import Labs from '../../src/controllers/labs';
import { LabSquidexDataProvider } from '../../src/data-providers/labs.data-provider';
import {
  getListLabDataObject,
  getListLabsResponse,
  getSquidexLabsGraphqlResponse,
} from '../fixtures/labs.fixtures';
import { identity } from '../helpers/squidex';
import { getSquidexGraphqlClientMockServer } from '../mocks/squidex-graphql-client-with-server.mock';
import { getSquidexGraphqlClientMock } from '../mocks/squidex-graphql-client.mock';

describe('labs controller', () => {
  const squidexGraphqlClientMock = getSquidexGraphqlClientMock();
  const labDataProvider = new LabSquidexDataProvider(squidexGraphqlClientMock);

  const squidexGraphqlClientMockServer = getSquidexGraphqlClientMockServer();
  const labDataProviderMockGraphql = new LabSquidexDataProvider(squidexGraphqlClientMockServer);
  beforeAll(() => {
    identity();
  });
  describe('fetch', () => {
    it('Should fetch labs from squidex graphql', async () => {
      const result = await labDataProviderMockGraphql.fetch({});
      expect(result).toMatchObject(getListLabDataObject());
    });
    it('Should query with search query and return labs', async () => {
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        getSquidexLabsGraphqlResponse(),
      );
      const fetchOptions: FetchOptions = {
        search: 'lab name',
      };
      await labDataProvider.fetch(fetchOptions);
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
      const result = await labDataProvider.fetch({});
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
      const result = await labDataProvider.fetch({});
      expect(result).toMatchObject({ items: [], total: 0 });
    });
  });
});
