import nock from 'nock';
import { config } from '@asap-hub/squidex';
import { notFound } from '@hapi/boom';
import { print } from 'graphql';

import Calendars from '../../src/controllers/calendars';
import { identity } from '../helpers/squidex';
import {
  getCalendarRaw,
  getCalendarResponse,
  getCalendarsGraphqlResponse,
  getCalendarsRestResponse,
  getRestCalendar,
} from '../fixtures/calendars.fixtures';
import { FETCH_CALENDAR } from '../../src/queries/calendars.queries';

describe('Calendars controller', () => {
  const calendars = new Calendars();

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
    test('Should return an empty result when the no calendars are found', async () => {
      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/calendars`)
        .query({
          q: JSON.stringify({
            take: 50,
            skip: 0,
            sort: [{ path: 'data.name.iv', order: 'ascending' }],
          }),
        })
        .reply(200, { total: 0, items: [] });

      const result = await calendars.fetch({ take: 50, skip: 0 });

      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should return the the calendars', async () => {
      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/calendars`)
        .query({
          q: JSON.stringify({
            take: 20,
            skip: 10,
            sort: [{ path: 'data.name.iv', order: 'ascending' }],
          }),
        })
        .reply(200, getCalendarsRestResponse());

      const result = await calendars.fetch({ take: 20, skip: 10 });

      expect(result).toEqual({
        total: 2,
        items: [
          {
            id: 'calendar-id-1',
            color: '#5C1158',
            name: 'Kubernetes Meetups',
          },
          {
            id: 'calendar-id-2',
            color: '#B1365F',
            name: 'Service Mesh Conferences',
          },
        ],
      });
    });
  });

  describe('FetchRaw method', () => {
    test('Should return an empty result when the no calendars are found', async () => {
      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/calendars`)
        .query({
          q: JSON.stringify({
            take: 50,
            skip: 0,
            sort: [{ path: 'data.name.iv', order: 'ascending' }],
          }),
        })
        .reply(200, { total: 0, items: [] });

      const result = await calendars.fetchRaw({ take: 50, skip: 0 });

      expect(result).toEqual([]);
    });

    test('Should query calendars by expiration date and return them', async () => {
      const maxExpiration = 1614697798681;

      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/calendars`)
        .query({
          q: JSON.stringify({
            take: 50,
            skip: 0,
            sort: [{ path: 'data.name.iv', order: 'ascending' }],
            filter: {
              path: 'data.expirationDate.iv',
              op: 'lt',
              value: maxExpiration,
            },
          }),
        })
        .reply(200, getCalendarsRestResponse());

      const result = await calendars.fetchRaw({
        take: 50,
        skip: 0,
        maxExpiration,
      });

      expect(result).toEqual([
        {
          id: 'cms-calendar-id-1',
          googleCalendarId: 'calendar-id-1',
          color: '#5C1158',
          name: 'Kubernetes Meetups',
          resourceId: 'resource-id',
          syncToken: 'sync-token',
          expirationDate: 1614697798681,
        },
        {
          id: 'cms-calendar-id-2',
          googleCalendarId: 'calendar-id-2',
          color: '#B1365F',
          name: 'Service Mesh Conferences',
          resourceId: 'resource-id-2',
          syncToken: 'sync-token-2',
          expirationDate: 1614697621081,
        },
      ]);
    });
  });

  describe('FetchById method', () => {
    test('Should throw an error when the calendar is not found', async () => {
      const calendarId = 'not-found';

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_CALENDAR),
          variables: {
            id: calendarId,
          },
        })
        .reply(200, {
          data: {
            findCalendarsContent: null,
          },
        });

      await expect(calendars.fetchById(calendarId)).rejects.toThrow(notFound());
    });

    test('Should return the calendar response', async () => {
      const calendarId = 'calendar-id-1';

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_CALENDAR),
          variables: {
            id: calendarId,
          },
        })
        .reply(200, getCalendarsGraphqlResponse());

      const result = await calendars.fetchById(calendarId);

      expect(result).toEqual(getCalendarResponse());
    });

    test('Should throw if squidex response has invalid colour', async () => {
      const id = 'calendar-id-1';
      const response = {
        ...getCalendarResponse(),
        color: 'invalid',
        id,
      };

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_CALENDAR),
          variables: {
            id,
          },
        })
        .reply(200, response);

      await expect(calendars.fetchById(id)).rejects.toThrow();
    });

    test('Should return the calendar raw response', async () => {
      const calendarId = 'calendar-id-1';

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, {
          query: print(FETCH_CALENDAR),
          variables: {
            id: calendarId,
          },
        })
        .reply(200, getCalendarsGraphqlResponse());

      const result = await calendars.fetchById(calendarId, { raw: true });

      expect(result).toEqual(getCalendarRaw());
    });
  });

  describe('FetchByResourceId method', () => {
    const resourceId = 'resource-id';
    test('Should throw Bad Gateway when squidex throws an error', async () => {
      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/calendars`)
        .query({
          $top: 1,
          $filter: `data/resourceId/iv eq '${resourceId}'`,
        })
        .reply(500);

      await expect(calendars.fetchByResourceId(resourceId)).rejects.toThrow(
        'Bad Gateway',
      );
    });

    test('Should throw Not Found when squidex returns an empty array', async () => {
      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/calendars`)
        .query({
          $top: 1,
          $filter: `data/resourceId/iv eq '${resourceId}'`,
        })
        .reply(200, { total: 0, items: [] });

      await expect(calendars.fetchByResourceId(resourceId)).rejects.toThrow(
        'Not Found',
      );
    });

    test('Should return the calendar when finds it', async () => {
      const rawCalendarResponse = {
        id: 'cms-calendar-id-1',
        data: {
          id: { iv: 'calendar-id-1' },
          color: { iv: '#5C1158' },
          name: { iv: 'Kubernetes Meetups' },
          syncToken: { iv: 'google-sync-token' },
          resourceId: { iv: resourceId },
          expirationDate: { iv: '2021-01-07T16:44:09Z' },
        },
        created: '2021-01-07T16:44:09Z',
        lastModified: '2021-01-07T16:44:09Z',
      };

      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/calendars`)
        .query({
          $top: 1,
          $filter: `data/resourceId/iv eq '${resourceId}'`,
        })
        .reply(200, { total: 1, items: [rawCalendarResponse] });

      const result = await calendars.fetchByResourceId(resourceId);

      expect(result).toEqual(rawCalendarResponse);
    });
  });

  describe('Update method', () => {
    test('Should throw when calendar does not exist', async () => {
      nock(config.baseUrl)
        .patch(`/api/content/${config.appName}/calendars/calendar-not-found`)
        .reply(404);

      await expect(calendars.update('calendar-not-found', {})).rejects.toThrow(
        'Not Found',
      );
    });

    test('Should return the calendars', async () => {
      const syncToken = 'google-sync-token';
      const calendarId = 'calendar-id';
      const restCalendar = getRestCalendar();

      nock(config.baseUrl)
        .patch(`/api/content/${config.appName}/calendars/${calendarId}`, {
          syncToken: { iv: syncToken },
        })
        .reply(200, restCalendar);

      const result = await calendars.update(calendarId, { syncToken });

      expect(result).toEqual({
        id: restCalendar.data.googleCalendarId.iv,
        color: restCalendar.data.color.iv,
        name: restCalendar.data.name.iv,
      });
    });
  });

  describe('getSyncToken method', () => {
    test('Should throw when calendar does not exist', async () => {
      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/calendars/calendar-not-found`)
        .reply(404);

      await expect(
        calendars.getSyncToken('calendar-not-found'),
      ).rejects.toThrow('Not Found');
    });

    test('Should return the syncToken', async () => {
      const calendarId = 'calendar-id';
      const restCalendar = getRestCalendar();

      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/calendars/${calendarId}`)
        .reply(200, restCalendar);

      const result = await calendars.getSyncToken(calendarId);

      expect(result).toEqual(restCalendar.data.syncToken!.iv);
    });
  });
});
