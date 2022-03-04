import { APIGatewayProxyResult } from 'aws-lambda';
import { EventBridge } from 'aws-sdk';
import { eventBus, eventSource } from '../../../src/config';
import { externalAuthorWebhookFactory } from '../../../src/handlers/webhooks/webhook-external-author';
import {
  getExternalAuthorWebhookPayload,
  externalAuthorPublishedEvent,
} from '../../fixtures/external-authors.fixtures';
import { getApiGatewayEvent } from '../../helpers/events';
import { createSignedPayload } from '../../helpers/webhooks';

describe('External Author webhook', () => {
  const evenBridgeMock = {
    putEvents: jest.fn().mockReturnValue({ promise: jest.fn() }),
  } as unknown as jest.Mocked<EventBridge>;
  const handler = externalAuthorWebhookFactory(evenBridgeMock);

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Should return 403 when the request is not signed correctly', async () => {
    const event = getApiGatewayEvent({
      headers: {
        'x-signature': 'XYZ',
      },
      body: JSON.stringify(externalAuthorPublishedEvent),
    });

    const res = (await handler(event)) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(403);
    expect(evenBridgeMock.putEvents).not.toHaveBeenCalled();
  });

  test('Should return 204 and not raise an event when the event type is not supported', async () => {
    const createEvent = getExternalAuthorWebhookPayload(
      'external-author-1234',
      'ExternalAuthorsCreated',
    );

    const res = (await handler(
      createSignedPayload(createEvent),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(204);
    expect(evenBridgeMock.putEvents).not.toHaveBeenCalled();
  });

  test('Should return 200 and put the "publish" event into the event bus', async () => {
    const publishEvent = getExternalAuthorWebhookPayload(
      'external-author-1234',
      'ExternalAuthorsPublished',
    );

    const res = (await handler(
      createSignedPayload(publishEvent),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(200);
    expect(evenBridgeMock.putEvents).toHaveBeenCalledWith({
      Entries: [
        {
          EventBusName: eventBus,
          Source: eventSource,
          DetailType: 'ExternalAuthorPublished',
          Detail: JSON.stringify(publishEvent),
        },
      ],
    });
  });

  test('Should return 200 and put the "delete" event into the event bus', async () => {
    const deleteEvent = getExternalAuthorWebhookPayload(
      'external-author-1234',
      'ExternalAuthorsDeleted',
    );

    const res = (await handler(
      createSignedPayload(deleteEvent),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(200);
    expect(evenBridgeMock.putEvents).toHaveBeenCalledWith({
      Entries: [
        {
          EventBusName: eventBus,
          Source: eventSource,
          DetailType: 'ExternalAuthorDeleted',
          Detail: JSON.stringify(deleteEvent),
        },
      ],
    });
  });

  test('Should return 200 and put the "delete" event into the event bus when external-author-unpublished event is received', async () => {
    const unpublishEvent = getExternalAuthorWebhookPayload(
      'external-author-1234',
      'ExternalAuthorsUnpublished',
    );

    const res = (await handler(
      createSignedPayload(unpublishEvent),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(200);
    expect(evenBridgeMock.putEvents).toHaveBeenCalledWith({
      Entries: [
        {
          EventBusName: eventBus,
          Source: eventSource,
          DetailType: 'ExternalAuthorDeleted',
          Detail: JSON.stringify(unpublishEvent),
        },
      ],
    });
  });

  test('Should return 200 and put the "update" event into the event bus', async () => {
    const updateEvent = getExternalAuthorWebhookPayload(
      'external-author-1234',
      'ExternalAuthorsUpdated',
    );

    const res = (await handler(
      createSignedPayload(updateEvent),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(200);
    expect(evenBridgeMock.putEvents).toHaveBeenCalledWith({
      Entries: [
        {
          EventBusName: eventBus,
          Source: eventSource,
          DetailType: 'ExternalAuthorUpdated',
          Detail: JSON.stringify(updateEvent),
        },
      ],
    });
  });
});
