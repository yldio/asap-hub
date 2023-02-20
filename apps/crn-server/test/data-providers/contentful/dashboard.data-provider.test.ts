import { getContentfulGraphqlClientMockServer } from '@asap-hub/contentful';
import { DashboardContentfulDataProvider } from '../../../src/data-providers/contentful/dashboard.data-provider';
import {
  getContentfulDashboardGraphqlResponse,
  getContentfulDashboardDataObject,
} from '../../fixtures/dashboard.fixtures';
import { getContentfulGraphqlNews } from '../../fixtures/news.fixtures';
import { getContentfulGraphqlPages } from '../../fixtures/page.fixtures';
import { getContentfulGraphqlClientMock } from '../../mocks/contentful-graphql-client.mock';

describe('DashboardDataProvider', () => {
  const contentfulGraphqlClientMock = getContentfulGraphqlClientMock();
  const dashboardDataProvider = new DashboardContentfulDataProvider(
    contentfulGraphqlClientMock,
  );

  const contentfulGraphqlClientMockServer =
    getContentfulGraphqlClientMockServer({
      News: () => getContentfulGraphqlNews(),
      Pages: () => getContentfulGraphqlPages(),
    });
  const dashboardDataProviderMockGraphql = new DashboardContentfulDataProvider(
    contentfulGraphqlClientMockServer,
  );

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Fetch method', () => {
    test('Should fetch the list of news from Contentful GraphQl', async () => {
      const result = await dashboardDataProviderMockGraphql.fetch();

      expect(result).toMatchObject(getContentfulDashboardDataObject());
    });

    test('Should return an empty result when the client returns an empty array for news and pages', async () => {
      const contentfulGraphQLResponse = getContentfulDashboardGraphqlResponse();
      contentfulGraphQLResponse.dashboardCollection!.items[0]!.newsCollection!.items =
        [];
      contentfulGraphQLResponse.dashboardCollection!.items[0]!.pagesCollection!.items =
        [];

      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphQLResponse,
      );

      const result = await dashboardDataProvider.fetch();

      expect(result).toEqual({
        news: [],
        pages: [],
      });
    });

    test('Should return an empty result when the client returns an empty array for queryDashboardContents', async () => {
      const contentfulGraphQLResponse = getContentfulDashboardGraphqlResponse();
      contentfulGraphQLResponse.dashboardCollection!.items = [];

      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphQLResponse,
      );

      const result = await dashboardDataProvider.fetch();

      expect(result).toEqual({
        news: [],
        pages: [],
      });
    });

    test('Should return an empty result when the client returns nulls inside news and page collection arrays', async () => {
      const contentfulGraphQLResponse = getContentfulDashboardGraphqlResponse();
      contentfulGraphQLResponse.dashboardCollection!.items[0]!.newsCollection =
        null;
      contentfulGraphQLResponse.dashboardCollection!.items[0]!.pagesCollection =
        null;
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphQLResponse,
      );

      const result = await dashboardDataProvider.fetch();

      expect(result).toEqual({
        news: [],
        pages: [],
      });
    });

    test('Should return an empty result when the client returns null for queryDashboardContents', async () => {
      const contentfulGraphQLResponse = getContentfulDashboardGraphqlResponse();
      contentfulGraphQLResponse.dashboardCollection = null;

      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphQLResponse,
      );

      const result = await dashboardDataProvider.fetch();

      expect(result).toEqual({
        news: [],
        pages: [],
      });
    });
  });
});
