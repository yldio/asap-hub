import { SyncCalendar } from '../../../src';
import { webhookEventUpdatedProcessHandlerFactory } from '../../../src/handlers/webhooks/events-updated-process.handler';
import { getListCalendarDataObject } from '../../fixtures/calendar.fixtures';
import {
  getGoogleCalenderEventPayloads,
  getGoogleCalenderEventProcessPayload,
  getGoogleCalenderEventRecord,
} from '../../fixtures/google-events.fixtures';
import { calendarDataProviderMock } from '../../mocks/calendar-data-provider.mock';
import { loggerMock as logger } from '../../mocks/logger.mock';

describe('Event Webhook', () => {
  const syncCalendarMock: jest.MockedFunction<SyncCalendar> = jest.fn();
  const googleApiToken = 'some-google-api-token';

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
      'x-goog-channel-token': googleApiToken,
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

  afterEach(jest.resetAllMocks);

  const handler = webhookEventUpdatedProcessHandlerFactory(
    calendarDataProviderMock,
    syncCalendarMock,
    logger,
  );

  test('Should error when there are no records', async () => {
    const event = getGoogleCalenderEventPayloads(0);
    const { statusCode } = await handler(event);

    expect(statusCode).toStrictEqual(500);
    expect(logger.error).toBeCalledWith(
      expect.stringMatching(/Invalid record length. BatchSize is set to 1./i),
    );
  });
  test('Should error when there are more than 1 record', async () => {
    const event = getGoogleCalenderEventPayloads(2);
    const { statusCode } = await handler(event);

    expect(statusCode).toStrictEqual(500);
    expect(logger.error).toBeCalledWith(
      expect.stringMatching(/Invalid record length. BatchSize is set to 1./i),
    );
  });

  test('Should throw when the resourceId is not found', async () => {
    const { messageAttributes } = getGoogleCalenderEventRecord();
    delete messageAttributes.ResourceId;
    const event = getGoogleCalenderEventProcessPayload({
      ...getGoogleCalenderEventRecord(),
      messageAttributes,
    });

    const { statusCode } = await handler(event);

    expect(statusCode).toStrictEqual(500);
  });
  test('Should throw when the channelId is not found', async () => {
    const { messageAttributes } = getGoogleCalenderEventRecord();
    delete messageAttributes.ChannelId;
    const event = getGoogleCalenderEventProcessPayload({
      ...getGoogleCalenderEventRecord(),
      messageAttributes,
    });

    const { statusCode } = await handler(event);

    expect(statusCode).toStrictEqual(500);
  });

  test('Should return 502 when fails to get calendar', async () => {
    calendarDataProviderMock.fetch.mockRejectedValueOnce(
      new Error('CMS Error'),
    );
    const event = getGoogleCalenderEventProcessPayload();

    const { statusCode } = await handler(event);

    expect(statusCode).toStrictEqual(500);
  });

  test('Should return 500 when fails to find the calendar by resourceId', async () => {
    calendarDataProviderMock.fetch.mockResolvedValueOnce({
      items: [],
      total: 0,
    });
    const event = getGoogleCalenderEventProcessPayload();

    const { statusCode } = await handler(event);

    expect(statusCode).toStrictEqual(500);
  });

  test('Should return 200 and save nextSyncToken when it receives one from google', async () => {
    const listCalendarDataObject = getListCalendarDataObject();
    calendarDataProviderMock.fetch.mockResolvedValueOnce(
      getListCalendarDataObject(),
    );
    syncCalendarMock.mockResolvedValueOnce('next-sync-token-1234');
    calendarDataProviderMock.update.mockResolvedValueOnce(undefined);
    const event = getGoogleCalenderEventProcessPayload();

    const { statusCode } = await handler(event);

    expect(statusCode).toStrictEqual(200);
    expect(calendarDataProviderMock.update).toHaveBeenCalledTimes(1);
    expect(calendarDataProviderMock.update).toHaveBeenCalledWith(
      listCalendarDataObject.items[0]!.id,
      {
        syncToken: 'next-sync-token-1234',
      },
    );
  });

  test('Should return 200 event when doesnt receive a syncToken', async () => {
    calendarDataProviderMock.fetch.mockResolvedValueOnce(
      getListCalendarDataObject(),
    );
    syncCalendarMock.mockResolvedValueOnce(undefined);
    calendarDataProviderMock.update.mockResolvedValueOnce(undefined);
    const event = getGoogleCalenderEventProcessPayload();

    const { statusCode } = await handler(event);

    expect(statusCode).toStrictEqual(200);
    expect(calendarDataProviderMock.update).toHaveBeenCalledTimes(0);
  });

  test('Should return 200 even when fails to save nextSyncToken', async () => {
    const listCalendarDataObject = getListCalendarDataObject();
    calendarDataProviderMock.fetch.mockResolvedValueOnce(
      getListCalendarDataObject(),
    );
    syncCalendarMock.mockResolvedValueOnce('next-sync-token-1234');
    calendarDataProviderMock.update.mockRejectedValueOnce(
      new Error('CMS Error'),
    );

    const event = getGoogleCalenderEventProcessPayload();

    const { statusCode } = await handler(event);

    expect(statusCode).toStrictEqual(200);
    expect(calendarDataProviderMock.update).toHaveBeenCalledTimes(1);
    expect(calendarDataProviderMock.update).toHaveBeenCalledWith(
      listCalendarDataObject.items[0]!.id,
      {
        syncToken: 'next-sync-token-1234',
      },
    );
  });
});
