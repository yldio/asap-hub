import { RestNews } from '@asap-hub/squidex';
import {
  ListNewsDataObject,
  ListNewsResponse,
  NewsDataObject,
  NewsResponse,
} from '@asap-hub/model';
import { appName, baseUrl } from '../../src/config';

export const newsSquidexApiResponse: {
  total: number;
  items: RestNews[];
} = {
  total: 1,
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
  ],
};

export const getNewsDataObject = (): NewsDataObject => ({
  id: 'news-1',
  title: 'News 1',
  type: 'News',
  shortText: 'Short text of news 1',
  text: '<p>text</p>',
  thumbnail: `${baseUrl}/api/assets/${appName}/thumbnail-uuid1`,
  created: '2020-09-08T16:35:28.000Z',
});

export const getListNewsDataObject = (): ListNewsDataObject => ({
  total: 1,
  items: [getNewsDataObject()],
});

export const getNewsResponse = (): NewsResponse => getNewsDataObject();

export const getListNewsResponse = (): ListNewsResponse => ({
  total: 1,
  items: [getNewsDataObject()],
});
