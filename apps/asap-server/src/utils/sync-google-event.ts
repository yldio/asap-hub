import { calendar_v3 as calendarV3 } from 'googleapis';
import { EventController } from '../controllers/events';

const syncEventFactory = (
  calendarId: string,
  eventsController: EventController,
) => {
  const syncEvent = async (event: calendarV3.Schema$Event): Promise<void> => {
    if (!event.id) {
      return Promise.resolve();
    }

    const squidexEvent = {
      title: event.summary ?? null,
      //description: string;
      //startDate: string;
      //startDateTimeZone: string;
      //endDate: string;
      //endDateTimeZone: string;
      //status: event.status;
      calendar: [calendarId],
      //tags: []
    };

    return await eventsController.upsert(event.id, squidexEvent);
  };
  return syncEvent;
};

const event: calendarV3.Schema$Event = {
  kind: 'calendar#event',
  etag: '"3228679679662000"',
  id: '04rteq6hj3gfq9g3i8v2oqetvd',
  status: 'confirmed',
  htmlLink:
    'https://www.google.com/calendar/event?eid=MDRydGVxNmhqM2dmcTlnM2k4djJvcWV0dmQgY181dTNiYWs4ZGE3Z3Nma2QzNGF0azAyMTFyZ0Bn',
  created: '2021-02-26T11:43:59.000Z',
  updated: '2021-02-26T11:43:59.831Z',
  summary: 'Event Title',
  description: '\u003cb\u003eEvent Description\u003c/b\u003e',
  creator: {
    email: 'yld@asap.science',
  },
  organizer: {
    email: 'c_5u3bak8da7gsfkd34atk0211rg@group.calendar.google.com',
    displayName: 'New Test',
    self: true,
  },
  start: {
    date: '2021-02-27',
  },
  end: {
    date: '2021-02-28',
  },
  transparency: 'transparent',
  iCalUID: '04rteq6hj3gfq9g3i8v2oqetvd@google.com',
  sequence: 0,
  reminders: {
    useDefault: false,
  },
};
const response: calendarV3.Schema$Events = {
  kind: 'calendar#events',
  etag: '"p32kf1d6cni3uu0g"',
  summary: 'Test Calendar',
  updated: '2021-02-26T11:44:14.121Z',
  timeZone: 'Europe/Lisbon',
  accessRole: 'owner',
  defaultReminders: [],
  nextSyncToken: 'CKjwtMy8h-8CEKjwtMy8h-8CGAUgu8TmqgE=',
  items: [
    {
      kind: 'calendar#event',
      etag: '"3226988196172000"',
      id: '152hus88kaljgl5bcq3cclp4dt',
      status: 'confirmed',
      htmlLink:
        'https://www.google.com/calendar/event?eid=MTUyaHVzODhrYWxqZ2w1YmNxM2NjbHA0ZHQgY181dTNiYWs4ZGE3Z3Nma2QzNGF0azAyMTFyZ0Bn',
      created: '2021-02-16T16:48:18.000Z',
      updated: '2021-02-16T16:48:18.086Z',
      summary: 'test test',
      creator: {
        email: 'yld@asap.science',
      },
      organizer: {
        email: 'c_5u3bak8da7gsfkd34atk0211rg@group.calendar.google.com',
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
      etag: '"3228314084466000"',
      id: '3tu8c6521brihsfbsuf0eaavf2',
      status: 'confirmed',
      htmlLink:
        'https://www.google.com/calendar/event?eid=M3R1OGM2NTIxYnJpaHNmYnN1ZjBlYWF2ZjIgY181dTNiYWs4ZGE3Z3Nma2QzNGF0azAyMTFyZ0Bn',
      created: '2021-02-22T14:18:36.000Z',
      updated: '2021-02-24T08:57:22.233Z',
      summary: 'test',
      description: '\u003cb\u003etest test\u003c/b\u003e',
      creator: {
        email: 'yld@asap.science',
      },
      organizer: {
        email: 'c_5u3bak8da7gsfkd34atk0211rg@group.calendar.google.com',
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
      iCalUID: '3tu8c6521brihsfbsuf0eaavf2@google.com',
      sequence: 0,
      reminders: {
        useDefault: true,
      },
    },
    {
      kind: 'calendar#event',
      etag: '"3228327423940000"',
      id: '7a9hdrkqqdhk52u6o0vp0r1sc0',
      status: 'confirmed',
      htmlLink:
        'https://www.google.com/calendar/event?eid=N2E5aGRya3FxZGhrNTJ1Nm8wdnAwcjFzYzAgY181dTNiYWs4ZGE3Z3Nma2QzNGF0azAyMTFyZ0Bn',
      created: '2021-02-24T10:48:31.000Z',
      updated: '2021-02-24T10:48:31.970Z',
      summary: 'no tz',
      creator: {
        email: 'yld@asap.science',
      },
      organizer: {
        email: 'c_5u3bak8da7gsfkd34atk0211rg@group.calendar.google.com',
        displayName: 'New Test',
        self: true,
      },
      start: {
        dateTime: '2021-02-26T11:00:00Z',
      },
      end: {
        dateTime: '2021-02-26T12:00:00Z',
      },
      iCalUID: '7a9hdrkqqdhk52u6o0vp0r1sc0@google.com',
      sequence: 0,
      reminders: {
        useDefault: true,
      },
    },
  ],
};
