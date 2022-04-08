import { CalendarPayload } from '../../../../src/handlers/event-bus';

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

const inOrderfirstSave = (): CalendarPayload => ({
  type: 'CalendarsUpdated',
  payload: {
    $type: 'EnrichedContentEvent',
    type: 'Updated',
    id: '7893b163-845c-4a2a-828b-fffdce58d892',
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
      resourceId: {
        iv: 'sKri07TmMhg7qhDoWLcnlVuEg7k',
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
      resourceId: {
        iv: 'sKri07TmMhg7qhDoWLcnlVuEg7k',
      },
    },
    version: 28,
  },
});

const inOrderfirstSaveUpdateFromUnSubscribe = (): CalendarPayload => ({
  type: 'CalendarsUpdated',
  payload: {
    $type: 'EnrichedContentEvent',
    type: 'Updated',
    id: '7893b163-845c-4a2a-828b-fffdce58d892',
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
      resourceId: {
        iv: null as unknown as string,
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
      resourceId: {
        iv: 'sKri07TmMhg7qhDoWLcnlVuEg7k',
      },
    },
    version: 29,
  },
});

const inOrderSecondSave = (): CalendarPayload => ({
  type: 'CalendarsUpdated',
  payload: {
    $type: 'EnrichedContentEvent',
    type: 'Updated',
    id: '7893b163-845c-4a2a-828b-fffdce58d892',
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
      resourceId: {
        iv: null as unknown as string,
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
      resourceId: {
        iv: null as unknown as string,
      },
    },
    version: 30,
  },
});

const inOrderSecondUpdateFromSubscribe = (): CalendarPayload => ({
  type: 'CalendarsUpdated',
  payload: {
    $type: 'EnrichedContentEvent',
    type: 'Updated',
    id: '7893b163-845c-4a2a-828b-fffdce58d892',
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
      resourceId: {
        iv: 'sKri07TmMhg7qhDoWLcnlVuEg7k',
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
      resourceId: {
        iv: null as unknown as string,
      },
    },
    version: 31,
  },
});

const outOfOrderFirstSave = (): CalendarPayload => ({
  type: 'CalendarsUpdated',
  payload: {
    $type: 'EnrichedContentEvent',
    type: 'Updated',
    id: '7893b163-845c-4a2a-828b-fffdce58d892',
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
      resourceId: {
        iv: 'sKri07TmMhg7qhDoWLcnlVuEg7k',
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
      resourceId: {
        iv: 'sKri07TmMhg7qhDoWLcnlVuEg7k',
      },
    },
    version: 32,
  },
});

const outOfOrderSecondSave = (): CalendarPayload => ({
  type: 'CalendarsUpdated',
  payload: {
    $type: 'EnrichedContentEvent',
    type: 'Updated',
    id: '7893b163-845c-4a2a-828b-fffdce58d892',
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
      resourceId: {
        iv: 'sKri07TmMhg7qhDoWLcnlVuEg7k',
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
      resourceId: {
        iv: 'sKri07TmMhg7qhDoWLcnlVuEg7k',
      },
    },
    version: 33,
  },
});

const outOfOrderSecondUpdateFromUnsubscribe = (): CalendarPayload => ({
  type: 'CalendarsUpdated',
  payload: {
    $type: 'EnrichedContentEvent',
    type: 'Updated',
    id: '7893b163-845c-4a2a-828b-fffdce58d892',
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
      resourceId: {
        iv: null as unknown as string,
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
      resourceId: {
        iv: 'sKri07TmMhg7qhDoWLcnlVuEg7k',
      },
    },
    version: 34,
  },
});

const outOfOrderSecondUpdateFromSubscribe = (): CalendarPayload => ({
  type: 'CalendarsUpdated',
  payload: {
    $type: 'EnrichedContentEvent',
    type: 'Updated',
    id: '7893b163-845c-4a2a-828b-fffdce58d892',
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
      resourceId: {
        iv: 'sKri07TmMhg7qhDoWLcnlVuEg7k',
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
      resourceId: {
        iv: null as unknown as string,
      },
    },
    version: 35,
  },
});
