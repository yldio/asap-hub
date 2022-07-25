import { User } from '@asap-hub/squidex';
import { EventBridge } from 'aws-sdk';
import { squidexHandlerFactory } from '../../../src/handlers/webhooks';
import { getUserWebhookPayload } from '../../fixtures/users.fixtures';
import { getLambdaRequest } from '../../helpers/events';
import { createSignedHeader } from '../../helpers/webhooks';

describe('Squidex event webhook', () => {
  const eventBus = 'event-bus';
  const eventSource = 'event-source';
  const squidexSharedSecret = 'squidex-shared-secret';
  const evenBridgeMock = {
    putEvents: jest.fn().mockReturnValue({ promise: jest.fn() }),
  } as unknown as jest.Mocked<EventBridge>;
  const logger = {
    debug: jest.fn(),
  } as any;
  const handler = squidexHandlerFactory(
    evenBridgeMock,
    logger,
    eventBus,
    eventSource,
    squidexSharedSecret,
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Should throw Forbidden when the request is not signed correctly', async () => {
    const payload = {
      ...getUserWebhookPayload('user-id', 'UsersUpdated'),
      type: 'user',
    };
    const event = getLambdaRequest<User>(payload, { 'x-signature': 'XYZ' });

    expect(handler(event)).rejects.toThrowError('Forbidden');

    expect(evenBridgeMock.putEvents).not.toHaveBeenCalled();
  });

  test('Should return 204 when no event type is provided', async () => {
    const payload = {
      ...getUserWebhookPayload('user-id', 'UsersUpdated'),
      type: undefined as unknown as string,
    };
    const headers = createSignedHeader<User>(payload, squidexSharedSecret);

    const event = getLambdaRequest<User>(payload, headers);
    const response = await handler(event);
    expect(response).toEqual({ statusCode: 204 });
    expect(evenBridgeMock.putEvents).not.toHaveBeenCalled();
  });

  test('Should put the squidex event into the event bus and return 200', async () => {
    const payload = {
      ...getUserWebhookPayload('user-id', 'UsersUpdated'),
    };
    const headers = createSignedHeader<User>(payload, squidexSharedSecret);
    const event = getLambdaRequest<User>(payload, headers);
    const response = await handler(event);

    expect(response.statusCode).toStrictEqual(200);
    expect(evenBridgeMock.putEvents).toHaveBeenCalledWith({
      Entries: [
        {
          EventBusName: eventBus,
          Source: eventSource,
          DetailType: 'UsersUpdated',
          Detail: JSON.stringify(payload),
        },
      ],
    });
  });
});
