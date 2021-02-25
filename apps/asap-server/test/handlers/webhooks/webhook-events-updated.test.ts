import { CalendarResponse, GoogleLegacyCalendarColor } from '@asap-hub/model';
import { APIGatewayProxyResult } from 'aws-lambda';

import { GetJWTCredentials } from '../../../src/utils/aws-secret-manager';
import { webhookEventUpdatedHandlerFactory } from '../../../src/handlers/webhooks/webhook-events-updated';
import { apiGatewayEvent } from '../../helpers/events';
import { calendarControllerMock } from '../../mocks/calendar-controller.mock';
import { RestCalendar } from '@asap-hub/squidex';
import { SyncCalendarFactory } from '../../../src/utils/sync-google-calendar';

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
    id: { iv: googleCalendarId },
    color: { iv: '#5C1158' as GoogleLegacyCalendarColor },
    name: { iv: 'Kubernetes Meetups' },
    syncToken: { iv: 'google-sync-token' },
  },
  created: '2021-01-07T16:44:09Z',
  lastModified: '2021-01-07T16:44:09Z',
};

describe('Event Webhook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const getJWTCredentialsMock: jest.MockedFunction<GetJWTCredentials> = jest
    .fn()
    .mockResolvedValue({
      client_email: 'random-data',
      private_key: 'random-data',
    });

  const syncCalendarMock = jest.fn();
  const syncCalendarFactoryMock: jest.MockedFunction<SyncCalendarFactory> = jest
    .fn()
    .mockReturnValue(syncCalendarMock);

  const handler = webhookEventUpdatedHandlerFactory(
    calendarControllerMock,
    getJWTCredentialsMock,
    syncCalendarFactoryMock,
  );

  calendarControllerMock.getSyncToken.mockResolvedValue('next-sync-token');

  test('Should return 400 when x-goog-resource-id is not set', async () => {
    const res = (await handler(
      apiGatewayEvent({
        ...googlePayload,
        headers: {},
      }),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(400);
  });

  test('Should return 502 when fails to get calendar from squidex', async () => {
    calendarControllerMock.fetchByResouceId.mockRejectedValueOnce(
      new Error('Squidex Error'),
    );

    const res = (await handler(
      apiGatewayEvent(googlePayload),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(502);
  });

  test('Should return 502 when fails to get credentials from AWS', async () => {
    calendarControllerMock.fetchByResouceId.mockResolvedValueOnce(
      fetchCalendarRawResponse,
    );
    calendarControllerMock.getSyncToken.mockResolvedValueOnce(undefined);
    getJWTCredentialsMock.mockRejectedValueOnce(new Error('AWS Error'));

    const res = (await handler(
      apiGatewayEvent(googlePayload),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(502);
  });

  test('Should return 200 and do full synk when it fails to fetch the synkToken from squidex', async () => {
    calendarControllerMock.fetchByResouceId.mockResolvedValueOnce(
      fetchCalendarRawResponse,
    );
    calendarControllerMock.getSyncToken.mockRejectedValueOnce(
      new Error('Squidex Error'),
    );
    getJWTCredentialsMock.mockResolvedValueOnce({
      client_email: 'random-data',
      private_key: 'random-data',
    });

    const res = (await handler(
      apiGatewayEvent(googlePayload),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(200);
    const [syncToken] = syncCalendarFactoryMock.mock.calls[0];
    expect(syncToken).toEqual(undefined);
  });

  test('Should return 200 and save nextSyncToken to squidex when receives one', async () => {
    calendarControllerMock.fetchByResouceId.mockResolvedValueOnce(
      fetchCalendarRawResponse,
    );
    syncCalendarMock.mockResolvedValueOnce('next-sync-token-1234');
    calendarControllerMock.update.mockResolvedValueOnce(updateCalendarResponse);

    const res = (await handler(
      apiGatewayEvent(googlePayload),
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

  test('Should return 200 even when fails to save nextSyncToken to squidex', async () => {
    calendarControllerMock.fetchByResouceId.mockResolvedValueOnce(
      fetchCalendarRawResponse,
    );
    syncCalendarMock.mockResolvedValueOnce('next-sync-token-1234');
    calendarControllerMock.update.mockRejectedValueOnce(
      new Error('Squidex Error'),
    );

    const res = (await handler(
      apiGatewayEvent(googlePayload),
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
