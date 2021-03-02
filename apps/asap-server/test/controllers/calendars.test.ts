import nock from 'nock';
import Calendars from '../../src/controllers/calendars';
import { identity } from '../helpers/squidex';
import { config, Results, RestCalendar } from '@asap-hub/squidex';

describe('Dashboard controller', () => {
  const calendars = new Calendars();

  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
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
        .reply(200, getCalendarsResponse);

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

      await expect(calendars.fetchByResouceId(resourceId)).rejects.toThrow(
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

      await expect(calendars.fetchByResouceId(resourceId)).rejects.toThrow(
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

      const result = await calendars.fetchByResouceId(resourceId);

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

      nock(config.baseUrl)
        .patch(`/api/content/${config.appName}/calendars/${calendarId}`, {
          syncToken: { iv: syncToken },
        })
        .reply(200, updateCalendarResponse);

      const result = await calendars.update(calendarId, { syncToken });

      expect(result).toEqual({
        id: 'calendar-id-1',
        color: '#5C1158',
        name: 'Kubernetes Meetups',
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

      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/calendars/${calendarId}`)
        .reply(200, updateCalendarResponse);

      const result = await calendars.getSyncToken(calendarId);

      expect(result).toEqual('google-sync-token');
    });
  });
});

const updateCalendarResponse = {
  id: 'cms-calendar-id-1',
  data: {
    id: { iv: 'calendar-id-1' },
    color: { iv: '#5C1158' },
    name: { iv: 'Kubernetes Meetups' },
    syncToken: { iv: 'google-sync-token' },
  },
  created: '2021-01-07T16:44:09Z',
  lastModified: '2021-01-07T16:44:09Z',
};

const getCalendarsResponse: Results<RestCalendar> = {
  total: 2,
  items: [
    {
      id: 'cms-calendar-id-1',
      data: {
        id: { iv: 'calendar-id-1' },
        color: { iv: '#5C1158' },
        name: { iv: 'Kubernetes Meetups' },
      },
      created: '2021-01-07T16:44:09Z',
      lastModified: '2021-01-07T16:44:09Z',
    },
    {
      id: 'cms-calendar-id-2',
      data: {
        id: { iv: 'calendar-id-2' },
        color: { iv: '#B1365F' },
        name: { iv: 'Service Mesh Conferences' },
      },
      created: '2021-01-07T16:44:09Z',
      lastModified: '2021-01-07T16:44:09Z',
    },
  ],
};
