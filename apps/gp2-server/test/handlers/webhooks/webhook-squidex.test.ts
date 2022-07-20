import { User } from '@asap-hub/squidex';
import { APIGatewayProxyResult } from 'aws-lambda';
import { handler } from '../../../src/handlers/webhooks/webhook-squidex';
import { getUserWebhookPayload } from '../../fixtures/user.fixtures';
import { getApiGatewayEvent } from '../../helpers/events';
import { createSignedPayload } from '../../helpers/webhooks';
jest.mock('aws-sdk', () => ({
  ...jest.requireActual('aws-sdk'),
  EventBridge: jest.fn().mockImplementation(() => ({
    putEvents: jest.fn().mockReturnValue({
      promise: jest.fn(),
    }),
  })),
}));

describe('Squidex event webhook', () => {
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
  });

  test('Should return 204 when no event type is provided', async () => {
    const payload = {
      ...getUserWebhookPayload('user-id', 'UsersUpdated'),
      type: undefined as unknown as string,
    };
    const res = (await handler(
      createSignedPayload<User>(payload),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(204);
  });
  test('Should put the squidex event into the event bus and return 200', async () => {
    const payload = getUserWebhookPayload('user-id', 'UsersUpdated');
    const res = (await handler(
      createSignedPayload(payload),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(200);
  });
});
