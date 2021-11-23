import { Calendar, WebhookPayload } from '@asap-hub/squidex';

export {
  inOrderfirstSave,
  inOrderfirstSaveUpdateFromUnSubscribe,
  inOrderSecondSave,
  inOrderSecondUpdateFromSubscribe,
  outOfOrderFirstSave,
  outOfOrderSecondSave,
  outOfOrderSecondUpdateFromUnsubscribe,
  outOfOrderSecondUpdateFromSubscribe,
};

const inOrderfirstSave = (): WebhookPayload<Calendar> => ({
  type: 'CalendarsUpdated',
  timestamp: '2021-11-18T11:17:56Z',
  payload: {
    $type: 'EnrichedContentEvent',
    type: 'Updated',
    id: '7893b163-845c-4a2a-828b-fffdce58d892',
    created: '2021-11-17T10:23:36Z',
    lastModified: '2021-11-18T11:17:56Z',
    createdBy: 'subject:6058c1ce6d296b4d1681c3ad',
    lastModifiedBy: 'subject:6058c1ce6d296b4d1681c3ad',
    data: {
      name: {
        iv: 'Test Calendar',
      },
      googleCalendarId: {
        iv: 'xc_6iufjv0mkkvg6so7e5sjpf9q04@group.calendar.google.com',
      },
      color: {
        iv: '#88880E',
      },
      syncToken: {
        iv: 'CKi5iLSgn_QCEKi5iLSgn_QCGAoggeSZwwE=',
      },
      resourceId: {
        iv: 'sKri07TmMhg7qhDoWLcnlVuEg7k',
      },
      expirationDate: {
        iv: 1639818365000,
      },
    },
    dataOld: {
      name: {
        iv: 'Test Calendar',
      },
      googleCalendarId: {
        iv: 'c_6iufjv0mkkvg6so7e5sjpf9q04@group.calendar.google.com',
      },
      color: {
        iv: '#88880E',
      },
      syncToken: {
        iv: 'CKi5iLSgn_QCEKi5iLSgn_QCGAoggeSZwwE=',
      },
      resourceId: {
        iv: 'sKri07TmMhg7qhDoWLcnlVuEg7k',
      },
      expirationDate: {
        iv: 1639818365000,
      },
    },
    status: 'Published',
    partition: -219897643,
    schemaId: 'fd1de49a-8d97-47c4-b8e5-d4be8a1457a9,calendars',
    actor: 'subject:6058c1ce6d296b4d1681c3ad',
    appId: 'd6c66ed5-8b8d-47f2-a677-d60a2d5bd8f0,1153',
    timestamp: '2021-11-18T11:17:56Z',
    name: 'CalendarsUpdated',
    version: 28,
  },
});

const inOrderfirstSaveUpdateFromUnSubscribe = (): WebhookPayload<Calendar> => ({
  type: 'CalendarsUpdated',
  timestamp: '2021-11-18T11:18:09Z',
  payload: {
    $type: 'EnrichedContentEvent',
    type: 'Updated',
    id: '7893b163-845c-4a2a-828b-fffdce58d892',
    created: '2021-11-17T10:23:36Z',
    lastModified: '2021-11-18T11:18:09Z',
    createdBy: 'subject:6058c1ce6d296b4d1681c3ad',
    lastModifiedBy: 'subject:6058c1ce6d296b4d1681c3ad',
    data: {
      name: {
        iv: 'Test Calendar',
      },
      googleCalendarId: {
        iv: 'xc_6iufjv0mkkvg6so7e5sjpf9q04@group.calendar.google.com',
      },
      color: {
        iv: '#88880E',
      },
      syncToken: {
        iv: 'CKi5iLSgn_QCEKi5iLSgn_QCGAoggeSZwwE=',
      },
      resourceId: {
        iv: null as unknown as string,
      },
      expirationDate: {
        iv: 1639818365000,
      },
    },
    dataOld: {
      name: {
        iv: 'Test Calendar',
      },
      googleCalendarId: {
        iv: 'xc_6iufjv0mkkvg6so7e5sjpf9q04@group.calendar.google.com',
      },
      color: {
        iv: '#88880E',
      },
      syncToken: {
        iv: 'CKi5iLSgn_QCEKi5iLSgn_QCGAoggeSZwwE=',
      },
      resourceId: {
        iv: 'sKri07TmMhg7qhDoWLcnlVuEg7k',
      },
      expirationDate: {
        iv: 1639818365000,
      },
    },
    status: 'Published',
    partition: -219897643,
    schemaId: 'fd1de49a-8d97-47c4-b8e5-d4be8a1457a9,calendars',
    actor: 'subject:6058c1ce6d296b4d1681c3ad',
    appId: 'd6c66ed5-8b8d-47f2-a677-d60a2d5bd8f0,1153',
    timestamp: '2021-11-18T11:18:09Z',
    name: 'CalendarsUpdated',
    version: 29,
  },
});

