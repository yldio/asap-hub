import { Calendar } from '@asap-hub/squidex';
import { APIGatewayProxyResult } from 'aws-lambda';
import { EventBridge } from 'aws-sdk';
import { eventBus, eventSource } from '../../../src/config';
import { calendarWebhookFactory } from '../../../src/handlers/webhooks/webhook-calendar';
import {
  getCalendarPublishedWebhookEvent,
  getCalendarUpdatedWebhookEvent,
} from '../../fixtures/calendars.fixtures';
import { getApiGatewayEvent } from '../../helpers/events';
import { createSignedPayload } from '../../helpers/webhooks';

describe('Calendar webhook', () => {
  const evenBridgeMock = {
    putEvents: jest.fn().mockReturnValue({ promise: jest.fn() }),
  } as unknown as jest.Mocked<EventBridge>;
  const handler = calendarWebhookFactory(evenBridgeMock);

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Should return 403 when the request is not signed correctly', async () => {
    const event = getApiGatewayEvent({
      headers: {
        'x-signature': 'XYZ',
      },
      body: JSON.stringify(getCalendarPublishedWebhookEvent()),
    });

    const res = (await handler(event)) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(403);
    expect(evenBridgeMock.putEvents).not.toHaveBeenCalled();
  });

  test('Should return 204 and not raise an event when the event type is not supported', async () => {
    const res = (await handler(
      createSignedPayload<Calendar>({
        ...getCalendarPublishedWebhookEvent(),
        type: 'SomeEvent',
      }),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(204);
    expect(evenBridgeMock.putEvents).not.toHaveBeenCalled();
  });

  test('Should put the calendar-created event into the event bus and return 200', async () => {
    const res = (await handler(
      createSignedPayload(getCalendarPublishedWebhookEvent()),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(200);
    expect(evenBridgeMock.putEvents).toHaveBeenCalledWith({
      Entries: [
        {
          EventBusName: eventBus,
          Source: eventSource,
          DetailType: 'CalendarCreated',
          Detail: JSON.stringify(getCalendarPublishedWebhookEvent()),
        },
      ],
    });
  });

  test('Should put the calendar-updated event into the event bus and return 200', async () => {
    const res = (await handler(
      createSignedPayload(getCalendarUpdatedWebhookEvent()),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(200);
    expect(evenBridgeMock.putEvents).toHaveBeenCalledWith({
      Entries: [
        {
          EventBusName: eventBus,
          Source: eventSource,
          DetailType: 'CalendarUpdated',
          Detail: JSON.stringify(getCalendarUpdatedWebhookEvent()),
        },
      ],
    });
  });
});
