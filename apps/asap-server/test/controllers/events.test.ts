import nock from 'nock';
import { Settings } from 'luxon';
import { config, Event } from '@asap-hub/squidex';
import { identity } from '../helpers/squidex';
import Events from '../../src/controllers/events';
import { ListEventResponse, EventStatus } from '@asap-hub/model';
import {
  fetchEventsResponse,
  listEventResponse,
  graphqlEvent,
  findEventResponse,
  eventResponse,
  getRestEvent,
} from '../fixtures/events.fixtures';
import { queryGroupsResponse } from '../fixtures/groups.fixtures';
import { print } from 'graphql';
import {
  FETCH_EVENT,
  FETCH_EVENTS,
  FETCH_GROUP_CALENDAR,
} from '../../src/queries/events.queries';
import { FetchEventQuery, FetchEventsQuery } from '../../src/gql/graphql';

describe('Event controller', () => {
  const events = new Events();

  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('Fetch method', () => {
    test('Should return an empty result when the client returns an empty array of data', async () => {
      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_EVENTS),
          variables: {
            filter: 'data/hidden/iv ne true and data/endDate/iv lt before',
            order: '',
            top: 10,
            skip: 0,
          },
        })
        .reply(200, {
          data: {
            queryEventsContentsWithTotal: {
              total: 0,
              items: [],
            },
          },
        });

      const result = await events.fetch({
        before: 'before',
      });

      const expectedResponse: ListEventResponse = {
        total: 0,
        items: [],
      };

      expect(result).toEqual(expectedResponse);
    });

    test('Should return a list of events', async () => {
      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_EVENTS),
          variables: {
            filter: 'data/hidden/iv ne true and data/endDate/iv lt before',
            order: '',
            top: 10,
            skip: 0,
          },
        })
        .reply(200, fetchEventsResponse);

      const result = await events.fetch({
        before: 'before',
      });

      expect(result).toEqual(listEventResponse);
    });

    test('Should return event thumbnail', async () => {
      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_EVENTS),
          variables: {
            filter: 'data/hidden/iv ne true and data/endDate/iv lt before',
            order: '',
            top: 10,
            skip: 0,
          },
        })
        .reply(200, fetchEventsResponse);

      const result = await events.fetch({
        before: 'before',
      });

      expect(result).toEqual(listEventResponse);
    });

    test('Should apply the filter to remove hidden events by default', async () => {
      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_EVENTS),
          variables: {
            filter: 'data/hidden/iv ne true and data/endDate/iv gt after-date',
            order: '',
            top: 10,
            skip: 0,
          },
        })
        .reply(200, fetchEventsResponse);

      await events.fetch({
        after: 'after-date',
      });
    });

    describe('Date filters', () => {
      test('Should apply the "after" filter to the end-date', async () => {
        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, {
            query: print(FETCH_EVENTS),
            variables: {
              filter:
                'data/hidden/iv ne true and data/endDate/iv gt after-date',
              order: '',
              top: 10,
              skip: 0,
            },
          })
          .reply(200, fetchEventsResponse);

        await events.fetch({
          after: 'after-date',
        });
      });

      test('Should apply the "before" filter to the end-date', async () => {
        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, {
            query: print(FETCH_EVENTS),
            variables: {
              filter:
                'data/hidden/iv ne true and data/endDate/iv lt before-date',
              order: '',
              top: 10,
              skip: 0,
            },
          })
          .reply(200, fetchEventsResponse);

        await events.fetch({
          before: 'before-date',
        });
      });

      test('Should apply both the "after" and "before" filters', async () => {
        const expectedFilter =
          'data/hidden/iv ne true and data/endDate/iv gt after-date and data/endDate/iv lt before-date';

        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, {
            query: print(FETCH_EVENTS),
            variables: {
              filter: expectedFilter,
              order: '',
              top: 10,
              skip: 0,
            },
          })
          .reply(200, fetchEventsResponse);

        await events.fetch({
          after: 'after-date',
          before: 'before-date',
        });
      });

      test('Should apply search query params', async () => {
        const expectedFilter =
          "(contains(data/title/iv, 'a') or contains(data/tags/iv, 'a')) and data/hidden/iv ne true and data/endDate/iv gt after-date";

        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, {
            query: print(FETCH_EVENTS),
            variables: {
              filter: expectedFilter,
              order: '',
              top: 10,
              skip: 0,
            },
          })
          .reply(200, fetchEventsResponse);

        await events.fetch({
          after: 'after-date',
          search: 'a',
        });
      });

      test('Should sanitise single quotes by doubling them and encoding to hex', async () => {
        const expectedFilter =
          "(contains(data/title/iv, '%27%27') or contains(data/tags/iv, '%27%27')) and data/hidden/iv ne true and data/endDate/iv gt after-date";

        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, {
            query: print(FETCH_EVENTS),
            variables: {
              filter: expectedFilter,
              order: '',
              top: 10,
              skip: 0,
            },
          })
          .reply(200, fetchEventsResponse);

        await events.fetch({
          after: 'after-date',
          search: "'",
        });
      });

      test('Should sanitise double quotation mark by encoding to hex', async () => {
        const expectedFilter =
          "(contains(data/title/iv, '%22') or contains(data/tags/iv, '%22')) and data/hidden/iv ne true and data/endDate/iv gt after-date";

        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, {
            query: print(FETCH_EVENTS),
            variables: {
              filter: expectedFilter,
              order: '',
              top: 10,
              skip: 0,
            },
          })
          .reply(200, fetchEventsResponse);

        await events.fetch({
          after: 'after-date',
          search: '"',
        });
      });
    });

    describe('Group filter', () => {
      const groupId = 'some-group-id';

      test('Should throw a Not Found error when the event is not found', async () => {
        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, /findGroupsContent/)
          .reply(200, {
            data: {
              findGroupsContent: null,
            },
          });

        await expect(
          events.fetch({
            after: 'after-date',
            groupId,
          }),
        ).rejects.toThrow('Not Found');
      });

      test('Should apply the "groupId" filter', async () => {
        const findGroupResponse = {
          data: {
            findGroupsContent: {
              flatData: {
                calendars: [
                  {
                    id: 'calendar-id-1',
                  },
                ],
              },
            },
          },
        };

        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, {
            query: print(FETCH_GROUP_CALENDAR),
            variables: {
              id: groupId,
            },
          })
          .reply(200, findGroupResponse);

        const expectedFilter =
          "data/hidden/iv ne true and data/endDate/iv gt after-date and data/calendar/iv in ['calendar-id-1']";

        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, {
            query: print(FETCH_EVENTS),
            variables: {
              filter: expectedFilter,
              order: '',
              top: 10,
              skip: 0,
            },
          })
          .reply(200, fetchEventsResponse);

        await events.fetch({
          after: 'after-date',
          groupId,
        });
      });
    });

    describe('Sorting', () => {
      const expectedFilter =
        'data/hidden/iv ne true and data/endDate/iv gt after-date';

      test('Should apply the "orderBy" option using the startDate field and ascending order', async () => {
        const expectedOrder = 'data/startDate/iv asc';

        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, {
            query: print(FETCH_EVENTS),
            variables: {
              filter: expectedFilter,
              order: expectedOrder,
              top: 10,
              skip: 0,
            },
          })
          .reply(200, fetchEventsResponse);

        await events.fetch({
          after: 'after-date',
          sortBy: 'startDate',
          sortOrder: 'asc',
        });
      });

      test('Should apply the "orderBy" option using the endDate field and descending order', async () => {
        const expectedOrder = 'data/endDate/iv desc';

        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, {
            query: print(FETCH_EVENTS),
            variables: {
              filter: expectedFilter,
              order: expectedOrder,
              top: 10,
              skip: 0,
            },
          })
          .reply(200, fetchEventsResponse);

        await events.fetch({
          after: 'after-date',
          sortBy: 'endDate',
          sortOrder: 'desc',
        });
      });

      test('Should not apply any order if the parameters are not provided', async () => {
        const expectedOrder = '';

        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, {
            query: print(FETCH_EVENTS),
            variables: {
              filter: expectedFilter,
              order: expectedOrder,
              top: 10,
              skip: 0,
            },
          })
          .reply(200, fetchEventsResponse);

        await events.fetch({
          after: 'after-date',
        });
      });
    });

    describe('Event link', () => {
      let fakeDate: jest.MockedFunction<typeof Date.now>;
      const realDate = Date.now.bind(Date);

      beforeAll(() => {
        fakeDate = jest.fn<number, []>();
        Settings.now = fakeDate;
      });

      afterAll(() => {
        Settings.now = realDate;
      });

      afterEach(() => {
        fakeDate.mockClear();
      });

      test('Should reveal the event link when the event starts in less than 24h from now', async () => {
        const event = graphqlEvent;
        event.flatData!.meetingLink = 'some-link';

        // mock todays date to year 06/06/2020
        fakeDate.mockReturnValue(
          new Date('2020-06-06T13:00:00.000Z').getTime(),
        );
        // change event start date to 06/06/2020, one hour from the above
        event.flatData!.startDate = '2020-06-06T14:00:00Z';

        const fetchEventsResponse: { data: FetchEventsQuery } = {
          data: {
            queryEventsContentsWithTotal: {
              total: 2,
              items: [event],
            },
          },
        };

        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, (body) => body.query)
          .reply(200, fetchEventsResponse);

        const { items } = await events.fetch({
          before: 'before',
        });

        expect(items[0]!.meetingLink).toBe('some-link');
      });

      test('Should reveal the event link when the event start date is in the past', async () => {
        const event = graphqlEvent;
        event.flatData!.meetingLink = 'some-link';

        // mock todays date to year 2021
        fakeDate.mockReturnValueOnce(
          new Date('2021-06-06T13:00:00.000Z').getTime(),
        );
        // change event start date to 2020
        event.flatData!.startDate = '2020-06-06T14:00:00Z';

        const fetchEventsResponse: { data: FetchEventsQuery } = {
          data: {
            queryEventsContentsWithTotal: {
              total: 2,
              items: [event],
            },
          },
        };

        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, (body) => body.query)
          .reply(200, fetchEventsResponse);

        const { items } = await events.fetch({
          before: 'before',
        });

        expect(items[0]!.meetingLink).toBe('some-link');
      });

      test('Should remove the event link when the event starts in more than 24h from now', async () => {
        const event = graphqlEvent;
        event.flatData!.meetingLink = 'some-link';

        // mock todays date to year 2020
        fakeDate.mockReturnValueOnce(
          new Date('2020-06-06T13:00:00.000Z').getTime(),
        );
        // change event start date to year 2021
        event.flatData!.startDate = '2021-06-06T13:00:00Z';

        const fetchEventsResponse: { data: FetchEventsQuery } = {
          data: {
            queryEventsContentsWithTotal: {
              total: 2,
              items: [event],
            },
          },
        };

        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, (body) => body.query)
          .reply(200, fetchEventsResponse);

        const { items } = await events.fetch({
          before: 'before',
        });

        expect(items[0]!.meetingLink).toBeUndefined();
      });
    });
  });

  describe('Past event materials states', () => {
    const eventId = 'group-id-1';
    const eventBase = JSON.parse(
      JSON.stringify(
        fetchEventsResponse.data.queryEventsContentsWithTotal!.items![0],
      ),
    );

    test('Should return permanentlyUnavailable details if details are permanentlyUnavailable on the CMS', async () => {
      const pUnavailableEventRes = eventBase;
      pUnavailableEventRes.flatData!.endDate = '2009-12-24T16:20:14Z';
      pUnavailableEventRes.flatData!.notesPermanentlyUnavailable = true;
      pUnavailableEventRes.flatData!.videoRecordingPermanentlyUnavailable =
        true;
      pUnavailableEventRes.flatData!.presentationPermanentlyUnavailable = true;
      pUnavailableEventRes.flatData!.meetingMaterialsPermanentlyUnavailable =
        true;

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_EVENT),
          variables: {
            id: eventId,
          },
        })
        .reply(200, {
          data: { findEventsContent: pUnavailableEventRes },
        });

      const result = await events.fetchById(eventId);
      expect(result).toEqual({
        ...eventResponse,
        notes: null,
        videoRecording: null,
        presentation: null,
        meetingMaterials: null,
      });
    });

    test('Should return permanentlyUnavailable details if enough time has passed and details are empty', async () => {
      const emptyEvent = eventBase;
      emptyEvent.flatData!.notes = null;
      emptyEvent.flatData!.videoRecording = null;
      emptyEvent.flatData!.presentation = null;
      emptyEvent.flatData!.meetingMaterials = null;
      emptyEvent.flatData!.notesPermanentlyUnavailable = null;
      emptyEvent.flatData!.videoRecordingPermanentlyUnavailable = null;
      emptyEvent.flatData!.presentationPermanentlyUnavailable = null;
      emptyEvent.flatData!.meetingMaterialsPermanentlyUnavailable = null;

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_EVENT),
          variables: {
            id: eventId,
          },
        })
        .reply(200, { data: { findEventsContent: emptyEvent } });

      const result = await events.fetchById(eventId);
      expect(result).toEqual({
        ...eventResponse,
        notes: null,
        videoRecording: null,
        presentation: null,
        meetingMaterials: null,
      });
    });

    test('Should return empty (undefined) details if empty but the event is fresh', async () => {
      const now = new Date().toISOString();
      const emptyEvent = eventBase;
      emptyEvent.flatData!.endDate = now;
      emptyEvent.flatData!.notes = null;
      emptyEvent.flatData!.videoRecording = null;
      emptyEvent.flatData!.presentation = null;
      emptyEvent.flatData!.meetingMaterials = null;
      emptyEvent.flatData!.notesPermanentlyUnavailable = null;
      emptyEvent.flatData!.videoRecordingPermanentlyUnavailable = null;
      emptyEvent.flatData!.presentationPermanentlyUnavailable = null;
      emptyEvent.flatData!.meetingMaterialsPermanentlyUnavailable = null;

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_EVENT),
          variables: {
            id: eventId,
          },
        })
        .reply(200, { data: { findEventsContent: emptyEvent } });

      const result = await events.fetchById(eventId);
      expect(result).toEqual({
        ...eventResponse,
        endDate: now,
        notes: undefined,
        videoRecording: undefined,
        presentation: undefined,
        meetingMaterials: [],
      });
    });

    test('Should return meeting details if these are not marked as permanently unavailable', async () => {
      const eventResponse = eventBase;
      eventResponse.flatData!.notes = 'These are the notes from the meeting';
      eventResponse.flatData!.videoRecording = '<embeded>video</embeded>';
      eventResponse.flatData!.presentation = '<embeded>presentation</embeded>';
      eventResponse.flatData!.meetingMaterials = [
        {
          title: 'My additional link',
          url: 'https://link.pt/additional-material',
        },
        {
          title: 'My other additional link',
          url: 'https://link.pt/additional-material-2',
        },
      ];

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_EVENT),
          variables: {
            id: eventId,
          },
        })
        .reply(200, { data: { findEventsContent: eventResponse } });

      const result = await events.fetchById(eventId);
      expect(result).toEqual(
        expect.objectContaining({
          notes: 'These are the notes from the meeting',
          videoRecording: '<embeded>video</embeded>',
          presentation: '<embeded>presentation</embeded>',
          meetingMaterials: [
            {
              title: 'My additional link',
              url: 'https://link.pt/additional-material',
            },
            {
              title: 'My other additional link',
              url: 'https://link.pt/additional-material-2',
            },
          ],
        }),
      );
    });
  });

  describe('Fetch by id method', () => {
    test('Should throw a Not Found error when the event is not found', async () => {
      const eventId = 'not-found';

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, (body) => body.query)
        .reply(200, {
          data: {
            findEventsContent: null,
          },
        });

      await expect(events.fetchById(eventId)).rejects.toThrow('Not Found');
    });

    test('Should return the event', async () => {
      const eventId = 'group-id-1';

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_EVENT),
          variables: {
            id: eventId,
          },
        })
        .reply(200, findEventResponse);

      const result = await events.fetchById(eventId);
      expect(result).toEqual(eventResponse);
    });

    describe('Event link', () => {
      let fakeDate: jest.MockedFunction<typeof Date.now>;
      const realDate = Date.now.bind(Date);

      beforeAll(() => {
        fakeDate = jest.fn<number, []>();
        Settings.now = fakeDate;
      });

      afterAll(() => {
        Settings.now = realDate;
      });

      afterEach(() => {
        fakeDate.mockClear();
      });

      test('Should reveal the event link when the event starts in less than 24h from now', async () => {
        const event = graphqlEvent;
        event.flatData!.meetingLink = 'some-link';

        // mock todays date to year 06/06/2020
        fakeDate.mockReturnValue(
          new Date('2020-06-06T13:00:00.000Z').getTime(),
        );
        // change event start date to 06/06/2020, one hour from the above
        event.flatData!.startDate = '2020-06-06T14:00:00Z';

        const fetchEventResponse: { data: FetchEventQuery } = {
          data: {
            findEventsContent: event,
          },
        };

        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, (body) => body.query)
          .reply(200, fetchEventResponse);

        const response = await events.fetchById(event.id);

        expect(response.meetingLink).toBe('some-link');
      });

      test('Should reveal the event link when the event start date is in the past', async () => {
        const event = graphqlEvent;
        event.flatData!.meetingLink = 'some-link';

        // mock todays date to year 2021
        fakeDate.mockReturnValueOnce(
          new Date('2021-06-06T13:00:00.000Z').getTime(),
        );
        // change event start date to 2020
        event.flatData!.startDate = '2020-06-06T14:00:00Z';

        const fetchEventResponse: { data: FetchEventQuery } = {
          data: {
            findEventsContent: event,
          },
        };

        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, (body) => body.query)
          .reply(200, fetchEventResponse);

        const response = await events.fetchById(event.id);

        expect(response.meetingLink).toBe('some-link');
      });

      test('Should remove the event link when the event starts in more than 24h from now', async () => {
        const event = graphqlEvent;
        event.flatData!.meetingLink = 'some-link';

        // mock todays date to year 2020
        fakeDate.mockReturnValueOnce(
          new Date('2020-06-06T13:00:00.000Z').getTime(),
        );
        // change event start date to year 2021
        event.flatData!.startDate = '2021-06-06T13:00:00Z';

        const fetchEventResponse: { data: FetchEventQuery } = {
          data: {
            findEventsContent: event,
          },
        };

        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, (body) => body.query)
          .reply(200, fetchEventResponse);

        const response = await events.fetchById(event.id);
        expect(response.meetingLink).toBeUndefined();
      });
    });
  });

  describe('Event groups', () => {
    const eventId = 'group-id-1';

    test('Should return the first group when event calendar is referenced by multiple groups', async () => {
      const findEventResponseMultiRef = {
        data: {
          findEventsContent:
            fetchEventsResponse.data.queryEventsContentsWithTotal!.items![0],
          referencingGroupsContents:
            queryGroupsResponse.data.queryGroupsContentsWithTotal.items,
        },
      };

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_EVENT),
          variables: {
            id: eventId,
          },
        })
        .reply(200, findEventResponseMultiRef);

      const result = await events.fetchById(eventId);
      expect(result).toEqual(eventResponse);
    });

    test('Should return one group when event calendar is referenced by single group', async () => {
      const findEventResponseSingleRef = {
        data: {
          findEventsContent:
            fetchEventsResponse.data.queryEventsContentsWithTotal!.items![0],
        },
        referencingGroupsContents: [
          queryGroupsResponse.data.queryGroupsContentsWithTotal.items[0],
        ],
      };

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_EVENT),
          variables: {
            id: eventId,
          },
        })
        .reply(200, findEventResponseSingleRef);

      const result = await events.fetchById(eventId);
      expect(result).toEqual(eventResponse);
    });

    test('Should return not return group when event calendar is not referenced by any group', async () => {
      const findEventResponseSingleRef = {
        data: {
          findEventsContent:
            fetchEventsResponse.data.queryEventsContentsWithTotal!.items![0],
        },
      };
      findEventResponseSingleRef.data.findEventsContent!.flatData!.calendar![0]!.referencingGroupsContents =
        [];

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_EVENT),
          variables: {
            id: eventId,
          },
        })
        .reply(200, findEventResponse);

      const result = await events.fetchById(eventId);
      expect(result).toEqual({ ...eventResponse, group: undefined });
    });
  });

  describe('Create method', () => {
    const calendarId = 'squidex-calendar-id';
    const eventData: Event = {
      googleId: 'google-event-id',
      title: 'Event Tittle',
      description: 'This event will be good',
      startDate: '2021-02-23T19:32:00Z',
      startDateTimeZone: 'Europe/Lisbon',
      endDate: '2021-02-23T19:32:00Z',
      endDateTimeZone: 'Europe/Lisbon',
      calendar: [calendarId],
      status: 'confirmed' as EventStatus,
      tags: [],
      hidden: false,
    };

    test('Should create or update the event', async () => {
      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/events?publish=true`, {
          googleId: { iv: 'google-event-id' },
          title: { iv: 'Event Tittle' },
          description: { iv: 'This event will be good' },
          startDate: { iv: '2021-02-23T19:32:00Z' },
          startDateTimeZone: { iv: 'Europe/Lisbon' },
          endDate: { iv: '2021-02-23T19:32:00Z' },
          endDateTimeZone: { iv: 'Europe/Lisbon' },
          calendar: { iv: [calendarId] },
          status: { iv: 'confirmed' },
          tags: { iv: [] },
          hidden: { iv: false },
        })
        .reply(200, getRestEvent());

      await events.create(eventData);
    });

    test('Should throw when squidex return an error', async () => {
      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/events?publish=true`)
        .reply(404);

      await expect(events.create(eventData)).rejects.toThrow();
    });
  });

  describe('Update method', () => {
    const eventId = 'event-id';
    const eventData: Partial<Event> = {
      tags: ['kubernetes'],
      meetingLink: 'https://zweem.com',
    };

    test('Should update the event', async () => {
      nock(config.baseUrl)
        .patch(`/api/content/${config.appName}/events/${eventId}`, {
          tags: { iv: ['kubernetes'] },
          meetingLink: { iv: 'https://zweem.com' },
        })
        .reply(200, getRestEvent());

      const result = await events.update(eventId, eventData);
      expect(result).toStrictEqual(getRestEvent());
    });

    test('Should throw when squidex return an error', async () => {
      nock(config.baseUrl)
        .patch(`/api/content/${config.appName}/events/${eventId}`)
        .reply(404);

      await expect(events.update(eventId, eventData)).rejects.toThrow();
    });
  });

  describe('fetchByGoogleId method', () => {
    const googleId = 'google-event-id';
    const filter = `data/googleId/iv eq '${googleId}'`;

    test('Should throw when gets an error from squidex', async () => {
      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/events`)
        .query({
          $top: 1,
          $filter: filter,
        })
        .reply(500);

      await expect(events.fetchByGoogleId(googleId)).rejects.toThrow();
    });

    test('Should return null when squidex returns an empty array', async () => {
      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/events`)
        .query({
          $top: 1,
          $filter: filter,
        })
        .reply(200, { total: 0, items: [] });

      const result = await events.fetchByGoogleId(googleId);
      expect(result).toBeNull;
    });

    test('Should return the event when finds it', async () => {
      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/events`)
        .query({
          $top: 1,
          $filter: filter,
        })
        .reply(200, { total: 1, items: [getRestEvent()] });

      const result = await events.fetchByGoogleId(googleId);
      expect(result).toEqual(getRestEvent());
    });
  });
});
