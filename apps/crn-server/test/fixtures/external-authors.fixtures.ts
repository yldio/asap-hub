import {
  ContentfulWebhookPayload,
  FetchExternalAuthorsQuery as ContentfulFetchExternalAuthorsQuery,
} from '@asap-hub/contentful';
import {
  ExternalAuthorCreateDataObject,
  ExternalAuthorDataObject,
  ExternalAuthorEvent,
  ExternalAuthorResponse,
  ListExternalAuthorDataObject,
  ListExternalAuthorResponse,
  WebhookDetail,
} from '@asap-hub/model';
import { EventBridgeEvent } from 'aws-lambda';

import { createEventBridgeEventMock } from '../helpers/events';

export const getContentfulGraphqlExternalAuthor = (): NonNullable<
  NonNullable<
    ContentfulFetchExternalAuthorsQuery['externalAuthorsCollection']
  >['items'][number]
> => ({
  sys: {
    id: 'external-author-id-1',
  },
  name: 'external author one',
  orcid: 'orcid-1',
});

export const getContentfulGraphqlExternalAuthorsResponse =
  (): ContentfulFetchExternalAuthorsQuery => ({
    externalAuthorsCollection: {
      total: 1,
      items: [getContentfulGraphqlExternalAuthor()],
    },
  });

export const getExternalAuthorDataObject = (): ExternalAuthorDataObject => ({
  id: 'external-author-id-1',
  displayName: 'external author one',
  orcid: 'orcid-1',
});

export const getListExternalAuthorDataObject =
  (): ListExternalAuthorDataObject => ({
    total: 2,
    items: [
      getExternalAuthorResponse(),
      {
        id: 'external-author-id-2',
        displayName: 'external author two',
        orcid: 'orcid-2',
      },
    ],
  });

export const getExternalAuthorResponse = (): ExternalAuthorResponse =>
  getExternalAuthorDataObject();

export const getListExternalAuthorResponse = (): ListExternalAuthorResponse =>
  getListExternalAuthorDataObject();

export const getExternalAuthorContentfulWebhookDetail = (
  id: string,
): WebhookDetail<ContentfulWebhookPayload<'externalAuthors'>> => ({
  resourceId: id,
  metadata: {
    tags: [],
  },
  sys: {
    type: 'Entry',
    id: '2i3zL0KG5pjxnNQpDOqf01',
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
        id: 'externalAuthors',
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
    revision: 1,
    createdAt: '2023-03-22T15:40:48.930Z',
    updatedAt: '2023-03-22T15:40:48.930Z',
  },
  fields: {
    displayName: {
      'en-US': 'team 1',
    },
    applicationNumber: {
      'en-US': 'ASAP',
    },
    projectTitle: {
      'en-US': 'Test title',
    },
  },
});

export const getExternalAuthorContentfulEvent = (
  id: string,
  eventType: ExternalAuthorEvent,
): EventBridgeEvent<
  ExternalAuthorEvent,
  WebhookDetail<ContentfulWebhookPayload<'externalAuthors'>>
> =>
  createEventBridgeEventMock(
    getExternalAuthorContentfulWebhookDetail(id),
    eventType,
    id,
  );

export const getExternalAuthorCreateDataObject =
  (): ExternalAuthorCreateDataObject => ({
    name: 'External Author',
    orcid: 'orcid-1',
  });
