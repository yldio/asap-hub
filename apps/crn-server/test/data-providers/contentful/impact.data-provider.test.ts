import { getContentfulGraphqlClientMockServer } from '@asap-hub/contentful';
import { FetchOptions } from '@asap-hub/model';
import { ImpactContentfulDataProvider } from '../../../src/data-providers/contentful/impact.data-provider';
import { ImpactDataProvider } from '../../../src/data-providers/types';
import {
  getContentfulGraphqlImpacts,
  getContentfulGraphqlImpactsResponse,
  getListImpactsResponse,
} from '../../fixtures/impact.fixtures';
import { getContentfulGraphqlClientMock } from '../../mocks/contentful-graphql-client.mock';

describe('Impact data provider', () => {
  const contentfulGraphqlClientMock = getContentfulGraphqlClientMock();

  const impactDataProvider: ImpactDataProvider =
    new ImpactContentfulDataProvider(contentfulGraphqlClientMock);

  const contentfulGraphqlClientMockServer =
    getContentfulGraphqlClientMockServer({
      Impact: () => getContentfulGraphqlImpacts(),
    });

  const impactDataProviderMockGraphql = new ImpactContentfulDataProvider(
    contentfulGraphqlClientMockServer,
  );

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Fetch', () => {
    test('Should fetch the list of impacts from Contentful GraphQl', async () => {
      const result = await impactDataProviderMockGraphql.fetch({});

      expect(result).toMatchObject(getListImpactsResponse());
    });

    test('Should query with search query and return impacts', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        getContentfulGraphqlImpactsResponse(),
      );
      const fetchOptions: FetchOptions<string[]> = {
        search: 'impact name',
      };
      await impactDataProvider.fetch(fetchOptions);
      expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        {
          limit: 10,
          skip: null,
          where: {
            AND: [{ name_contains: 'impact' }, { name_contains: 'name' }],
          },
        },
      );
    });

    test('Should return an empty array when the client returns null', async () => {
      const graphqlResponse = getContentfulGraphqlImpactsResponse();
      graphqlResponse.impactCollection = null;
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        graphqlResponse,
      );
      const result = await impactDataProvider.fetch({});
      expect(result).toMatchObject({ items: [], total: 0 });
    });

    test('Should return an empty array when items is empty', async () => {
      const graphqlResponse = getContentfulGraphqlImpactsResponse();
      graphqlResponse.impactCollection = {
        total: 0,
        items: [],
      };
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        graphqlResponse,
      );
      const result = await impactDataProvider.fetch({});
      expect(result).toMatchObject({ items: [], total: 0 });
    });
  });

  describe('Fetch by ID', () => {
    test('not implemented', async () => {
      await expect(impactDataProviderMockGraphql.fetchById()).rejects.toThrow();
    });
  });
});
