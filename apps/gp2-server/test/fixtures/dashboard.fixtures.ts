import { gp2 as gp2Contentful } from '@asap-hub/contentful';
import { gp2 as gp2Model } from '@asap-hub/model';

export const getContentfulGraphqlGuideDescription = (): NonNullable<
  NonNullable<
    NonNullable<
      NonNullable<
        NonNullable<
          gp2Contentful.FetchDashboardQuery['dashboardCollection']
        >['items'][number]
      >['guidesCollection']
    >['items'][number]
  >['descriptionCollection']
> => ({
  items: [
    {
      sys: {
        id: '1',
      },
      bodyText:
        'Learn more about the GP2 Hub and how to use different aspects.',
    },
  ],
});

export const getContentfulGraphqlGuides = (): NonNullable<
  NonNullable<
    NonNullable<
      gp2Contentful.FetchDashboardQuery['dashboardCollection']
    >['items'][number]
  >['guidesCollection']
> => ({
  items: [
    {
      sys: {
        id: '12',
      },
      icon: {
        url: 'https://google.com',
      },
      title: 'Discover how to use the GP2 Hub',
      descriptionCollection: getContentfulGraphqlGuideDescription(),
    },
  ],
});

export const getContentfulGraphqlAnnouncements = (): NonNullable<
  NonNullable<
    NonNullable<
      gp2Contentful.FetchDashboardQuery['dashboardCollection']
    >['items'][number]
  >['announcementsCollection']
> => ({
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
});

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
  announcementsCollection: getContentfulGraphqlAnnouncements(),
  guidesCollection: getContentfulGraphqlGuides(),
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
  guides: [
    {
      id: '12',
      icon: 'https://google.com',
      title: 'Discover how to use the GP2 Hub',
      description: [
        {
          id: '1',
          bodyText:
            'Learn more about the GP2 Hub and how to use different aspects.',
        },
      ],
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
