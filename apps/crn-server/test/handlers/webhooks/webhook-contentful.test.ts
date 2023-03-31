import { ContentfulWebhookPayload } from '@asap-hub/contentful';
import { WebhookDetailType } from '@asap-hub/model';
import { APIGatewayProxyResult } from 'aws-lambda';
import { EventBridge } from 'aws-sdk';
import { eventBus, eventSource } from '../../../src/config';
import { contentfulWebhookFactory } from '../../../src/handlers/webhooks/webhook-contentful';
import { getNewsPublishContentfulWebhookPayload } from '../../fixtures/news.fixtures';
import {
  getTeamPublishContentfulWebhookPayload,
  getTeamUnpublishContentfulWebhookPayload,
} from '../../fixtures/teams.fixtures';
import { getApiGatewayEvent } from '../../helpers/events';

describe('Contentful event webhook', () => {
  const evenBridgeMock = {
    putEvents: jest.fn().mockReturnValue({ promise: jest.fn() }),
  } as unknown as jest.Mocked<EventBridge>;
  const contentfulWebhookAuthenticationToken =
    'contentful-webhook-authentication-token';
  const handler = contentfulWebhookFactory(
    contentfulWebhookAuthenticationToken,
    evenBridgeMock,
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Should return 401 when the request has no Authorization header', async () => {
    const event = getApiGatewayEvent({
      headers: {},
      body: JSON.stringify({ some: 'event' }),
    });

    const res = (await handler(event)) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(401);
  });

  test('Should return 401 when the request has an invalid authentication token', async () => {
    const event = getApiGatewayEvent({
      headers: {
        Authorization: 'invalid-token',
      },
      body: JSON.stringify({ some: 'event' }),
    });
    const res = (await handler(event)) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(401);
  });

  test('Should put the team-published event into the event bus and return 200', async () => {
    const payload = getTeamPublishContentfulWebhookPayload();
    const event = createContentfulWebhookEvent(payload);
    const res = (await handler(event)) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(200);
    expect(evenBridgeMock.putEvents).toHaveBeenCalledWith({
      Entries: [
        {
          EventBusName: eventBus,
          Source: eventSource,
          DetailType: 'TeamsPublished' satisfies WebhookDetailType,
          Detail: JSON.stringify(payload),
        },
      ],
    });
  });

  test('Should put the team-unpublished event into the event bus and return 200', async () => {
    const payload = getTeamUnpublishContentfulWebhookPayload();
    const event = createContentfulWebhookEvent(
      payload,
      'ContentManagement.Entry.unpublish',
    );
    const res = (await handler(event)) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(200);
    expect(evenBridgeMock.putEvents).toHaveBeenCalledWith({
      Entries: [
        {
          EventBusName: eventBus,
          Source: eventSource,
          DetailType: 'TeamsUnpublished' satisfies WebhookDetailType,
          Detail: JSON.stringify(payload),
        },
      ],
    });
  });

  test('Should put the news-published event into the event bus and return 200', async () => {
    const payload = getNewsPublishContentfulWebhookPayload();
    const event = createContentfulWebhookEvent(payload);
    const res = (await handler(event)) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(200);
    expect(evenBridgeMock.putEvents).toHaveBeenCalledWith({
      Entries: [
        {
          EventBusName: eventBus,
          Source: eventSource,
          DetailType: 'NewsPublished' satisfies WebhookDetailType,
          Detail: JSON.stringify(payload),
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
