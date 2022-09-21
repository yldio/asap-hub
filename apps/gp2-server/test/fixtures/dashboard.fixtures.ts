import { DashboardResponse } from '@asap-hub/model';
import { appName, baseUrl } from '../../src/config';

export const squidexGraphqlDashboardFlatData = () => ({
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
            id: 'thumbnail-uuid1',
            thumbnailUrl: `${baseUrl}/api/assets/${appName}/thumbnail-uuid1`,
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
        title: 'Tutorial 2',
        type: 'Tutorial',
        shortText: 'Short text of tutorial 2',
        text: '<p>text</p>',
        thumbnail: [
          {
            id: 'thumbnail-uuid2',
            thumbnailUrl: `${baseUrl}/api/assets/${appName}/thumbnail-uuid2`,
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
export const squidexGraphqlDashboardResponse = (): DashboardResponse => ({
  news: [
    {
      created: '2020-09-24T11:06:27.164Z',
      id: 'guid-news-1',
      shortText: 'Short text of news 1',
      text: '<p>text</p>',
      thumbnail: `${baseUrl}/api/assets/${appName}/thumbnail-uuid1`,
      title: 'News 1',
      type: 'News',
    },
    {
      created: '2020-09-24T11:06:27.164Z',
      id: 'guid-news-2',
      shortText: 'Short text of tutorial 2',
      text: '<p>text</p>',
      thumbnail: `${baseUrl}/api/assets/${appName}/thumbnail-uuid2`,
      title: 'Tutorial 2',
      type: 'Tutorial',
    },
  ],
  pages: [],
});
