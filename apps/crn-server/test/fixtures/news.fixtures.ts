import { RestNews } from '@asap-hub/squidex';
import { ContentfulRestNews, BLOCKS } from '@asap-hub/contentful';
import {
  ListNewsDataObject,
  ListNewsResponse,
  NewsDataObject,
  NewsResponse,
} from '@asap-hub/model';
import { appName, baseUrl } from '../../src/config';

const metadata = {
  tags: [],
};

export const newsContentfulApiResponse: {
  total: number;
  items: ContentfulRestNews[];
} = {
  total: 1,

  items: [
    {
      metadata,
      sys: {
        id: '6bvIpdZA9tbz753Ga7WalO',
        type: 'Entry',
        revision: 1,
        space: {
          sys: {
            type: 'Link',
            linkType: 'Space',
            id: 'space-id',
          },
        },
        environment: {
          sys: {
            id: 'env-id',
            type: 'Link',
            linkType: 'Environment',
          },
        },
        createdAt: '2020-09-08T16:35:28.000Z',
        updatedAt: '2022-11-01T13:07:02.945Z',
        contentType: {
          sys: { id: 'news', linkType: 'ContentType', type: 'Link' },
        },
      },
      fields: {
        id: 'news-1',
        title: 'News 1',
        shortText: 'Short text of news 1',
        frequency: 'News Articles',
        text: {
          nodeType: BLOCKS.DOCUMENT,
          data: {},
          content: [
            {
              nodeType: BLOCKS.PARAGRAPH,
              data: {},
              content: [
                {
                  nodeType: 'text',
                  value: 'text',
                  marks: [],
                  data: {},
                },
              ],
            },
          ],
        },
        thumbnail: {
          metadata,
          sys: {
            space: {
              sys: { type: 'Link', linkType: 'Space', id: 'space-id' },
            },
            id: '6T0VSO1wPsUdeMBQUoVvCM',
            type: 'Asset',
            createdAt: '2022-11-01T13:12:47.520Z',
            updatedAt: '2022-11-01T13:12:47.520Z',
            environment: {
              sys: { id: 'env-id', type: 'Link', linkType: 'Environment' },
            },
            revision: 1,
            locale: 'en-US',
          },
          fields: {
            title: 'asap',
            description: '',
            file: {
              url: 'http://images.ctfassets.net/thumbnail-id.png',
              fileName: 'asap.png',
              contentType: 'image/png',
              details: { size: 15860, image: { width: 451, height: 192 } },
            },
          },
        },
      },
    },
  ],
};

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
        frequency: {
          iv: 'News Articles',
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

export const getNewsDataObject = (
  isContentfulResponse = false,
): NewsDataObject => ({
  id: 'news-1',
  title: 'News 1',
  type: 'News',
  frequency: 'News Articles',
  shortText: 'Short text of news 1',
  text: '<p>text</p>',
  thumbnail: isContentfulResponse
    ? `http://images.ctfassets.net/thumbnail-id.png`
    : `${baseUrl}/api/assets/${appName}/thumbnail-uuid1`,
  created: '2020-09-08T16:35:28.000Z',
});

export const getListNewsDataObject = (
  isContentfulResponse = false,
): ListNewsDataObject => ({
  total: 1,
  items: [getNewsDataObject(isContentfulResponse)],
});

export const getNewsResponse = (): NewsResponse => getNewsDataObject();

export const getListNewsResponse = (): ListNewsResponse => ({
  total: 1,
  items: [getNewsDataObject()],
});
