import {
  ContentfulWebhookPublishPayload,
  ContentfulWebhookUnpublishPayload,
} from '@asap-hub/contentful';

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

export const getNewsUnpublishContentfulWebhookPayload =
  (): ContentfulWebhookUnpublishPayload<'news'> => ({
    sys: {
      type: 'DeletedEntry',
      id: '4fTQlBcDyPBvUIwpjm96JU',
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
      revision: 2,
      createdAt: '2023-03-23T08:54:29.958Z',
      updatedAt: '2023-03-23T08:54:29.958Z',
      deletedAt: '2023-03-23T08:54:29.958Z',
    },
  });