const inOrderSecondSave = (): WebhookPayload<Calendar> => ({
  type: 'CalendarsUpdated',
  timestamp: '2021-11-18T11:32:25Z',
  payload: {
    $type: 'EnrichedContentEvent',
    type: 'Updated',
    id: '7893b163-845c-4a2a-828b-fffdce58d892',
    created: '2021-11-17T10:23:36Z',
    lastModified: '2021-11-18T11:32:25Z',
    createdBy: 'subject:6058c1ce6d296b4d1681c3ad',
    lastModifiedBy: 'subject:6058c1ce6d296b4d1681c3ad',
    data: {
      name: {
        iv: 'Test Calendar',
      },
      googleCalendarId: {
        iv: 'c_6iufjv0mkkvg6so7e5sjpf9q04@group.calendar.google.com',
      },
      color: {
        iv: '#88880E',
      },
      syncToken: {
        iv: 'CKi5iLSgn_QCEKi5iLSgn_QCGAoggeSZwwE=',
      },
      resourceId: {
        iv: null as unknown as string,
      },
      expirationDate: {
        iv: 1639818365000,
      },
    },
    dataOld: {
      name: {
        iv: 'Test Calendar',
      },
      googleCalendarId: {
        iv: 'xc_6iufjv0mkkvg6so7e5sjpf9q04@group.calendar.google.com',
      },
      color: {
        iv: '#88880E',
      },
      syncToken: {
        iv: 'CKi5iLSgn_QCEKi5iLSgn_QCGAoggeSZwwE=',
      },
      resourceId: {
        iv: null as unknown as string,
      },
      expirationDate: {
        iv: 1639818365000,
      },
    },
    status: 'Published',
    partition: -219897643,
    schemaId: 'fd1de49a-8d97-47c4-b8e5-d4be8a1457a9,calendars',
    actor: 'subject:6058c1ce6d296b4d1681c3ad',
    appId: 'd6c66ed5-8b8d-47f2-a677-d60a2d5bd8f0,1153',
    timestamp: '2021-11-18T11:32:25Z',
    name: 'CalendarsUpdated',
    version: 30,
  },
});

const inOrderSecondUpdateFromSubscribe = (): WebhookPayload<Calendar> => ({
  type: 'CalendarsUpdated',
  timestamp: '2021-11-18T11:32:40Z',
  payload: {
    $type: 'EnrichedContentEvent',
    type: 'Updated',
    id: '7893b163-845c-4a2a-828b-fffdce58d892',
    created: '2021-11-17T10:23:36Z',
    lastModified: '2021-11-18T11:32:40Z',
    createdBy: 'subject:6058c1ce6d296b4d1681c3ad',
    lastModifiedBy: 'subject:6058c1ce6d296b4d1681c3ad',
    data: {
      name: {
        iv: 'Test Calendar',
      },
      googleCalendarId: {
        iv: 'c_6iufjv0mkkvg6so7e5sjpf9q04@group.calendar.google.com',
      },
      color: {
        iv: '#88880E',
      },
      syncToken: {
        iv: 'CKi5iLSgn_QCEKi5iLSgn_QCGAoggeSZwwE=',
      },
      resourceId: {
        iv: 'sKri07TmMhg7qhDoWLcnlVuEg7k',
      },
      expirationDate: {
        iv: 1639827159000,
      },
    },
    dataOld: {
      name: {
        iv: 'Test Calendar',
      },
      googleCalendarId: {
        iv: 'c_6iufjv0mkkvg6so7e5sjpf9q04@group.calendar.google.com',
      },
      color: {
        iv: '#88880E',
      },
      syncToken: {
        iv: 'CKi5iLSgn_QCEKi5iLSgn_QCGAoggeSZwwE=',
      },
      resourceId: {
        iv: null as unknown as string,
      },
      expirationDate: {
        iv: 1639818365000,
      },
    },
    status: 'Published',
    partition: -219897643,
    schemaId: 'fd1de49a-8d97-47c4-b8e5-d4be8a1457a9,calendars',
    actor: 'subject:6058c1ce6d296b4d1681c3ad',
    appId: 'd6c66ed5-8b8d-47f2-a677-d60a2d5bd8f0,1153',
    timestamp: '2021-11-18T11:32:40Z',
    name: 'CalendarsUpdated',
    version: 31,
  },
});

