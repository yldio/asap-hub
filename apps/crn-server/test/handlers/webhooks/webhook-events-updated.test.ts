import { APIGatewayProxyResult } from 'aws-lambda';
import { CalendarResponse, GoogleLegacyCalendarColor } from '@asap-hub/model';
import { RestCalendar } from '@asap-hub/squidex';
import { webhookEventUpdatedHandlerFactory } from '../../../src/handlers/webhooks/webhook-events-updated';
import { getApiGatewayEvent } from '../../helpers/events';
import { calendarControllerMock } from '../../mocks/calendar-controller.mock';
import { SyncCalendar } from '../../../src/utils/sync-google-calendar';
import { googleApiToken } from '../../../src/config';

const googleCalendarId = 'calendar-id@group.calendar.google.com';
const squidexCalendarId = 'squidex-calendar-id';

const updateCalendarResponse: CalendarResponse = {
  id: googleCalendarId,
  color: '#5C1158' as GoogleLegacyCalendarColor,
  name: 'Kubernetes Meetups',
};

const fetchCalendarRawResponse: RestCalendar = {
  id: squidexCalendarId,
  data: {
    googleCalendarId: { iv: googleCalendarId },
    color: { iv: '#5C1158' as GoogleLegacyCalendarColor },
    name: { iv: 'Kubernetes Meetups' },
    syncToken: { iv: 'google-sync-token' },
  },
  created: '2021-01-07T16:44:09Z',
  lastModified: '2021-01-07T16:44:09Z',
  version: 42,
};

describe('Event Webhook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const syncCalendarMock: jest.MockedFunction<SyncCalendar> = jest.fn();

  const handler = webhookEventUpdatedHandlerFactory(
    calendarControllerMock,
    syncCalendarMock,
  );

  test('Should return 401 when x-goog-channel-token is not set', async () => {
    const event = getApiGatewayEvent();
    event.headers['x-goog-channel-token'] = undefined;

    const res = (await handler(event)) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(401);
  });

  test('Should return 403 when x-goog-channel-token does not match the token from the config', async () => {
    const event = getApiGatewayEvent();
    event.headers['x-goog-channel-token'] = 'not-the-same-token';

    const res = (await handler(event)) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(403);
  });

  test('Should return 400 when x-goog-resource-id is not set', async () => {
    const event = getApiGatewayEvent();
    event.headers['x-goog-channel-token'] = googleApiToken;
    event.headers['x-goog-resource-id'] = undefined;

    const res = (await handler(event)) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(400);
  });

  test('Should return 502 when fails to get calendar from squidex', async () => {
    calendarControllerMock.fetchByResourceId.mockRejectedValueOnce(
      new Error('Squidex Error'),
    );

    const res = (await handler(
      getApiGatewayEvent(googlePayload),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(502);
  });

  test('Should return 200 and save nextSyncToken to squidex when it receives one from google', async () => {
    calendarControllerMock.fetchByResourceId.mockResolvedValueOnce(
      fetchCalendarRawResponse,
    );
    syncCalendarMock.mockResolvedValueOnce('next-sync-token-1234');
    calendarControllerMock.update.mockResolvedValueOnce(updateCalendarResponse);

    const res = (await handler(
      getApiGatewayEvent(googlePayload),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(200);
    expect(calendarControllerMock.update).toHaveBeenCalledTimes(1);
    expect(calendarControllerMock.update).toHaveBeenCalledWith(
      squidexCalendarId,
      {
        syncToken: 'next-sync-token-1234',
      },
    );
  });

  test('Should return 200 event when doesnt receive a syncToken', async () => {
    calendarControllerMock.fetchByResourceId.mockResolvedValueOnce(
      fetchCalendarRawResponse,
    );
    syncCalendarMock.mockResolvedValueOnce(undefined);
    calendarControllerMock.update.mockResolvedValueOnce(updateCalendarResponse);

    const res = (await handler(
      getApiGatewayEvent(googlePayload),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(200);
    expect(calendarControllerMock.update).toHaveBeenCalledTimes(0);
  });

  test('Should return 200 even when fails to save nextSyncToken to squidex', async () => {
    calendarControllerMock.fetchByResourceId.mockResolvedValueOnce(
      fetchCalendarRawResponse,
    );
    syncCalendarMock.mockResolvedValueOnce('next-sync-token-1234');
    calendarControllerMock.update.mockRejectedValueOnce(
      new Error('Squidex Error'),
    );

    const res = (await handler(
      getApiGatewayEvent(googlePayload),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(200);
    expect(calendarControllerMock.update).toHaveBeenCalledTimes(1);
    expect(calendarControllerMock.update).toHaveBeenCalledWith(
      squidexCalendarId,
      {
        syncToken: 'next-sync-token-1234',
      },
    );
  });
});

const googlePayload = {
  version: '2.0',
  routeKey: 'POST /webhook/events',
  rawPath: '/webhook/events',
  rawQueryString: '',
  headers: {
    accept: '*/*',
    'accept-encoding': 'gzip,deflate,br',
    'content-length': '0',
    host: 'api-dev.hub.asap.science',
    'user-agent':
      'APIs-Google; (+https://developers.google.com/webmasters/APIs-Google.html)',
    'x-amzn-trace-id': 'Root=1-60367613-0da901b209649ae8364da66b',
    'x-forwarded-for': '66.102.8.222',
    'x-forwarded-port': '443',
    'x-forwarded-proto': 'https',
    'x-goog-channel-token': 'asap-google-api-token',
    'x-goog-channel-expiration': 'Fri, 26 Mar 2021 15:51:47 GMT',
    'x-goog-channel-id': 'aa760553-8aa4-45d3-824a-8e167bcaa630',
    'x-goog-message-number': '1',
    'x-goog-resource-id': 'google-resource-id',
    'x-goog-resource-state': 'sync',
    'x-goog-resource-uri':
      'https://www.googleapis.com/calendar/v3/calendars/c_5u3bak8da7gsfkd34atk0211rg@group.calendar.google.com/events?alt=json',
  },
  requestContext: {
    accountId: '249832953260',
    apiId: 'ltgiwkhlnh',
    domainName: 'api-dev.hub.asap.science',
    domainPrefix: 'api-dev',
    http: {
      method: 'POST',
      path: '/webhook/events',
      protocol: 'HTTP/1.1',
      sourceIp: '66.102.8.222',
      userAgent:
        'APIs-Google; (+https://developers.google.com/webmasters/APIs-Google.html)',
    },
    requestId: 'bQdjGhFUoAMESeg=',
    routeKey: 'POST /webhook/events',
    stage: '$default',
    time: '24/Feb/2021:15:51:47 +0000',
    timeEpoch: 1614181907708,
  },
  isBase64Encoded: false,
};
