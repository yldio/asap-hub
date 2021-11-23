import { config, RestNews } from '@asap-hub/squidex';
import { ListNewsResponse } from '@asap-hub/model';

export const newsSquidexApiResponse: {
  total: number;
  items: RestNews[];
} = {
  total: 2,
  items: [
    {
      id: 'news-1',
      data: {
        title: {
          iv: 'News 1',
        },
        type: {
          iv: 'News',
        },
        shortText: {
          iv: 'Short text of news 1',
        },
        text: {
          iv: '<p>text</p>',
        },
        thumbnail: {
          iv: ['thumbnail-uuid1'],
        },
      },
      lastModified: '2020-09-25T09:42:51Z',
      version: 42,
      created: '2020-09-08T16:35:28Z',
    },
    {
      id: 'news-2',
      data: {
        title: {
          iv: 'Event 2',
        },
        type: {
          iv: 'Event',
        },
        shortText: {
          iv: 'Short text of event 2',
        },
        text: {
          iv: '<p>text</p>',
        },
        thumbnail: {
          iv: ['thumbnail-uuid2'],
        },
      },
      lastModified: '2020-09-25T09:42:51Z',
      version: 42,
      created: '2020-09-16T14:31:19Z',
    },
  ],
};

export const listNewsResponse: ListNewsResponse = {
  total: 2,
  items: [
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
};
