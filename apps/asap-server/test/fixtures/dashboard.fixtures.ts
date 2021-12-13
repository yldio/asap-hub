import { DashboardResponse } from '@asap-hub/model';
import { config } from '@asap-hub/squidex';

export const dashboardResponse: DashboardResponse = {
  news: [
    {
      id: 'news-1',
      title: 'News 1',
      type: 'News',
      shortText: 'Short text of news 1',
      text: '<p>text</p>',
      thumbnail: `${config.baseUrl}/api/assets/${config.appName}/thumbnail-uuid1`,
      created: '2020-09-08T16:35:28.000Z',
    },
    {
      id: 'news-2',
      title: 'Event 2',
      type: 'Event',
      shortText: 'Short text of event 2',
      text: '<p>text</p>',
      thumbnail: `${config.baseUrl}/api/assets/${config.appName}/thumbnail-uuid2`,
      created: '2020-09-16T14:31:19.000Z',
    },
  ],
  pages: [],
};
const squidexGraphqlDashboardFlatData = () => ({
  news: [
    {
      id: 'guid-news-1',
      created: '2020-09-24T11:06:27.164Z',
      lastModified: '2020-10-15T17:55:21Z',
      version: 42,
      flatData: {
        title: 'News 1',
        type: 'News',
        shortText: 'Short text of news 1',
        text: '<p>text</p>',
        thumbnail: [
          {
            id: 'news-url-1',
            thumbnailUrl: `${config.baseUrl}/api/assets/${config.appName}/thumbnail-uuid4`,
          },
        ],
      },
    },
    {
      id: 'guid-news-2',
      created: '2020-09-24T11:06:27.164Z',
      lastModified: '2020-10-15T17:55:21Z',
      version: 42,
      flatData: {
        title: 'Event 2',
        type: 'Event',
        shortText: 'Short text of event 2',
        text: '<p>text</p>',
        thumbnail: [
          {
            id: 'news-url-2',
            thumbnailUrl: `${config.baseUrl}/api/assets/${config.appName}/thumbnail-uuid2`,
          },
        ],
      },
    },
  ],
  pages: [],
});

export const getSquidexGraphqlDashboard = () => ({
  id: 'ec3086d4-aa64-4f30-a0f7-5c5b95ffbcca',
  created: '2020-09-23T16:34:26.842Z',
  lastModified: '2021-05-14T14:48:46Z',
  version: 42,
  flatData: squidexGraphqlDashboardFlatData(),
});
export const squidexGraphqlDashboardResponse = () => ({
  news: [
    {
      created: '2020-09-24T11:06:27.164Z',
      id: 'guid-news-1',
      shortText: 'Short text of news 1',
      text: '<p>text</p>',
      thumbnail: 'https://cloud.squidex.io/api/assets/1153/news-url-1',
      title: 'News 1',
      type: 'News',
    },
    {
      created: '2020-09-24T11:06:27.164Z',
      id: 'guid-news-2',
      shortText: 'Short text of event 2',
      text: '<p>text</p>',
      thumbnail: 'https://cloud.squidex.io/api/assets/1153/news-url-2',
      title: 'Event 2',
      type: 'Event',
    },
  ],
  pages: [],
});
