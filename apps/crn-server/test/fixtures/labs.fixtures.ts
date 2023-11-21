import {
  LabDataObject,
  LabEvent,
  LabResponse,
  ListLabDataObject,
  ListLabsResponse,
  WebhookDetail,
} from '@asap-hub/model';
import {
  ContentfulWebhookPayload,
  FetchLabsQuery as ContentfulFetchLabsQuery,
} from '@asap-hub/contentful';
import { EventBridgeEvent } from 'aws-lambda';
import { LabPayload } from '../../src/handlers/event-bus';
import { createEventBridgeEventMock } from '../helpers/events';

export const getLabContentfulWebhookDetail = (
  id: string,
): WebhookDetail<ContentfulWebhookPayload<'labs'>> => ({
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
        id: 'crn-3046',
        type: 'Link',
        linkType: 'Environment',
      },
    },
    contentType: {
      sys: {
        type: 'Link',
        linkType: 'ContentType',
        id: 'labs',
      },
    },
    createdBy: {
      sys: {
        type: 'Link',
        linkType: 'User',
        id: '2SHvngTJ24kxZGAPDJ8J1y',
      },
    },
    updatedBy: {
      sys: {
        type: 'Link',
        linkType: 'User',
        id: '2SHvngTJ24kxZGAPDJ8J1y',
      },
    },
    revision: 14,
    createdAt: '2023-05-17T13:39:03.250Z',
    updatedAt: '2023-05-18T16:17:36.425Z',
  },
  fields: {
    name: { 'en-US': 'Simpson' },
  },
});

export type LabEventGenerator = (
  id: string,
) => EventBridgeEvent<LabEvent, LabPayload>;

export const getLabEvent = (
  id: string,
  eventType: LabEvent,
): EventBridgeEvent<
  LabEvent,
  WebhookDetail<ContentfulWebhookPayload<'labs'>>
> =>
  createEventBridgeEventMock(getLabContentfulWebhookDetail(id), eventType, id);

export const getLabUnpublishedEvent: LabEventGenerator = (id: string) =>
  getLabEvent(id, 'LabsUnpublished') as EventBridgeEvent<LabEvent, LabPayload>;

export const getLabPublishedEvent: LabEventGenerator = (id: string) =>
  getLabEvent(id, 'LabsPublished') as EventBridgeEvent<LabEvent, LabPayload>;

export const getLabDataObject = (): LabDataObject => ({
  name: 'Simpson',
  id: '12345',
});

export const getListLabDataObject = (): ListLabDataObject => ({
  total: 1,
  items: [getLabDataObject()],
});

export const getLabResponse = (): LabResponse => getLabDataObject();

export const getListLabsResponse = (): ListLabsResponse => ({
  total: 1,
  items: [getLabResponse()],
});

export const getContentfulGraphqlLabs = (): NonNullable<
  NonNullable<ContentfulFetchLabsQuery['labsCollection']>['items'][number]
> => ({
  sys: {
    id: '12345',
  },
  name: 'Simpson',
});

export const getContentfulLabsGraphqlResponse =
  (): ContentfulFetchLabsQuery => ({
    labsCollection: {
      total: 1,
      items: [getContentfulGraphqlLabs()],
    },
  });
