import { RestNews } from '@asap-hub/squidex';
import { ListNewsResponse } from '@asap-hub/model';
import { appName, baseUrl } from '../../src/config';

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
          iv: 'Tutorial 2',
        },
        type: {
          iv: 'Tutorial',
        },
        shortText: {
          iv: 'Short text of tutorial 2',
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
      thumbnail: `${baseUrl}/api/assets/${appName}/thumbnail-uuid1`,
      created: '2020-09-08T16:35:28.000Z',
    },
    {
      id: 'news-2',
      title: 'Tutorial 2',
      type: 'Tutorial',
      shortText: 'Short text of tutorial 2',
      text: '<p>text</p>',
      thumbnail: `${baseUrl}/api/assets/${appName}/thumbnail-uuid2`,
      created: '2020-09-16T14:31:19.000Z',
    },
  ],
};
