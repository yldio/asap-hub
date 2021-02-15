import nock from 'nock';
import { Settings } from 'luxon';
import { config } from '@asap-hub/squidex';
import { identity } from '../helpers/squidex';
import Events, {
  buildGraphQLQueryFetchEvents,
  ResponseFetchEvents,
  buildGraphQLQueryFetchEvent,
  ResponseFetchEvent,
} from '../../src/controllers/events';
import { ListEventResponse } from '@asap-hub/model';
import {
  fetchEventsResponse,
  listEventBaseResponse,
  graphqlEvent,
  findEventResponse,
  eventBaseResponse,
} from '../fixtures/events.fixtures';

describe('Event controller', () => {
  const events = new Events();

  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  describe('Fetch method', () => {
    test('Should return an empty result when the client returns an empty array of data', async () => {
      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, (body) => body.query)
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
        .post(`/api/content/${config.appName}/graphql`, (body) => body.query)
        .reply(200, fetchEventsResponse);

      const result = await events.fetch({
        before: 'before',
      });

      expect(result).toEqual(listEventBaseResponse);
    });

    describe('Query', () => {
      test('Should apply the "after" filter', async () => {
        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, {
            query: buildGraphQLQueryFetchEvents(
              'data/endDate/iv gt after-date',
            ),
          })
          .reply(200, fetchEventsResponse);

        await events.fetch({
          after: 'after-date',
        });
      });

      test('Should apply the "before" filter', async () => {
        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, {
            query: buildGraphQLQueryFetchEvents(
              'data/startDate/iv lt before-date',
            ),
          })
          .reply(200, fetchEventsResponse);

        await events.fetch({
          before: 'before-date',
        });
      });

      test('Should apply both the "after" and "before" filters', async () => {
        const expectedFilter =
          'data/endDate/iv gt after-date and data/startDate/iv lt before-date';

        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, {
            query: buildGraphQLQueryFetchEvents(expectedFilter),
          })
          .reply(200, fetchEventsResponse);

        await events.fetch({
          after: 'after-date',
          before: 'before-date',
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

        const fetchEventsResponse: { data: ResponseFetchEvents } = {
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

        expect(items[0].meetingLink).toBe('some-link');
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

        const fetchEventsResponse: { data: ResponseFetchEvents } = {
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

        expect(items[0].meetingLink).toBe('some-link');
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

        const fetchEventsResponse: { data: ResponseFetchEvents } = {
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

        expect(items[0].meetingLink).toBeUndefined();
      });
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
          query: buildGraphQLQueryFetchEvent(eventId),
        })
        .reply(200, findEventResponse);

      const result = await events.fetchById(eventId);
      expect(result).toEqual(eventBaseResponse);
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

        const fetchEventResponse: { data: ResponseFetchEvent } = {
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

        const fetchEventResponse: { data: ResponseFetchEvent } = {
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

        const fetchEventResponse: { data: ResponseFetchEvent } = {
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
});
