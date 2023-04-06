import { RestNews } from '@asap-hub/squidex';
import {
  ContentfulWebhookPublishPayload,
  FetchNewsQuery,
} from '@asap-hub/contentful';
import {
  ListNewsDataObject,
  ListNewsResponse,
  NewsDataObject,
  NewsResponse,
} from '@asap-hub/model';
import { appName, baseUrl } from '../../src/config';

export const getContentfulGraphqlNews = (): NonNullable<
  NonNullable<FetchNewsQuery['newsCollection']>['items'][number]
> => ({
  title: 'News 1',
  shortText: 'Short text of news 1',
  link: null,
  linkText: null,
  text: {
    json: {
      nodeType: 'document',
      data: {},
      content: [
        {
          nodeType: 'paragraph',
          data: {},
          content: [{ nodeType: 'text', value: 'text', marks: [], data: {} }],
        },
      ],
    },
    links: {
      entries: {
        inline: [],
      },
      assets: {
        block: [],
      },
    },
  },
  frequency: 'News Articles',
  sys: {
    id: 'news-1',
    firstPublishedAt: '2020-09-08T16:35:28.000Z',
  },
  publishDate: '2020-09-08T16:35:28.000Z',
  thumbnail: {
    url: `${baseUrl}/api/assets/${appName}/thumbnail-uuid1`,
  },
});

export const getContentfulNewsGraphqlResponse = (): FetchNewsQuery => ({
  newsCollection: {
    total: 1,
    items: [getContentfulGraphqlNews()],
  },
});

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

export const getNewsDataObject = (): NewsDataObject => ({
  id: 'news-1',
  title: 'News 1',
  frequency: 'News Articles',
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
  items: [getNewsResponse()],
});

export const getNewsPublishContentfulWebhookPayload =
  (): ContentfulWebhookPublishPayload<'news'> => ({
    metadata: {
      tags: [],
    },
    sys: {
      type: 'Entry',
      id: '4daRnfRhQ1spRmTrqeP2M6',
      space: {
        sys: {
          type: 'Link',
          linkType: 'Space',
          id: '5v6w5j61tndm',
        },
      },
      environment: {
        sys: {
          id: 'crn-2802',
          type: 'Link',
          linkType: 'Environment',
        },
      },
      contentType: {
        sys: {
          type: 'Link',
          linkType: 'ContentType',
          id: 'news',
        },
      },
      createdBy: {
        sys: {
          type: 'Link',
          linkType: 'User',
          id: '1W39zODWXRZZPH4On1MQoS',
        },
      },
      updatedBy: {
        sys: {
          type: 'Link',
          linkType: 'User',
          id: '1W39zODWXRZZPH4On1MQoS',
        },
      },
      revision: 5,
      createdAt: '2023-03-21T08:00:32.852Z',
      updatedAt: '2023-03-22T13:42:11.345Z',
    },
    fields: {
      title: {
        'en-US': 'test',
      },
      shortText: {
        'en-US': 'test',
      },
      frequency: {
        'en-US': 'Biweekly Newsletter',
      },
      text: {
        'en-US': {
          data: {},
          content: [
            {
              data: {},
              content: [
                {
                  data: {},
                  marks: [],
                  value: 'test testssbbeee',
                  nodeType: 'text',
                },
              ],
              nodeType: 'paragraph',
            },
          ],
          nodeType: 'document',
        },
      },
      publishDate: {
        'en-US': '2023-03-21T00:00+00:00',
      },
    },
  });
