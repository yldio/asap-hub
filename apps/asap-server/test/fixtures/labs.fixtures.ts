import { EventBridgeEvent } from 'aws-lambda';

import { LabResponse } from '@asap-hub/model';
import { Lab, WebhookPayload } from '@asap-hub/squidex';
import {
  LabEventType,
  SquidexLabEventType,
} from '../../src/handlers/webhooks/webhook-lab';
import { SquidexWebhookLabPayload } from '../../src/handlers/lab/index-lab-users-handler';
import { createEventBridgeEventMock } from '../helpers/events';

export const getLabResponse = (): LabResponse => ({
  id: 'lab-id-1',
  name: 'The Lab',
});

export const getLabWebhookPayload = (
  id: string,
  type: SquidexLabEventType,
): WebhookPayload<Lab> => ({
  type,
  timestamp: '2021-02-15T13:11:25Z',
  payload: {
    $type: 'EnrichedContentEvent',
    type: 'Updated',
    id,
    created: '2020-07-31T15:52:33Z',
    lastModified: '2020-07-31T15:52:33Z',
    version: 42,
    data: {
      name: { iv: 'The Lab' },
    },
  },
});

export type LabEventGenerator = (
  id: string,
) => EventBridgeEvent<LabEventType, SquidexWebhookLabPayload>;

export const getLabEvent = (
  id: string,
  squidexEvent: SquidexLabEventType,
  eventType: LabEventType,
) =>
  createEventBridgeEventMock(
    getLabWebhookPayload(id, squidexEvent),
    eventType,
    id,
  );

export const unpublishedEvent: LabEventGenerator = (id: string) =>
  getLabEvent(id, 'LabsUnpublished', 'LabDeleted') as EventBridgeEvent<
    LabEventType,
    SquidexWebhookLabPayload
  >;

export const deleteEvent: LabEventGenerator = (id: string) =>
  getLabEvent(id, 'LabsDeleted', 'LabDeleted') as EventBridgeEvent<
    LabEventType,
    SquidexWebhookLabPayload
  >;

export const createEvent: LabEventGenerator = (id: string) =>
  getLabEvent(id, 'LabsPublished', 'LabPublished') as EventBridgeEvent<
    LabEventType,
    SquidexWebhookLabPayload
  >;

export const updateEvent: LabEventGenerator = (id: string) =>
  getLabEvent(id, 'LabsUpdated', 'LabPublished') as EventBridgeEvent<
    LabEventType,
    SquidexWebhookLabPayload
  >;
