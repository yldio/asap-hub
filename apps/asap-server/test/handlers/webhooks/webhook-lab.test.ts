import { APIGatewayProxyResult } from 'aws-lambda';
import { EventBridge } from 'aws-sdk';
import { Lab } from '@asap-hub/squidex';
import {
  labsWebhookFactory,
  SquidexLabEventType,
} from '../../../src/handlers/webhooks/webhook-lab';
import {
  createEvent,
  getLabWebhookPayload,
} from '../../fixtures/labs.fixtures';
import { createSignedPayload } from '../../helpers/webhooks';
import { getApiGatewayEvent } from '../../helpers/events';
import { eventBus, eventSource } from '../../../src/config';

describe('Labs event webhook', () => {
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

  test.concurrent.each([
    ['LabsPublished', 'LabPublished'],
    ['LabsUpdated', 'LabUpdated'],
    ['LabsUnpublished', 'LabDeleted'],
    ['LabsDeleted', 'LabDeleted'],
  ])(
    'Should put the labs %s event into the event bus and return 200',
    async (givenEventType, expectedDetailType) => {
      const payload = getLabWebhookPayload(
        'lab-id',
        givenEventType as SquidexLabEventType,
      );
      const res = (await handler(
        createSignedPayload(payload),
      )) as APIGatewayProxyResult;

      expect(res.statusCode).toStrictEqual(200);
      expect(evenBridgeMock.putEvents).toHaveBeenCalledWith({
        Entries: [
          {
            EventBusName: eventBus,
            Source: eventSource,
            DetailType: expectedDetailType,
            Detail: JSON.stringify(payload),
          },
        ],
      });
    },
  );
});
