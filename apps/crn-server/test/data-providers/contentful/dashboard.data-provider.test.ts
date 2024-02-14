import { getContentfulGraphqlClientMockServer } from '@asap-hub/contentful';
import { DashboardDataObject } from '@asap-hub/model';
import { DashboardContentfulDataProvider } from '../../../src/data-providers/contentful/dashboard.data-provider';
import { getContentfulGraphqlAnnouncements } from '../../fixtures/announcements.fixtures';
import {
  getContentfulDashboardGraphqlResponse,
  getDashboardDataObject,
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
      Announcements: () => getContentfulGraphqlAnnouncements(),
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

      expect(result).toMatchObject(getDashboardDataObject());
    });

    test('Should return an empty result when the client returns an empty array for news and pages', async () => {
      const contentfulGraphQLResponse = getContentfulDashboardGraphqlResponse();
      contentfulGraphQLResponse.dashboardCollection!.items[0]!.newsCollection!.items =
        [];
      contentfulGraphQLResponse.dashboardCollection!.items[0]!.pagesCollection!.items =
        [];
      contentfulGraphQLResponse.dashboardCollection!.items[0]!.announcementsCollection!.items =
        [];

      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphQLResponse,
      );

      const result = await dashboardDataProvider.fetch();

      expect(result).toEqual({
        news: [],
        pages: [],
        announcements: [],
      } satisfies DashboardDataObject);
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
        announcements: [],
      } satisfies DashboardDataObject);
    });

    test('Should return an empty result when the client returns nulls inside news and page collection arrays', async () => {
      const contentfulGraphQLResponse = getContentfulDashboardGraphqlResponse();
      contentfulGraphQLResponse.dashboardCollection!.items[0]!.newsCollection =
        null;
      contentfulGraphQLResponse.dashboardCollection!.items[0]!.pagesCollection =
        null;
      contentfulGraphQLResponse.dashboardCollection!.items[0]!.announcementsCollection =
        null;
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphQLResponse,
      );

      const result = await dashboardDataProvider.fetch();

      expect(result).toEqual({
        news: [],
        pages: [],
        announcements: [],
      } satisfies DashboardDataObject);
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
        announcements: [],
      } satisfies DashboardDataObject);
    });

    test('Should only return annoucements whose deadline has not passed yet', async () => {
      const contentfulGraphQLResponse = getContentfulDashboardGraphqlResponse();
      const newAnnouncement = {
        ...getContentfulGraphqlAnnouncements(),
        // deadline is in the future
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        sys: {
          id: 'announcement-id-new',
        },
      };
      contentfulGraphQLResponse.dashboardCollection!.items[0]!.announcementsCollection!.items =
        [
          {
            ...getContentfulGraphqlAnnouncements(),
            // deadline is in the past
            deadline: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            sys: {
              id: 'announcement-id-old',
            },
          },
          newAnnouncement,
        ];

      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphQLResponse,
      );

      const result = await dashboardDataProvider.fetch();

      expect(result.announcements).toHaveLength(1);
      expect(result.announcements).toEqual([
        {
          deadline: newAnnouncement.deadline,
          description: newAnnouncement.description!,
          href: newAnnouncement.link!,
          id: newAnnouncement.sys.id,
        },
      ] satisfies DashboardDataObject['announcements']);
    });
  });
});
