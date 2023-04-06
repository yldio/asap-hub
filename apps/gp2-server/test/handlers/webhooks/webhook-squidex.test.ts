import { WebhookDetail, WebhookDetailType } from '@asap-hub/model';
import { SquidexWebhookPayload, gp2 as gp2Squidex } from '@asap-hub/squidex';
import { APIGatewayProxyResult } from 'aws-lambda';
import { EventBridge } from 'aws-sdk';
import { eventBus, eventSource } from '../../../src/config';
import { squidexWebhookFactory } from '../../../src/handlers/webhooks/webhook-squidex';
import { getUserWebhookPayload } from '../../fixtures/user.fixtures';
import { getApiGatewayEvent } from '../../helpers/events';
import { createSignedPayload } from '../../helpers/webhooks';

describe('Squidex event webhook', () => {
  const evenBridgeMock = {
    putEvents: jest.fn().mockReturnValue({ promise: jest.fn() }),
  } as unknown as jest.Mocked<EventBridge>;
  const handler = squidexWebhookFactory(evenBridgeMock);

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Should return 403 when the request is not signed correctly', async () => {
    const event = getApiGatewayEvent({
      headers: {
        'x-signature': 'XYZ',
      },
      body: JSON.stringify({ some: 'event' }),
    });

    const res = (await handler(event)) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(403);
    expect(evenBridgeMock.putEvents).not.toHaveBeenCalled();
  });

  test('Should return 204 when no event type is provided', async () => {
    const payload = getUserWebhookPayload('user-id', 'UsersUpdated');
    payload.type = undefined as unknown as WebhookDetailType;
    const res = (await handler(
      createSignedPayload(payload),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(204);
    expect(evenBridgeMock.putEvents).not.toHaveBeenCalled();
  });

  test('Should put the squidex event into the event bus and return 200', async () => {
    const payload = getUserWebhookPayload('user-id', 'UsersUpdated');
    const res = (await handler(
      createSignedPayload(payload),
    )) as APIGatewayProxyResult;

    const expectedDetail: WebhookDetail<
      SquidexWebhookPayload<gp2Squidex.User>
    > = {
      resourceId: payload.payload.id,
      ...payload,
    };

    expect(res.statusCode).toStrictEqual(200);
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