const outOfOrderFirstSave = (): WebhookPayload<Calendar> => ({
  type: 'CalendarsUpdated',
  timestamp: '2021-11-18T13:03:55Z',
  payload: {
    $type: 'EnrichedContentEvent',
    type: 'Updated',
    id: '7893b163-845c-4a2a-828b-fffdce58d892',
    created: '2021-11-17T10:23:36Z',
    lastModified: '2021-11-18T13:03:55Z',
    createdBy: 'subject:6058c1ce6d296b4d1681c3ad',
    lastModifiedBy: 'subject:6058c1ce6d296b4d1681c3ad',
    data: {
      name: {
        iv: 'Test Calendar',
      },
      googleCalendarId: {
        iv: 'xc_6iufjv0mkkvg6so7e5sjpf9q04@group.calendar.google.com',
      },
      color: {
        iv: '#88880E',
      },
      syncToken: {
        iv: 'CKi5iLSgn_QCEKi5iLSgn_QCGAoggeSZwwE=',
      },
      resourceId: {
        iv: 'sKri07TmMhg7qhDoWLcnlVuEg7k',
      },
      expirationDate: {
        iv: 1639827159000,
      },
    },
    dataOld: {
      name: {
        iv: 'Test Calendar',
      },
      googleCalendarId: {
        iv: 'c_6iufjv0mkkvg6so7e5sjpf9q04@group.calendar.google.com',
      },
      color: {
        iv: '#88880E',
      },
      syncToken: {
        iv: 'CKi5iLSgn_QCEKi5iLSgn_QCGAoggeSZwwE=',
      },
      resourceId: {
        iv: 'sKri07TmMhg7qhDoWLcnlVuEg7k',
      },
      expirationDate: {
        iv: 1639827159000,
      },
    },
    status: 'Published',
    partition: -219897643,
    schemaId: 'fd1de49a-8d97-47c4-b8e5-d4be8a1457a9,calendars',
    actor: 'subject:6058c1ce6d296b4d1681c3ad',
    appId: 'd6c66ed5-8b8d-47f2-a677-d60a2d5bd8f0,1153',
    timestamp: '2021-11-18T13:03:55Z',
    name: 'CalendarsUpdated',
    version: 32,
  },
});

const outOfOrderSecondSave = (): WebhookPayload<Calendar> => ({
  type: 'CalendarsUpdated',
  timestamp: '2021-11-18T13:03:58Z',
  payload: {
    $type: 'EnrichedContentEvent',
    type: 'Updated',
    id: '7893b163-845c-4a2a-828b-fffdce58d892',
    created: '2021-11-17T10:23:36Z',
    lastModified: '2021-11-18T13:03:58Z',
    createdBy: 'subject:6058c1ce6d296b4d1681c3ad',
    lastModifiedBy: 'subject:6058c1ce6d296b4d1681c3ad',
    data: {
      name: {
        iv: 'Test Calendar',
      },
      googleCalendarId: {
        iv: 'c_6iufjv0mkkvg6so7e5sjpf9q04@group.calendar.google.com',
      },
      color: {
        iv: '#88880E',
      },
      syncToken: {
        iv: 'CKi5iLSgn_QCEKi5iLSgn_QCGAoggeSZwwE=',
      },
      resourceId: {
        iv: 'sKri07TmMhg7qhDoWLcnlVuEg7k',
      },
      expirationDate: {
        iv: 1639827159000,
      },
    },
    dataOld: {
      name: {
        iv: 'Test Calendar',
      },
      googleCalendarId: {
        iv: 'xc_6iufjv0mkkvg6so7e5sjpf9q04@group.calendar.google.com',
      },
      color: {
        iv: '#88880E',
      },
      syncToken: {
        iv: 'CKi5iLSgn_QCEKi5iLSgn_QCGAoggeSZwwE=',
      },
      resourceId: {
        iv: 'sKri07TmMhg7qhDoWLcnlVuEg7k',
      },
      expirationDate: {
        iv: 1639827159000,
      },
    },
    status: 'Published',
    partition: -219897643,
    schemaId: 'fd1de49a-8d97-47c4-b8e5-d4be8a1457a9,calendars',
    actor: 'subject:6058c1ce6d296b4d1681c3ad',
    appId: 'd6c66ed5-8b8d-47f2-a677-d60a2d5bd8f0,1153',
    timestamp: '2021-11-18T13:03:58Z',
    name: 'CalendarsUpdated',
    version: 33,
  },
});

