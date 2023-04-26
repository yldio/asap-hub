import { WebhookDetailType } from '@asap-hub/model';
import { WebhookDetail } from '@asap-hub/model/src';
import { SquidexWebhookPayload, User } from '@asap-hub/squidex';
import { EventBridge } from '@aws-sdk/client-eventbridge';
import { squidexHandlerFactory } from '../../../src/handlers/webhooks';
import { getUserWebhookPayload } from '../../fixtures/users.fixtures';
import { getLambdaRequest } from '../../helpers/events';
import { createSignedHeader } from '../../helpers/webhooks';
import { loggerMock as logger } from '../../mocks/logger.mock';

describe('Squidex event webhook', () => {
  const eventBus = 'event-bus';
  const eventSource = 'event-source';
  const squidexSharedSecret = 'squidex-shared-secret';
  const evenBridgeMock = {
    putEvents: jest.fn().mockReturnValue({ promise: jest.fn() }),
  } as unknown as jest.Mocked<EventBridge>;
  const handler = squidexHandlerFactory(
    evenBridgeMock,
    logger,
    eventBus,
    eventSource,
    squidexSharedSecret,
  );

  beforeEach(jest.resetAllMocks);

  test('Should throw Forbidden when the request is not signed correctly', async () => {
    const type: WebhookDetailType = 'UsersUpdated';
    const payload = {
      ...getUserWebhookPayload('user-id', 'UsersUpdated'),
      type,
    };
    const event = getLambdaRequest<SquidexWebhookPayload<User>>(payload, {
      'x-signature': 'XYZ',
    });

    expect(handler(event)).rejects.toThrowError('Forbidden');

    expect(evenBridgeMock.putEvents).not.toHaveBeenCalled();
  });

  test('Should return 204 when no event type is provided', async () => {
    const payload = {
      ...getUserWebhookPayload('user-id', 'UsersUpdated'),
      type: undefined as unknown as WebhookDetailType,
    };
    const headers = createSignedHeader<User>(payload, squidexSharedSecret);

    const event = getLambdaRequest<SquidexWebhookPayload<User>>(
      payload,
      headers,
    );
    const response = await handler(event);
    expect(response).toEqual({ statusCode: 204 });
    expect(evenBridgeMock.putEvents).not.toHaveBeenCalled();
  });

  test('Should put the squidex event into the event bus and return 200', async () => {
    const payload = {
      ...getUserWebhookPayload('user-id', 'UsersUpdated'),
    };
    const headers = createSignedHeader<User>(payload, squidexSharedSecret);
    const event = getLambdaRequest<SquidexWebhookPayload<User>>(
      payload,
      headers,
    );
    const { statusCode } = await handler(event);

    const expectedDetail: WebhookDetail<SquidexWebhookPayload<User>> = {
      resourceId: payload.payload.id,
      ...payload,
    };

    expect(statusCode).toStrictEqual(200);
    expect(evenBridgeMock.putEvents).toHaveBeenCalledWith({
      Entries: [
        {
          EventBusName: eventBus,
          Source: eventSource,
          DetailType: 'UsersUpdated' satisfies WebhookDetailType,
          Detail: JSON.stringify(expectedDetail),
        },
      ],
    });
  });
});
