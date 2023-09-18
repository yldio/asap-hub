import {
  gp2 as gp2Contentful,
  ContentfulWebhookPayload,
} from '@asap-hub/contentful';
import { gp2 as gp2Model, WebhookDetail } from '@asap-hub/model';
import { EventBridgeEvent } from 'aws-lambda';
import { createEventBridgeEventMock } from '../helpers/events';

export const getExternalUserCreateDataObject =
  (): gp2Model.ExternalUserCreateDataObject => ({
    name: 'External User',
    orcid: 'orcid-1',
  });
export const getExternalUserDataObject =
  (): gp2Model.ExternalUserDataObject => ({
    name: 'External User',
    orcid: 'orcid-1',
    id: 'id-1',
  });

export const getExternalUserResponse = (): gp2Model.ExternalUserResponse => ({
  displayName: 'External User',
  orcid: 'orcid-1',
  id: 'id-1',
});

export const getFetchExternalUsersResponse =
  (): gp2Model.ListExternalUserResponse => ({
    total: 1,
    items: [getExternalUserResponse()],
  });

export const getContentfulGraphqlExternalUser = (): NonNullable<
  NonNullable<
    gp2Contentful.FetchExternalUsersQuery['externalUsersCollection']
  >['items'][number]
> => ({
  sys: {
    id: 'id-1',
    firstPublishedAt: '2021-11-23T20:45:22Z',
    publishedAt: '2021-11-26T15:33:18Z',
    publishedVersion: 45,
  },
  name: 'External User',
  orcid: 'orcid-1',
});

export const getContentfulGraphqlExternalUsersResponse =
  (): gp2Contentful.FetchExternalUsersQuery => ({
    externalUsersCollection: {
      total: 1,
      items: [getContentfulGraphqlExternalUser()],
    },
  });

export const getExternalUserWebhookPayload = (
  id: string,
): WebhookDetail<ContentfulWebhookPayload<'externalUser'>> => ({
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
        id: 'externalUser',
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
    name: {
      'en-US': 'Tony',
    },
  },
});

export const getExternalUserEvent = (
  id: string,
  eventType: gp2Model.ExternalUserEvent,
): EventBridgeEvent<
  gp2Model.ExternalUserEvent,
  WebhookDetail<ContentfulWebhookPayload<'externalUser'>>
> =>
  createEventBridgeEventMock(getExternalUserWebhookPayload(id), eventType, id);
