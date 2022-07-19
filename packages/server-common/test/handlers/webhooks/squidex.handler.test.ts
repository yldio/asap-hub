import { APIGatewayProxyResult } from 'aws-lambda';
import { EventBridge } from 'aws-sdk';
import { createSquidexHandler } from '../../../src/handlers/webhooks';
import { getLabWebhookPayload } from '../../fixtures/labs.fixtures';
import { getLambdaRequest } from '../../helpers/events';
import { createSignedPayload } from '../../helpers/webhooks';

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
  const handler = createSquidexHandler(
    evenBridgeMock,
    logger,
    eventBus,
    eventSource,
    squidexSharedSecret,
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  test.only('Should return 403 when the request is not signed correctly', async () => {
    const payload = {
      ...getLabWebhookPayload('lab-id', 'LabsUpdated'),
      type: 'lab',
    };
    const event = getLambdaRequest(payload, { 'x-signature': 'XYZ' });

    const res = (await handler(event)) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(403);
    expect(evenBridgeMock.putEvents).not.toHaveBeenCalled();
  });

  test('Should return 204 when no event type is provided', async () => {
    const payload = {
      ...getLabWebhookPayload('lab-id', 'LabsUpdated'),
      type: undefined as unknown as string,
    };
    const res = (await handler(
      createSignedPayload(payload, squidexSharedSecret),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(204);
    expect(evenBridgeMock.putEvents).not.toHaveBeenCalled();
  });

  test('Should put the squidex event into the event bus and return 200', async () => {
    const payload = getLabWebhookPayload('lab-id', 'LabsUpdated');
    const res = (await handler(
      createSignedPayload(payload, squidexSharedSecret),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(200);
    expect(evenBridgeMock.putEvents).toHaveBeenCalledWith({
      Entries: [
        {
          EventBusName: eventBus,
          Source: eventSource,
          DetailType: 'LabsUpdated',
          Detail: JSON.stringify(payload),
        },
      ],
    });
  });
});
