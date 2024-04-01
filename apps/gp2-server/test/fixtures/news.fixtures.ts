import {
  ContentfulWebhookPayload,
  ContentfulWebhookPublishPayload,
  gp2 as gp2Contentful,
} from '@asap-hub/contentful';
import {
  gp2 as gp2Model,
  WebhookDetail,
  WebhookDetailType,
} from '@asap-hub/model';
import { EventBridgeEvent, SQSEvent, SQSRecord } from 'aws-lambda';
import { createEventBridgeEventMock } from '../helpers/events';
import { getContentfulTagsCollectionGraphqlResponse } from './tag.fixtures';

export const getContentfulGraphqlNews = (): NonNullable<
  NonNullable<gp2Contentful.FetchNewsQuery['newsCollection']>['items'][number]
> => ({
  title: 'a news item',
  shortText: 'the short text of the news',
  thumbnail: {
    url: 'http://image.com/assets/thumbnail-uuid1',
  },
  link: 'http://example.com/a-link',
  linkText: 'some link text',
  sys: {
    id: '42',
    firstPublishedAt: '2020-09-08T16:35:28.000Z',
  },
  publishDate: '2021-12-28T00:00:00.000Z',
  type: 'news',
  tagsCollection: { ...getContentfulTagsCollectionGraphqlResponse() },
});

export const getContentfulNewsGraphqlResponse =
  (): gp2Contentful.FetchNewsQuery => ({
    newsCollection: {
      total: 1,
      items: [getContentfulGraphqlNews()],
    },
  });

export const getNewsDataObject = (): gp2Model.NewsDataObject => ({
  id: '42',
  title: 'a news item',
  shortText: 'the short text of the news',
  thumbnail: 'http://image.com/assets/thumbnail-uuid1',
  created: '2021-12-28T00:00:00.000Z',
  link: 'http://example.com/a-link',
  linkText: 'some link text',
  type: 'news',
  tags: ['tag-1'],
});

export const getListNewsDataObject = (): gp2Model.ListNewsDataObject => ({
  total: 1,
  items: [getNewsDataObject()],
});

export const getNewsResponse = (): gp2Model.NewsResponse => getNewsDataObject();

export const getListNewsResponse = (): gp2Model.ListNewsResponse => ({
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

export const newsPublishContentfulPollerRecord: SQSRecord = {
  messageId: '42',
  receiptHandle: 'a handle',
  body: JSON.stringify(getNewsPublishContentfulWebhookPayload()),
  attributes: {
    ApproximateReceiveCount: '1',
    SentTimestamp: '',
    SenderId: '11',
    ApproximateFirstReceiveTimestamp: '',
  },
  messageAttributes: {
    DetailType: {
      dataType: 'String',
      stringValue: 'NewsPublished' satisfies WebhookDetailType,
    },
    Action: { dataType: 'String', stringValue: 'publish' },
  },
  md5OfBody: '',
  eventSource: '',
  eventSourceARN: '',
  awsRegion: '',
};
export const getNewsPublishContentfulPollerPayload = (
  overrides: Partial<SQSRecord> = {},
): SQSEvent => ({
  Records: [
    {
      ...newsPublishContentfulPollerRecord,
      ...overrides,
    },
  ],
});

export const getNewsWebhookPayload = (
  id: string,
): WebhookDetail<ContentfulWebhookPayload<'news'>> => ({
  resourceId: id,
  metadata: {
    tags: [],
  },
  sys: {
    type: 'Entry',
    id: 'fc496d00-053f-44fd-9bac-68dd9d959848',
    space: {
      sys: {
        type: 'Link',
        linkType: 'Space',
        id: '5v6w5j61tndm',
      },
    },
    environment: {
      sys: {
        id: 'an-environment',
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
        id: '3ZHvngTJ24kxZUAPDJ8J1z',
      },
    },
    updatedBy: {
      sys: {
        type: 'Link',
        linkType: 'User',
        id: '3ZHvngTJ24kxZUAPDJ8J1z',
      },
    },
    revision: 14,
    createdAt: '2023-05-17T13:39:03.250Z',
    updatedAt: '2023-05-18T16:17:36.425Z',
  },
  fields: {
    title: {
      'en-US':
        'Sci 7 - Inflammation & Immune Reg., Presenting Teams: Sulzer, Desjardins, Kordower',
    },
  },
});

export const getNewsEvent = (
  id: string,
  eventType: gp2Model.NewsEvent,
): EventBridgeEvent<
  gp2Model.NewsEvent,
  WebhookDetail<ContentfulWebhookPayload<'news'>>
> => createEventBridgeEventMock(getNewsWebhookPayload(id), eventType, id);
