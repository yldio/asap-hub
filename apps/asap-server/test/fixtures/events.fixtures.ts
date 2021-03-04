// import { ListEventsResponse } from '@asap-hub/model';
import {
  ResponseFetchEvents,
  ResponseFetchEvent,
} from '../../src/controllers/events';
import { GraphqlEvent, RestEvent, config } from '@asap-hub/squidex';
import { queryGroupsExpectation, queryGroupsResponse } from './groups.fixtures';
import {
  ListEventResponse,
  GroupResponse,
  EventResponse,
  EventStatus,
} from '@asap-hub/model';

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
            endDateTimeZone: 'Europe/London',
            startDate: '2009-12-02T16:19:31Z',
            startDateTimeZone: 'Europe/London',
            thumbnail: [
              {
                id: 'uuid-thumbnail-2',
                created: '2021-02-08T16:04:56Z',
                lastModified: '2021-02-08T16:22:12Z',
              },
            ],
            notes: 'These are the notes from the meeting',
            videoRecording: '<embeded>video</embeded>',
            presentation: '<embeded>presentation</embeded>',
            meetingMaterials: [
              {
                title: 'My additional link',
                url: 'https://link.pt/additional-material',
                label: 'Use this to know more stuff',
              },
            ],
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
                referencingGroupsContents:
                  queryGroupsResponse.data.queryGroupsContentsWithTotal.items,
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
            endDateTimeZone: 'Europe/London',
            startDate: '2021-02-08T16:20:32Z',
            startDateTimeZone: 'Europe/London',
            meetingLink: null,
            notes: null,
            videoRecording: null,
            presentation: null,
            meetingMaterials: null,
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
                referencingGroupsContents:
                  queryGroupsResponse.data.queryGroupsContentsWithTotal.items,
              },
            ],
          },
        },
      ],
    },
  },
};

export const listEventResponse: ListEventResponse = {
  total: 2,
  items: [
    {
      id: 'afcee0ec-fcd5-479c-9809-e397636f815a',
      title: 'Example Event',
      startDate: '2009-12-02T16:19:31.000Z',
      startDateTimeZone: 'Europe/London',
      endDate: '2009-12-24T16:20:14.000Z',
      endDateTimeZone: 'Europe/London',
      description: 'This event is awesome',
      thumbnail: `${config.baseUrl}/api/assets/${config.appName}/uuid-thumbnail-2`,
      lastModifiedDate: '2021-02-08T16:22:12.000Z',
      notes: 'These are the notes from the meeting',
      videoRecording: '<embeded>video</embeded>',
      presentation: '<embeded>presentation</embeded>',
      meetingMaterials: [
        {
          title: 'My additional link',
          url: 'https://link.pt/additional-material',
          label: 'Use this to know more stuff',
        },
      ],
      meetingLink: 'https://zoom.com/room/123',
      status: 'Cancelled',
      tags: ['A'],
      calendar: {
        id: 'c_t92qa82jd702q1fkreoi0hf4hk@group.calendar.google.com',
        color: '#125A12',
        name: 'Tech 1 - Sequencing/omics',
      },
      groups: queryGroupsExpectation.items as GroupResponse[],
    },
    {
      id: 'a820b5b7-8f7a-4297-a5a5-cf48b53ba3f7',
      title: 'This is another event',
      description: '',
      startDate: '2021-02-08T16:20:32.000Z',
      startDateTimeZone: 'Europe/London',
      endDate: '2021-02-08T16:20:32.000Z',
      endDateTimeZone: 'Europe/London',
      thumbnail: `${config.baseUrl}/api/assets/${config.appName}/uuid-thumbnail-1`,
      lastModifiedDate: '2021-02-08T16:20:35.000Z',
      status: 'Confirmed',
      meetingMaterials: [],
      tags: ['B'],
      calendar: {
        id: 'c_v8ma9lsbsjf90rk30ougr54iig@group.calendar.google.com',
        color: '#7A367A',
        name: 'Tech 3 - Structural Biology',
      },
      groups: queryGroupsExpectation.items as GroupResponse[],
    },
  ],
};

export const eventResponse: EventResponse = {
  id: 'afcee0ec-fcd5-479c-9809-e397636f815a',
  title: 'Example Event',
  description: 'This event is awesome',
  startDate: '2009-12-02T16:19:31.000Z',
  startDateTimeZone: 'Europe/London',
  endDate: '2009-12-24T16:20:14.000Z',
  endDateTimeZone: 'Europe/London',
  thumbnail: `${config.baseUrl}/api/assets/${config.appName}/uuid-thumbnail-2`,
  lastModifiedDate: '2021-02-08T16:22:12.000Z',
  meetingLink: 'https://zoom.com/room/123',
  notes: 'These are the notes from the meeting',
  videoRecording: '<embeded>video</embeded>',
  presentation: '<embeded>presentation</embeded>',
  meetingMaterials: [
    {
      title: 'My additional link',
      url: 'https://link.pt/additional-material',
      label: 'Use this to know more stuff',
    },
  ],
  tags: ['A'],
  status: 'Cancelled',
  calendar: {
    id: 'c_t92qa82jd702q1fkreoi0hf4hk@group.calendar.google.com',
    color: '#125A12',
    name: 'Tech 1 - Sequencing/omics',
  },
  groups: queryGroupsExpectation.items as GroupResponse[],
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

export const restEvent: RestEvent = {
  id: 'squidex-event-id',
  created: '2021-02-23T19:32:00Z',
  lastModified: '2021-02-23T19:32:00Z',
  data: {
    googleId: { iv: 'google-event-id' },
    title: { iv: 'Event Tittle' },
    description: { iv: 'This event will be good' },
    startDate: { iv: '2021-02-23T19:32:00Z' },
    startDateTimeZone: { iv: 'Europe/Lisbon' },
    endDate: { iv: '2021-02-23T19:32:00Z' },
    endDateTimeZone: { iv: 'Europe/Lisbon' },
    calendar: { iv: ['squidex-calendar-id'] },
    status: { iv: 'Confirmed' },
    tags: { iv: [] },
    meetingLink: { iv: 'https://meetings.com' },
    hidden: { iv: false },
  },
};
