import { APIGatewayProxyResult } from 'aws-lambda';
import { EventBridge } from 'aws-sdk';
import { eventBus, eventSource } from '../../../src/config';
import { userWebhookFactory } from '../../../src/handlers/webhooks/webhook-user';
import {
  getUserWebhookPayload,
  userPublishedEvent,
} from '../../fixtures/users.fixtures';
import { getApiGatewayEvent } from '../../helpers/events';
import { createSignedPayload } from '../../helpers/webhooks';

describe('User webhook', () => {
  const evenBridgeMock = {
    putEvents: jest.fn().mockReturnValue({ promise: jest.fn() }),
  } as unknown as jest.Mocked<EventBridge>;
  const handler = userWebhookFactory(evenBridgeMock);

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Should return 403 when the request is not signed correctly', async () => {
    const event = getApiGatewayEvent({
      headers: {
        'x-signature': 'XYZ',
      },
      body: JSON.stringify(userPublishedEvent),
    });

    const res = (await handler(event)) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(403);
    expect(evenBridgeMock.putEvents).not.toHaveBeenCalled();
  });

  test('Should return 204 and not raise an event when the event type is not supported', async () => {
    const createEvent = getUserWebhookPayload('user-1234', 'UsersCreated');

    const res = (await handler(
      createSignedPayload(createEvent),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(204);
    expect(evenBridgeMock.putEvents).not.toHaveBeenCalled();
  });

  test('Should return 200 and put the "publish" event into the event bus', async () => {
    const publishEvent = getUserWebhookPayload('user-1234', 'UsersPublished');

    const res = (await handler(
      createSignedPayload(publishEvent),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(200);
    expect(evenBridgeMock.putEvents).toHaveBeenCalledWith({
      Entries: [
        {
          EventBusName: eventBus,
          Source: eventSource,
          DetailType: 'UserPublished',
          Detail: JSON.stringify(publishEvent),
        },
      ],
    });
  });

  test('Should return 200 and put the "delete" event into the event bus', async () => {
    const deleteEvent = getUserWebhookPayload('user-1234', 'UsersDeleted');

    const res = (await handler(
      createSignedPayload(deleteEvent),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(200);
    expect(evenBridgeMock.putEvents).toHaveBeenCalledWith({
      Entries: [
        {
          EventBusName: eventBus,
          Source: eventSource,
          DetailType: 'UserDeleted',
          Detail: JSON.stringify(deleteEvent),
        },
      ],
    });
  });

  test('Should return 200 and put the "delete" event into the event bus when user-unpublished event is received', async () => {
    const unpublishEvent = getUserWebhookPayload(
      'user-1234',
      'UsersUnpublished',
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
          DetailType: 'UserDeleted',
          Detail: JSON.stringify(unpublishEvent),
        },
      ],
    });
  });

  test('Should return 200 and put the "update" event into the event bus', async () => {
    const updateEvent = getUserWebhookPayload('user-1234', 'UsersUpdated');

    const res = (await handler(
      createSignedPayload(updateEvent),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(200);
    expect(evenBridgeMock.putEvents).toHaveBeenCalledWith({
      Entries: [
        {
          EventBusName: eventBus,
          Source: eventSource,
          DetailType: 'UserUpdated',
          Detail: JSON.stringify(updateEvent),
        },
      ],
    });
  });
});
