import { ContentfulWebhookPublishPayload } from '@asap-hub/contentful';
import { WebhookDetail, WebhookDetailType } from '@asap-hub/model';
import { EventBridge } from '@aws-sdk/client-eventbridge';
import { contentfulHandlerFactory } from '../../../src/handlers/webhooks';
import { getNewsPublishContentfulWebhookPayload } from '../../fixtures/news.fixtures';
import { getLambdaRequest } from '../../helpers/events';
import { loggerMock as logger } from '../../mocks/logger.mock';
import { getCalendarFromDeliveryApi } from '../calendar/webhook-sync-calendar.fixtures';

jest.mock('@asap-hub/contentful', () => ({
  ...jest.requireActual('@asap-hub/contentful'),
  getCDAClient: () => ({
    getEntry: jest.fn().mockResolvedValue({
      sys: {
        id: '1',
        revision: 5,
      },
      fields: {},
    }),
  }),
}));

describe('Contentful event webhook', () => {
  const eventBus = 'event-bus';
  const eventSource = 'event-source';
  const evenBridgeMock = {
    putEvents: jest.fn(),
  } as unknown as jest.Mocked<EventBridge>;
  const contentfulWebhookAuthenticationToken =
    'contentful-webhook-authentication-token';
  const headers = {
    authorization: contentfulWebhookAuthenticationToken,
    'x-contentful-topic': 'publish',
  };
  const handler = contentfulHandlerFactory(
    contentfulWebhookAuthenticationToken,
    evenBridgeMock,
    { eventBus, eventSource, space: '', environment: '', accessToken: '' },
    logger,
  );

  beforeEach(jest.resetAllMocks);

  test('Should throw an error when the request has no Authorization header', async () => {
    const payload = getNewsPublishContentfulWebhookPayload();
    const event = getLambdaRequest(payload, {});

    await expect(handler(event)).rejects.toThrowError('Unauthorized');
    expect(evenBridgeMock.putEvents).not.toHaveBeenCalled();
  });

  test('Should throw an error when the request has an invalid authentication token', async () => {
    const payload = getNewsPublishContentfulWebhookPayload();
    const invalidAuthHeaders = { authorization: 'invalid-token' };
    const event = getLambdaRequest(payload, invalidAuthHeaders);
    await expect(handler(event)).rejects.toThrowError('Forbidden');
    expect(evenBridgeMock.putEvents).not.toHaveBeenCalled();
  });

  test('Should throw an error when the request does not have the revision field', async () => {
    const payload = getNewsPublishContentfulWebhookPayload();
    delete (payload.sys as any).revision;
    const event = getLambdaRequest(payload, headers);

    await expect(handler(event)).rejects.toThrowError('Invalid payload');
    expect(evenBridgeMock.putEvents).not.toHaveBeenCalled();
  });

  test('Should put the news-published event into the event bus and return 200', async () => {
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
    expect(evenBridgeMock.putEvents).toHaveBeenCalledWith({
      Entries: [
        {
          EventBusName: eventBus,
          Source: eventSource,
          DetailType: 'NewsPublished' satisfies WebhookDetailType,
          Detail: JSON.stringify(expectedDetail),
        },
      ],
    });
    expect(logger.debug).toBeCalledWith(
      expect.stringMatching(/Event added to event-bus/i),
    );
  });

  test('Should log errors when they occur', async () => {
    const payload = getNewsPublishContentfulWebhookPayload();
    evenBridgeMock.putEvents = jest
      .fn()
      .mockRejectedValue(new Error('error message from putEvents'));
    const handlerWithError = contentfulHandlerFactory(
      contentfulWebhookAuthenticationToken,
      evenBridgeMock,
      { eventBus, eventSource, space: '', environment: '', accessToken: '' },
      logger,
    );
    const event = getLambdaRequest(payload, headers);
    const { statusCode } = await handlerWithError(event);
    expect(logger.error).toBeCalledTimes(2);
    expect(logger.error).nthCalledWith(
      1,
      expect.stringMatching(
        /An error occurred putting onto the event bus event-bus/i,
      ),
    );
    expect(logger.error).nthCalledWith(
      2,
      expect.stringMatching(
        /The error message\: error message from putEvents/i,
      ),
    );
    expect(statusCode).toStrictEqual(500);
  });
});
