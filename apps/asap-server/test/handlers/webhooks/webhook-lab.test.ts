import { APIGatewayProxyResult } from 'aws-lambda';
import { EventBridge } from 'aws-sdk';
import { Lab } from '@asap-hub/squidex';
import { labsWebhookFactory } from '../../../src/handlers/webhooks/webhook-lab';
import {
  createEvent,
  getLabWebhookPayload,
} from '../../fixtures/labs.fixtures';
import { createSignedPayload } from '../../helpers/webhooks';
import { getApiGatewayEvent } from '../../helpers/events';
import { eventBus, eventSource } from '../../../src/config';

const x = ['LabsPublished', 'LabsUpdated', 'LabsUnpublished', 'LabsDeleted'];

describe('Labs webhook', () => {
  const evenBridgeMock = {
    putEvents: jest.fn().mockReturnValue({ promise: jest.fn() }),
  } as unknown as jest.Mocked<EventBridge>;
  const handler = labsWebhookFactory(evenBridgeMock);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should return 403 when the request is not signed correctly', async () => {
    const event = getApiGatewayEvent({
      headers: {
        'x-signature': 'XYZ',
      },
      body: JSON.stringify(createEvent('lab-id')),
    });

    const res = (await handler(event)) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(403);
    expect(evenBridgeMock.putEvents).not.toHaveBeenCalled();
  });

  it('Should return 204 and not raise an event when the event type is not supported', async () => {
    const res = (await handler(
      createSignedPayload<Lab>(getLabWebhookPayload('lab-id', 'not-supported')),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(204);
    expect(evenBridgeMock.putEvents).not.toHaveBeenCalled();
  });

  it('Should put the labs-created event into the event bus and return 200', async () => {
    const res = (await handler(
      createSignedPayload(getLabWebhookPayload('lab-id', 'LabsPublished')),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(200);
    expect(evenBridgeMock.putEvents).toHaveBeenCalledWith({
      Entries: [
        {
          EventBusName: eventBus,
          Source: eventSource,
          DetailType: 'LabPublished',
          Detail: JSON.stringify(
            getLabWebhookPayload('lab-id', 'LabsPublished'),
          ),
        },
      ],
    });
  });

  it('Should put the labs-updated event into the event bus and return 200', async () => {
    const res = (await handler(
      createSignedPayload(getLabWebhookPayload('lab-id', 'LabsUpdated')),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(200);
    expect(evenBridgeMock.putEvents).toHaveBeenCalledWith({
      Entries: [
        {
          EventBusName: eventBus,
          Source: eventSource,
          DetailType: 'LabUpdated',
          Detail: JSON.stringify(getLabWebhookPayload('lab-id', 'LabsUpdated')),
        },
      ],
    });
  });

  it('Should put the labs-deleted event into the event bus and return 200', async () => {
    const res = (await handler(
      createSignedPayload(getLabWebhookPayload('lab-id', 'LabsDeleted')),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(200);
    expect(evenBridgeMock.putEvents).toHaveBeenCalledWith({
      Entries: [
        {
          EventBusName: eventBus,
          Source: eventSource,
          DetailType: 'LabDeleted',
          Detail: JSON.stringify(getLabWebhookPayload('lab-id', 'LabsDeleted')),
        },
      ],
    });
  });
});
