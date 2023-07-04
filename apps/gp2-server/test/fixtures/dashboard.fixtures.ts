import { gp2 as gp2Contentful } from '@asap-hub/contentful';
import { gp2 as gp2Model } from '@asap-hub/model';

export const getContentfulGraphqlDashboard = (): NonNullable<
  NonNullable<
    gp2Contentful.FetchDashboardQuery['dashboardCollection']
  >['items'][number]
> => ({
  latestStats: {
    sampleCount: 3,
    articleCount: 11,
    cohortCount: 43,
  },
  announcementsCollection: {
    items: [
      {
        description: 'Test',
        deadline: '2029-10-24T16:30:54.000Z',
        link: 'https://google.com',
        sys: {
          id: '1',
        },
      },
      {
        description: 'Test 2',
        deadline: '2028-10-24T16:30:54.000Z',
        sys: {
          id: '2',
        },
      },
    ],
  },
});

export const getContentfulDashboardGraphqlResponse =
  (): gp2Contentful.FetchDashboardQuery => ({
    dashboardCollection: {
      total: 1,
      items: [getContentfulGraphqlDashboard()],
    },
  });

export const getDashboardDataObject = (): gp2Model.DashboardDataObject => ({
  latestStats: { sampleCount: 3, articleCount: 11, cohortCount: 43 },
  announcements: [
    {
      id: '1',
      description: 'Test',
      deadline: '2029-10-24T16:30:54.000Z',
      link: 'https://google.com',
    },
    {
      id: '2',
      description: 'Test 2',
      deadline: '2028-10-24T16:30:54.000Z',
    },
  ],
});

export const getListDashboardDataObject =
  (): gp2Model.ListDashboardDataObject => ({
    total: 1,
    items: [getDashboardDataObject()],
  });

export const getDashboardResponse = (): gp2Model.DashboardResponse =>
  getDashboardDataObject();

export const getListDashboardResponse = (): gp2Model.ListDashboardResponse => ({
  total: 1,
  items: [getDashboardResponse()],
});
