import { DashboardDataObject, DashboardResponse } from '@asap-hub/model';
import { FetchDashboardQuery as FetchDashboardQueryContentful } from '@asap-hub/contentful';
import { getContentfulNewsGraphqlResponse } from './news.fixtures';
import { getContentfulPagesGraphqlResponse } from './page.fixtures';

export const getContentfulDashboardGraphqlResponse =
  (): FetchDashboardQueryContentful => ({
    dashboardCollection: {
      items: [
        {
          newsCollection: getContentfulNewsGraphqlResponse().newsCollection!,
          pagesCollection: getContentfulPagesGraphqlResponse().pagesCollection!,
        },
      ],
    },
  });

export const getDashboardDataObject = (): DashboardDataObject => ({
  news: [
    {
      created: '2020-09-08T16:35:28.000Z',
      id: 'news-1',
      shortText: 'Short text of news 1',
      text: '<p>text</p>',
      thumbnail: `https://www.contentful.com/api/assets/asap-crn/thumbnail-uuid1`,
      title: 'News 1',
      frequency: 'News Articles',
    },
  ],
  pages: [
    {
      id: 'some-id',
      title: 'Privacy Policy',
      path: '/privacy-policy',
      shortText: 'short text',
      link: 'link',
      linkText: 'linkText',
      text: '<h1>Privacy Policy</h1>',
    },
  ],
});
``;

export const getDashboardResponse = (): DashboardResponse =>
  getDashboardDataObject();
