import {
  getGP2ContentfulGraphqlClientMockServer,
  gp2,
} from '@asap-hub/contentful';
import { GraphQLError } from 'graphql';
import { DateTime } from 'luxon';
import { DashboardContentfulDataProvider } from '../../src/data-providers/dashboard.data-provider';
import {
  getContentfulDashboardGraphqlResponse,
  getContentfulGraphqlAnnouncements,
  getContentfulGraphqlDashboard,
  getContentfulGraphqlGuideDescription,
  getContentfulGraphqlGuides,
  getDashboardDataObject,
  getListDashboardDataObject,
} from '../fixtures/dashboard.fixtures';
import { getContentfulGraphqlClientMock } from '../mocks/contentful-graphql-client.mock';

describe('Dashboard data provider', () => {
  const contentfulGraphqlClientMock = getContentfulGraphqlClientMock();

  const dashboardDataProvider = new DashboardContentfulDataProvider(
    contentfulGraphqlClientMock,
  );

  const contentfulGraphqlClientMockServer =
    getGP2ContentfulGraphqlClientMockServer({
      Dashboard: () => getContentfulGraphqlDashboard(),
      Announcement: () => getContentfulGraphqlAnnouncements(),
      Guides: () => getContentfulGraphqlGuides(),
      GuideDescriptionCollection: () => getContentfulGraphqlGuideDescription(),
    });

  const dashboardDataProviderMockGraphql = new DashboardContentfulDataProvider(
    contentfulGraphqlClientMockServer,
  );

  beforeEach(jest.resetAllMocks);

  describe('Fetch method', () => {
    test('Should fetch the list of dashboards from Contentful GraphQl', async () => {
      const result = await dashboardDataProviderMockGraphql.fetch({});

      expect(result).toMatchObject(getListDashboardDataObject());
    });

    test('Should return an empty result when no news exist', async () => {
      const contentfulGraphQLResponse = getContentfulDashboardGraphqlResponse();
      contentfulGraphQLResponse.dashboardCollection!.total = 0;
      contentfulGraphQLResponse.dashboardCollection!.items = [];

      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphQLResponse,
      );

      const result = await dashboardDataProvider.fetch({});

      expect(result).toEqual({
        items: [],
        total: 0,
      });
    });

    test('Should throw an error with a specific error message when the graphql client throws one', async () => {
      contentfulGraphqlClientMock.request.mockRejectedValueOnce(
        new GraphQLError('some error message'),
      );

      await expect(dashboardDataProvider.fetch({})).rejects.toThrow(
        'some error message',
      );
    });

    test('Should return an empty result when the query is returned as null', async () => {
      const contentfulGraphQLResponse = getContentfulDashboardGraphqlResponse();
      contentfulGraphQLResponse.dashboardCollection = null;

      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphQLResponse,
      );

      const result = await dashboardDataProvider.fetch({});

      expect(result).toEqual({
        items: [],
        total: 0,
      });
    });

    test('Should return dashboard', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        getContentfulDashboardGraphqlResponse(),
      );
      const result = await dashboardDataProvider.fetch({});

      expect(result).toEqual(getListDashboardDataObject());
    });
  });

  describe('Fetch-by-id method', () => {
    test('Should throw as not implemented', async () => {
      expect.assertions(1);
      await expect(dashboardDataProvider.fetchById()).rejects.toThrow(
        /Method not implemented/i,
      );
    });
  });

  describe('Sorting', () => {
    test.each`
      sortBy         | sortOrder | order
      ${'deadline'}  | ${'asc'}  | ${'deadline_ASC'}
      ${'deadline'}  | ${'desc'} | ${'deadline_DESC'}
      ${'published'} | ${'asc'}  | ${'sys_firstPublishedAt_ASC'}
      ${'published'} | ${'desc'} | ${'sys_firstPublishedAt_DESC'}
    `(
      'Should apply the "orderBy" option using the $sortBy field and $sortOrder order',
      async ({ sortBy, sortOrder, order }) => {
        const dashboardGraphqlResponse =
          getContentfulDashboardGraphqlResponse();
        contentfulGraphqlClientMock.request.mockResolvedValueOnce(
          dashboardGraphqlResponse,
        );
        const result = await dashboardDataProvider.fetch({
          sortBy,
          sortOrder,
        });

        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          gp2.FETCH_DASHBOARD,
          {
            orderAnnouncements: order,
          },
        );
        expect(result).toEqual(getListDashboardDataObject());
      },
    );

    test('Should not apply any order if the parameters are not provided', async () => {
      const dashboardGraphqlResponse = getContentfulDashboardGraphqlResponse();
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        dashboardGraphqlResponse,
      );
      const result = await dashboardDataProvider.fetch({});

      expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
        gp2.FETCH_DASHBOARD,
        {
          orderAnnouncements: undefined,
        },
      );
      expect(result).toEqual(getListDashboardDataObject());
    });
  });
  describe('announcements', () => {
    test('no announcements returns empty array', async () => {
      const dashboard = {
        ...getContentfulGraphqlDashboard(),
        announcementsCollection: undefined,
      };
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        dashboardCollection: {
          total: 1,
          items: [dashboard],
        },
      });
      const dashboardDataObject = await dashboardDataProvider.fetch({});
      expect(dashboardDataObject?.items[0]?.announcements).toEqual([]);
    });

    test('if present it parses the deadline', async () => {
      const deadline = DateTime.fromISO('2023-09-06');
      const dashboard = {
        ...getContentfulGraphqlDashboard(),
        announcementsCollection: {
          total: 1,
          items: [
            {
              deadline,
              description: 'test',
              sys: {
                id: '1',
              },
            },
          ],
        },
      };
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        dashboardCollection: {
          total: 1,
          items: [dashboard],
        },
      });
      const dashboardDataObject = await dashboardDataProvider.fetch({});
      expect(dashboardDataObject.items[0]?.announcements[0]?.deadline).toEqual(
        deadline.toUTC().toString(),
      );
    });
  });

  describe('guides', () => {
    test('no guides returns empty array', async () => {
      const dashboard = {
        ...getContentfulGraphqlDashboard(),
        guidesCollection: undefined,
      };
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        dashboardCollection: {
          total: 1,
          items: [dashboard],
        },
      });
      const dashboardDataObject = await dashboardDataProvider.fetch({});
      expect(dashboardDataObject?.items[0]?.guides).toEqual([]);
    });

    test('if present it parses the description', async () => {
      const dashboard = getContentfulGraphqlDashboard();

      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        dashboardCollection: {
          total: 1,
          items: [dashboard],
        },
      });
      const dashboardDataObject = await dashboardDataProvider.fetch({});
      expect(dashboardDataObject.items[0]?.guides[0]?.description).toEqual(
        getDashboardDataObject().guides[0]?.description,
      );
    });

    test('if present it parses the description', async () => {
      const dashboard = {
        ...getContentfulGraphqlDashboard(),
        guidesCollection: {
          items: [
            {
              sys: { id: '1' },
              title: 'Header',
              descriptionCollection: undefined,
            },
          ],
        },
      };

      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        dashboardCollection: {
          total: 1,
          items: [dashboard],
        },
      });
      const dashboardDataObject = await dashboardDataProvider.fetch({});
      expect(dashboardDataObject.items[0]?.guides[0]?.description).toEqual([]);
    });
  });
});
