import {
  ContentfulWebhookPayload,
  ContentfulWebhookPublishPayload,
} from '@asap-hub/contentful';
import { WebhookDetail, WebhookDetailType } from '@asap-hub/model';
import { EventBridge } from '@aws-sdk/client-eventbridge';
import { APIGatewayProxyResult } from 'aws-lambda';
import { eventBus, eventSource } from '../../../src/config';
import { contentfulWebhookFactory } from '../../../src/handlers/webhooks/contentful';
import { getNewsPublishContentfulWebhookPayload } from '../../fixtures/news.fixtures';
import { getApiGatewayEvent } from '../../helpers/events';

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
  const evenBridgeMock = {
    putEvents: jest.fn(),
  } as unknown as jest.Mocked<EventBridge>;
  const contentfulWebhookAuthenticationToken =
    'contentful-webhook-authentication-token';
  const handler = contentfulWebhookFactory(evenBridgeMock);

  beforeEach(jest.resetAllMocks);

  test('Should return 401 when the request has no Authorization header', async () => {
    const event = getApiGatewayEvent({
      headers: {},
      body: JSON.stringify({ some: 'event' }),
    });

    const res = (await handler(event)) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(401);
  });

  test('Should return 403 when the request has an invalid authentication token', async () => {
    const event = getApiGatewayEvent({
      headers: {
        Authorization: 'invalid-token',
      },
      body: JSON.stringify({ some: 'event' }),
    });
    const res = (await handler(event)) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(403);
  });

  test('Should put the news-published event into the event bus and return 200', async () => {
    const payload = getNewsPublishContentfulWebhookPayload();
    const event = createContentfulWebhookEvent(payload);
    const res = (await handler(event)) as APIGatewayProxyResult;

    const expectedDetail: WebhookDetail<
      ContentfulWebhookPublishPayload<'news'>
    > = {
      resourceId: payload.sys.id,
      ...payload,
    };

    expect(res.statusCode).toStrictEqual(200);
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

  const createContentfulWebhookEvent = (
    payload: ContentfulWebhookPayload,
    topicHeader: string = 'ContentManagement.Entry.publish',
  ) =>
    getApiGatewayEvent({
      headers: {
        Authorization: contentfulWebhookAuthenticationToken,
        'x-contentful-topic': topicHeader,
      },
      body: JSON.stringify(payload),
    });
});
