import { ContentfulWebhookPublishPayload } from '@asap-hub/contentful';
import { WebhookDetail, WebhookDetailType } from '@asap-hub/model';
import { EventBridge } from '@aws-sdk/client-eventbridge';
import { contentfulHandlerFactory } from '../../../src/handlers/webhooks';
import { getNewsPublishContentfulWebhookPayload } from '../../fixtures/news.fixtures';
import { getLambdaRequest } from '../../helpers/events';

describe('Contentful event webhook', () => {
  const eventBus = 'event-bus';
  const eventSource = 'event-source';
  const evenBridgeMock = {
    putEvents: jest.fn(),
  } as unknown as jest.Mocked<EventBridge>;
  const contentfulWebhookAuthenticationToken =
    'contentful-webhook-authentication-token';
  const handler = contentfulHandlerFactory(
    contentfulWebhookAuthenticationToken,
    evenBridgeMock,
    eventBus,
    eventSource,
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Should return 401 when the request has no Authorization header', async () => {
    const payload = {
      type: 'something',
      payload: { some: 'event' },
    };
    const event = getLambdaRequest(payload, {});

    expect(handler(event)).rejects.toThrowError('Unauthorized');
    expect(evenBridgeMock.putEvents).not.toHaveBeenCalled();
  });

  test('Should return 401 when the request has an invalid authentication token', async () => {
    const payload = {
      type: 'something',
      payload: { some: 'event' },
    };
    const headers = { Authorization: 'invalid-token' };
    const event = getLambdaRequest(payload, headers);
    expect(handler(event)).rejects.toThrowError('Unauthorized');
    expect(evenBridgeMock.putEvents).not.toHaveBeenCalled();
  });

  test('Should put the news-published event into the event bus and return 200', async () => {
    const payload = getNewsPublishContentfulWebhookPayload();
    const headers = {
      authorization: contentfulWebhookAuthenticationToken,
      'x-contentful-topic': 'publish',
    };
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
  });
});
