import { ContentfulWebhookPublishPayload } from '@asap-hub/contentful';
import { WebhookDetail, WebhookDetailType } from '@asap-hub/model';
import { SendMessageCommand, SQS } from '@aws-sdk/client-sqs';
import { contentfulHandlerFactory } from '../../../src/handlers/webhooks';
import { getNewsPublishContentfulWebhookPayload } from '../../fixtures/news.fixtures';
import { getLambdaRequest } from '../../helpers/events';
import { loggerMock as logger } from '../../mocks/logger.mock';

describe('Contentful event webhook', () => {
  const contentfulPollerQueueUrl = 'queue-url';
  const sqsMock = {
    send: jest.fn(),
  } as unknown as jest.Mocked<SQS>;
  const contentfulWebhookAuthenticationToken =
    'contentful-webhook-authentication-token';
  const headers = {
    authorization: contentfulWebhookAuthenticationToken,
    'x-contentful-topic': 'ContentManagement.Entry.publish',
  };
  const handler = contentfulHandlerFactory(
    contentfulWebhookAuthenticationToken,
    sqsMock,
    {
      contentfulPollerQueueUrl,
    },
    logger,
  );

  beforeEach(jest.resetAllMocks);

  test('Should throw an error when the request has no Authorization header', async () => {
    const payload = getNewsPublishContentfulWebhookPayload();
    const event = getLambdaRequest(payload, {});

    await expect(handler(event)).rejects.toThrowError('Unauthorized');
    expect(sqsMock.send).not.toHaveBeenCalled();
  });

  test('Should throw an error when the request has an invalid authentication token', async () => {
    const payload = getNewsPublishContentfulWebhookPayload();
    const invalidAuthHeaders = { authorization: 'invalid-token' };
    const event = getLambdaRequest(payload, invalidAuthHeaders);
    await expect(handler(event)).rejects.toThrowError('Forbidden');
    expect(sqsMock.send).not.toHaveBeenCalled();
  });

  test('Should put the news-published event into the SQS and return 200', async () => {
    const payload = getNewsPublishContentfulWebhookPayload();
    const event = getLambdaRequest(payload, headers);
    const { statusCode } = await handler(event);

    const expectedDetail: WebhookDetail<
      ContentfulWebhookPublishPayload<'news'>
    > = {
      resourceId: payload.sys.id,
      ...payload,
    };

    expect(statusCode).toStrictEqual(200);
    const expectedCommand = new SendMessageCommand({
      QueueUrl: contentfulPollerQueueUrl,
      MessageAttributes: {
        DetailType: {
          DataType: 'String',
          StringValue: 'NewsPublished' satisfies WebhookDetailType,
        },
        Action: {
          DataType: 'String',
          StringValue: 'publish',
        },
      },
      MessageBody: JSON.stringify(expectedDetail),
    });
    expect(sqsMock.send).toHaveBeenCalledWith({
      ...expectedCommand,
      middlewareStack: expect.any(Object),
    });
    expect(logger.debug).toBeCalledWith(
      expect.stringMatching(/Event added to queue queue-url/i),
    );
  });

  test('Should log errors when they occur', async () => {
    const payload = getNewsPublishContentfulWebhookPayload();
    sqsMock.send = jest
      .fn()
      .mockRejectedValue(new Error('error message from send'));
    const handlerWithError = contentfulHandlerFactory(
      contentfulWebhookAuthenticationToken,
      sqsMock,
      {
        contentfulPollerQueueUrl,
      },
      logger,
    );
    const event = getLambdaRequest(payload, headers);
    const { statusCode } = await handlerWithError(event);
    expect(logger.error).toBeCalledTimes(2);
    expect(logger.error).nthCalledWith(
      1,
      expect.stringMatching(
        /An error occurred putting onto the SQS queue-url/i,
      ),
    );
    expect(logger.error).nthCalledWith(
      2,
      expect.stringMatching(/The error message\: error message from send/i),
    );
    expect(statusCode).toStrictEqual(500);
  });
});