const outOfOrderSecondUpdateFromUnsubscribe = (): WebhookPayload<Calendar> => ({
  type: 'CalendarsUpdated',
  timestamp: '2021-11-18T13:04:07Z',
  payload: {
    $type: 'EnrichedContentEvent',
    type: 'Updated',
    id: '7893b163-845c-4a2a-828b-fffdce58d892',
    created: '2021-11-17T10:23:36Z',
    lastModified: '2021-11-18T13:04:07Z',
    createdBy: 'subject:6058c1ce6d296b4d1681c3ad',
    lastModifiedBy: 'subject:6058c1ce6d296b4d1681c3ad',
    data: {
      name: {
        iv: 'Test Calendar',
      },
      googleCalendarId: {
        iv: 'c_6iufjv0mkkvg6so7e5sjpf9q04@group.calendar.google.com',
      },
      color: {
        iv: '#88880E',
      },
      syncToken: {
        iv: 'CKi5iLSgn_QCEKi5iLSgn_QCGAoggeSZwwE=',
      },
      resourceId: {
        iv: null as unknown as string,
      },
      expirationDate: {
        iv: 1639827159000,
      },
    },
    dataOld: {
      name: {
        iv: 'Test Calendar',
      },
      googleCalendarId: {
        iv: 'c_6iufjv0mkkvg6so7e5sjpf9q04@group.calendar.google.com',
      },
      color: {
        iv: '#88880E',
      },
      syncToken: {
        iv: 'CKi5iLSgn_QCEKi5iLSgn_QCGAoggeSZwwE=',
      },
      resourceId: {
        iv: 'sKri07TmMhg7qhDoWLcnlVuEg7k',
      },
      expirationDate: {
        iv: 1639827159000,
      },
    },
    status: 'Published',
    partition: -219897643,
    schemaId: 'fd1de49a-8d97-47c4-b8e5-d4be8a1457a9,calendars',
    actor: 'subject:6058c1ce6d296b4d1681c3ad',
    appId: 'd6c66ed5-8b8d-47f2-a677-d60a2d5bd8f0,1153',
    timestamp: '2021-11-18T13:04:07Z',
    name: 'CalendarsUpdated',
    version: 34,
  },
});

const outOfOrderSecondUpdateFromSubscribe = (): WebhookPayload<Calendar> => ({
  type: 'CalendarsUpdated',
  timestamp: '2021-11-18T13:04:08Z',
  payload: {
    $type: 'EnrichedContentEvent',
    type: 'Updated',
    id: '7893b163-845c-4a2a-828b-fffdce58d892',
    created: '2021-11-17T10:23:36Z',
    lastModified: '2021-11-18T13:04:08Z',
    createdBy: 'subject:6058c1ce6d296b4d1681c3ad',
    lastModifiedBy: 'subject:6058c1ce6d296b4d1681c3ad',
    data: {
      name: {
        iv: 'Test Calendar',
      },
      googleCalendarId: {
        iv: 'c_6iufjv0mkkvg6so7e5sjpf9q04@group.calendar.google.com',
      },
      color: {
        iv: '#88880E',
      },
      syncToken: {
        iv: 'CKi5iLSgn_QCEKi5iLSgn_QCGAoggeSZwwE=',
      },
      resourceId: {
        iv: 'sKri07TmMhg7qhDoWLcnlVuEg7k',
      },
      expirationDate: {
        iv: 1639832647000,
      },
    },
    dataOld: {
      name: {
        iv: 'Test Calendar',
      },
      googleCalendarId: {
        iv: 'c_6iufjv0mkkvg6so7e5sjpf9q04@group.calendar.google.com',
      },
      color: {
        iv: '#88880E',
      },
      syncToken: {
        iv: 'CKi5iLSgn_QCEKi5iLSgn_QCGAoggeSZwwE=',
      },
      resourceId: {
        iv: null as unknown as string,
      },
      expirationDate: {
        iv: 1639827159000,
      },
    },
    status: 'Published',
    partition: -219897643,
    schemaId: 'fd1de49a-8d97-47c4-b8e5-d4be8a1457a9,calendars',
    actor: 'subject:6058c1ce6d296b4d1681c3ad',
    appId: 'd6c66ed5-8b8d-47f2-a677-d60a2d5bd8f0,1153',
    timestamp: '2021-11-18T13:04:08Z',
    name: 'CalendarsUpdated',
    version: 35,
  },
});
