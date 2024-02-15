import { FetchDashboardQuery } from '@asap-hub/contentful';

export const getContentfulGraphqlAnnouncements = (): NonNullable<
  NonNullable<
    NonNullable<
      NonNullable<FetchDashboardQuery['dashboardCollection']>['items'][number]
    >['announcementsCollection']
  >['items'][number]
> => ({
  deadline: '2050-09-08T16:35:28.000Z',
  description: 'Example Announcement',
  link: 'https://example-announcement.com',
  sys: {
    id: '231',
  },
});
