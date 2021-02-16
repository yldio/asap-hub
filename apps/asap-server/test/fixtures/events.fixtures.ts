// import { ListEventsResponse } from '@asap-hub/model';
import {
  ResponseFetchEvents,
  ListEventBaseResponse,
  ResponseFetchEvent,
  EventBaseResponse,
} from '../../src/controllers/events';
import { GraphqlEvent } from '@asap-hub/squidex';

export const fetchEventsResponse: { data: ResponseFetchEvents } = {
  data: {
    queryEventsContentsWithTotal: {
      total: 2,
      items: [
        {
          id: 'afcee0ec-fcd5-479c-9809-e397636f815a',
          created: '2021-02-08T16:04:56Z',
          lastModified: '2021-02-08T16:22:12Z',
          flatData: {
            description: 'This event is awesome',
            endDate: '2009-12-24T16:20:14Z',
            startDate: '2009-12-02T16:19:31Z',
            meetingLink: 'https://zoom.com/room/123',
            status: 'Cancelled',
            tags: ['A'],
            title: 'Example Event',
            calendar: [
              {
                id: 'd7e3181a-f9d3-4f0c-bc77-5f17c722d93e',
                created: '2021-01-14T16:38:40Z',
                lastModified: '2021-01-14T16:38:40Z',
                flatData: {
                  id: 'c_t92qa82jd702q1fkreoi0hf4hk@group.calendar.google.com',
                  color: '#125A12',
                  name: 'Tech 1 - Sequencing/omics',
                },
              },
            ],
          },
        },
        {
          id: 'a820b5b7-8f7a-4297-a5a5-cf48b53ba3f7',
          created: '2021-02-08T16:10:08Z',
          lastModified: '2021-02-08T16:20:35Z',
          flatData: {
            description: null,
            endDate: '2021-02-08T16:20:32Z',
            startDate: '2021-02-08T16:20:32Z',
            meetingLink: null,
            status: 'Confirmed',
            tags: ['B'],
            title: 'This is another event',
            calendar: [
              {
                id: 'fff13135-711a-4478-a3b3-0a97fed7bffc',
                created: '2021-01-14T16:39:17Z',
                lastModified: '2021-01-14T16:39:17Z',
                flatData: {
                  id: 'c_v8ma9lsbsjf90rk30ougr54iig@group.calendar.google.com',
                  color: '#7A367A',
                  name: 'Tech 3 - Structural Biology',
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export const listEventBaseResponse: ListEventBaseResponse = {
  total: 2,
  items: [
    {
      id: 'afcee0ec-fcd5-479c-9809-e397636f815a',
      title: 'Example Event',
      startDate: '2009-12-02T16:19:31.000Z',
      endDate: '2009-12-24T16:20:14.000Z',
      description: 'This event is awesome',
      lastModifiedDate: '2021-02-08T16:22:12.000Z',
      meetingLink: 'https://zoom.com/room/123',
      status: 'Cancelled',
      tags: ['A'],
      calendar: {
        id: 'c_t92qa82jd702q1fkreoi0hf4hk@group.calendar.google.com',
        color: '#125A12',
        name: 'Tech 1 - Sequencing/omics',
      },
    },
    {
      id: 'a820b5b7-8f7a-4297-a5a5-cf48b53ba3f7',
      title: 'This is another event',
      description: '',
      startDate: '2021-02-08T16:20:32.000Z',
      endDate: '2021-02-08T16:20:32.000Z',
      lastModifiedDate: '2021-02-08T16:20:35.000Z',
      status: 'Confirmed',
      tags: ['B'],
      calendar: {
        id: 'c_v8ma9lsbsjf90rk30ougr54iig@group.calendar.google.com',
        color: '#7A367A',
        name: 'Tech 3 - Structural Biology',
      },
    },
  ],
};

export const eventBaseResponse: EventBaseResponse = {
  id: 'afcee0ec-fcd5-479c-9809-e397636f815a',
  title: 'Example Event',
  description: 'This event is awesome',
  startDate: '2009-12-02T16:19:31.000Z',
  endDate: '2009-12-24T16:20:14.000Z',
  lastModifiedDate: '2021-02-08T16:22:12.000Z',
  meetingLink: 'https://zoom.com/room/123',
  tags: ['A'],
  status: 'Cancelled',
  calendar: {
    id: 'c_t92qa82jd702q1fkreoi0hf4hk@group.calendar.google.com',
    color: '#125A12',
    name: 'Tech 1 - Sequencing/omics',
  },
};

export const graphqlEvent: GraphqlEvent = {
  id: 'afcee0ec-fcd5-479c-9809-e397636f815a',
  created: '2021-02-08T16:04:56Z',
  lastModified: '2021-02-08T16:22:12Z',
  flatData: {
    description: 'This event is awesome',
    endDate: '2009-12-24T16:20:14Z',
    startDate: '2009-12-02T16:19:31Z',
    meetingLink: 'https://zoom.com/room/123',
    status: 'Confirmed',
    tags: [],
    title: 'Example Event',
    calendar: [
      {
        id: 'd7e3181a-f9d3-4f0c-bc77-5f17c722d93e',
        created: '2021-01-14T16:38:40Z',
        lastModified: '2021-01-14T16:38:40Z',
        flatData: {
          id: 'c_t92qa82jd702q1fkreoi0hf4hk@group.calendar.google.com',
          color: '#125A12',
          name: 'Tech 1 - Sequencing/omics',
        },
      },
    ],
  },
};

export const findEventResponse: { data: ResponseFetchEvent } = {
  data: {
    findEventsContent:
      fetchEventsResponse.data.queryEventsContentsWithTotal.items[0],
  },
};
