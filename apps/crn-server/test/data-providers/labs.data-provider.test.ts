import { FetchOptions } from '@asap-hub/model';
import { LabSquidexDataProvider } from '../../src/data-providers/labs.data-provider';
import {
  getListLabDataObject,
  getSquidexLabsGraphqlResponse,
} from '../fixtures/labs.fixtures';
import { getSquidexGraphqlClientMockServer } from '../mocks/squidex-graphql-client-with-server.mock';
import { getSquidexGraphqlClientMock } from '../mocks/squidex-graphql-client.mock';

describe('Lab Squidex Data Provider', () => {
  const squidexGraphqlClientMock = getSquidexGraphqlClientMock();
  const labDataProvider = new LabSquidexDataProvider(squidexGraphqlClientMock);

  const squidexGraphqlClientMockServer = getSquidexGraphqlClientMockServer();
  const labDataProviderMockGraphql = new LabSquidexDataProvider(
    squidexGraphqlClientMockServer,
  );

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Fetch', () => {
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

  describe('Fetch-by-id', () => {
    test('Should throw an error', async () => {
      await expect(labDataProvider.fetchById()).rejects.toThrow(
        'Method not implemented.',
      );
    });
  });
});
