import { SQSEvent, SQSRecord } from 'aws-lambda';
import { calendar_v3 } from 'googleapis';

export const getListEventsResponse = (): calendar_v3.Schema$Events => ({
  kind: 'calendar#events',
  etag: '"p330bru6hqvuus0g"',
  summary: 'New Test',
  updated: '2021-02-22T14:18:36.088Z',
  timeZone: 'Europe/Lisbon',
  accessRole: 'owner',
  defaultReminders: [],
  nextSyncToken: 'next-sync-token-1',
  items: [
    {
      kind: 'calendar#event',
      etag: '"3226988196172000"',
      id: 'google-event-id-1',
      status: 'confirmed',
      htmlLink: 'https://www.google.com/calendar/event?eid=event-id',
      created: '2021-02-16T16:48:18.000Z',
      updated: '2021-02-16T16:48:18.086Z',
      summary: 'test test',
      creator: {
        email: 'yld@asap.science',
      },
      organizer: {
        email: 'calendar-id@group.calendar.google.com',
        displayName: 'New Test',
        self: true,
      },
      start: {
        date: '2021-02-16',
      },
      end: {
        date: '2021-02-17',
      },
      transparency: 'transparent',
      iCalUID: '152hus88kaljgl5bcq3cclp4dt@google.com',
      sequence: 0,
      reminders: {
        useDefault: false,
      },
    },
    {
      kind: 'calendar#event',
      etag: '"3228007032176000"',
      id: 'google-event-id-2',
      status: 'confirmed',
      htmlLink:
        'https://www.google.com/calendar/event?eid=M3R1OGM2NTIxYnJpaHNmYnN1ZjBlYWF2ZjIgY181dTNiYWs4ZGE3Z3Nma2QzNGF0azAyMTFyZ0Bn',
      created: '2021-02-22T14:18:36.000Z',
      updated: '2021-02-22T14:18:36.088Z',
      creator: {
        email: 'yld@asap.science',
      },
      organizer: {
        email: 'calendar-id@group.calendar.google.com',
        displayName: 'New Test',
        self: true,
      },
      start: {
        dateTime: '2021-02-25T12:30:00Z',
        timeZone: 'Europe/Helsinki',
      },
      end: {
        dateTime: '2021-02-25T13:30:00Z',
        timeZone: 'Europe/Helsinki',
      },
      iCalUID: '3tu8c65avf2@google.com',
      sequence: 0,
      reminders: {
        useDefault: true,
      },
    },
  ],
});

export const googlePayload = (
  googleApiToken: string,
  resourceId: string,
  channelId: string,
) => ({
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
    'x-goog-channel-id': channelId,
    'x-goog-message-number': '1',
    'x-goog-resource-id': resourceId,
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
});

export const getGoogleCalenderEventRecord = ({
  resourceId = '42',
  channelId = '47',
} = {}): SQSRecord => ({
  messageId: '7',
  receiptHandle: 'a handle',
  body: '',
  attributes: {
    ApproximateReceiveCount: '1',
    SentTimestamp: '',
    SenderId: '11',
    ApproximateFirstReceiveTimestamp: '',
  },
  messageAttributes: {
    ResourceId: {
      dataType: 'String',
      stringValue: resourceId,
    },
    ChannelId: { dataType: 'String', stringValue: channelId },
  },
  md5OfBody: '',
  eventSource: '',
  eventSourceARN: '',
  awsRegion: '',
});
export const getGoogleCalenderEventProcessPayload = (
  overrides: Partial<SQSRecord> = {},
): SQSEvent => ({
  Records: [
    {
      ...getGoogleCalenderEventRecord(),
      ...overrides,
    },
  ],
});

export const getGoogleCalenderEventPayloads = (items: number): SQSEvent => ({
  Records: Array.from({ length: items }, (_, idx) =>
    getGoogleCalenderEventRecord({ resourceId: `${idx}`, channelId: `${idx}` }),
  ),
});
