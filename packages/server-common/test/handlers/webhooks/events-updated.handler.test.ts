import { SendMessageCommand, SQS } from '@aws-sdk/client-sqs';
import { webhookEventUpdatedHandlerFactory } from '../../../src/handlers/webhooks/events-updated.handler';
import { googlePayload } from '../../fixtures/google-events.fixtures';
import { getApiGatewayEvent } from '../../helpers/events';
import { loggerMock as logger } from '../../mocks/logger.mock';

describe('Event Webhook', () => {
  const sqsMock = {
    send: jest.fn(),
  } as unknown as jest.Mocked<SQS>;
  const googleCalenderEventQueueUrl = 'queue-url';
  const googleApiToken = 'some-google-api-token';

  afterEach(jest.resetAllMocks);

  const handler = webhookEventUpdatedHandlerFactory(
    sqsMock,
    { googleApiToken, googleCalenderEventQueueUrl },
    logger,
  );

  test('Should put the event into the SQS and return 200', async () => {
    const resourceId = 'google-resource-id';
    const channelId = 'aa760553-8aa4-45d3-824a-8e167bcaa630';
    const payload = googlePayload(googleApiToken, resourceId, channelId);
    const { statusCode } = await handler(payload);

    expect(statusCode).toStrictEqual(200);
    const expectedCommand = new SendMessageCommand({
      QueueUrl: googleCalenderEventQueueUrl,
      MessageAttributes: {
        ResourceId: {
          DataType: 'String',
          StringValue: resourceId,
        },
        ChannelId: {
          DataType: 'String',
          StringValue: channelId,
        },
      },
      MessageBody: expect.any(String),
    });
    expect(sqsMock.send).toHaveBeenCalledWith({
      ...expectedCommand,
      middlewareStack: expect.any(Object),
    });
    expect(logger.debug).toHaveBeenCalledWith(
      expect.stringMatching(/Event added to queue queue-url/i),
    );
  });
  test('Should return 401 when x-goog-channel-token is not set', async () => {
    const event = getApiGatewayEvent();
    event.headers['x-goog-channel-token'] = undefined;

    const { statusCode } = await handler(event);

    expect(statusCode).toStrictEqual(401);
  });

  test('Should return 403 when x-goog-channel-token does not match the token from the config', async () => {
    const event = getApiGatewayEvent();
    event.headers['x-goog-channel-token'] = 'not-the-same-token';

    const { statusCode } = await handler(event);

    expect(statusCode).toStrictEqual(403);
  });

  test('Should return 400 when x-goog-resource-id is not set', async () => {
    const event = getApiGatewayEvent();
    event.headers['x-goog-channel-token'] = googleApiToken;
    event.headers['x-goog-resource-id'] = undefined;

    const { statusCode } = await handler(event);

    expect(statusCode).toStrictEqual(400);
  });
  test('Should log errors when they occur', async () => {
    const resourceId = 'google-resource-id';
    const channelId = 'aa760553-8aa4-45d3-824a-8e167bcaa630';
    const payload = googlePayload(googleApiToken, resourceId, channelId);
    sqsMock.send = jest
      .fn()
      .mockRejectedValue(new Error('error message from send'));
    const handlerWithError = webhookEventUpdatedHandlerFactory(
      sqsMock,
      { googleApiToken, googleCalenderEventQueueUrl },
      logger,
    );
    const { statusCode } = await handlerWithError(payload);
    expect(logger.error).toHaveBeenCalledTimes(2);
    expect(logger.error).toHaveBeenNthCalledWith(
      1,
      expect.stringMatching(
        /An error occurred putting onto the SQS queue-url/i,
      ),
    );
    expect(logger.error).toHaveBeenNthCalledWith(
      2,
      expect.stringMatching(/The error message\: error message from send/i),
    );
    expect(statusCode).toStrictEqual(500);
  });
});
