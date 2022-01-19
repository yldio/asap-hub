import nock from 'nock';
import { config } from '@asap-hub/squidex';
import { badGateway, notFound } from '@hapi/boom';

import Calendars from '../../src/controllers/calendars';
import { identity } from '../helpers/squidex';
import {
  getCalendarRaw,
  getCalendarResponse,
  getCalendarsRestResponse,
  getListCalendarResponse,
  getRestCalendar,
  getSquidexCalendarGraphqlResponse,
  getSquidexCalendarsGraphqlResponse,
  getSquidexGraphqlCalendar,
} from '../fixtures/calendars.fixtures';
import { getSquidexGraphqlClientMockServer } from '../mocks/squidex-graphql-client-with-server.mock';
import { getSquidexGraphqlClientMock } from '../mocks/squidex-graphql-client.mock';

describe('Calendars controller', () => {
  const squidexGraphqlClientMock = getSquidexGraphqlClientMock();
  const calendarsMockGraphqlClient = new Calendars(squidexGraphqlClientMock);

  const squidexGraphqlClientMockServer = getSquidexGraphqlClientMockServer();
  const calendarsMockGraphqlServer = new Calendars(
    squidexGraphqlClientMockServer,
  );

  beforeAll(() => {
    identity();
  });

  describe('Fetch method', () => {
    test('Should fetch the calendars from squidex graphql', async () => {
      const result = await calendarsMockGraphqlServer.fetch();

      expect(result).toMatchObject(getListCalendarResponse());
    });

    test('Should return an empty result when the client returns an empty array of data', async () => {
      const squidexGraphqlResponse = getSquidexCalendarsGraphqlResponse();
      squidexGraphqlResponse.queryCalendarsContentsWithTotal!.total = 0;
      squidexGraphqlResponse.queryCalendarsContentsWithTotal!.items = [];
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await calendarsMockGraphqlClient.fetch();

      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should return an empty result when the client returns a response with query property set to null', async () => {
      const squidexGraphqlResponse = getSquidexCalendarsGraphqlResponse();
      squidexGraphqlResponse.queryCalendarsContentsWithTotal = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await calendarsMockGraphqlClient.fetch();

      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should return an empty result when the client returns a response with items property set to null', async () => {
      const squidexGraphqlResponse = getSquidexCalendarsGraphqlResponse();
      squidexGraphqlResponse.queryCalendarsContentsWithTotal!.items = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await calendarsMockGraphqlClient.fetch();

      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should call the client with the default pagination parameters (pagination disabled)', async () => {
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        getSquidexCalendarsGraphqlResponse(),
      );

      await calendarsMockGraphqlClient.fetch();

      expect(squidexGraphqlClientMock.request).toBeCalledWith(
        expect.anything(),
        {
          top: 50,
          skip: 0,
          filter: '',
          order: 'data/name/iv asc',
        },
      );
    });

    test('Should default the calendar color to #333333', async () => {
      const calendarResponse = getSquidexCalendarsGraphqlResponse();
      calendarResponse.queryCalendarsContentsWithTotal!.items![0]!.flatData.color =
        null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(calendarResponse);

      const response = await calendarsMockGraphqlClient.fetch();

      expect(response.items[0]!.color).toBe('#333333');
    });

    test('Should skip the calendars which belong to an inactive group', async () => {
      const squidexGraphqlResponse = getSquidexCalendarsGraphqlResponse();
      const calendar1Active = getSquidexGraphqlCalendar();
      calendar1Active.flatData.googleCalendarId = 'calendar1@google.com';
      calendar1Active.referencingGroupsContents![0]!.flatData.active = true;

      const calendar2Inactive = getSquidexGraphqlCalendar();
      calendar2Inactive.flatData.googleCalendarId = 'calendar2@google.com';
      calendar2Inactive.referencingGroupsContents![0]!.flatData.active = false;

      const calendar3Active = getSquidexGraphqlCalendar();
      calendar3Active.flatData.googleCalendarId = 'calendar3@google.com';
      calendar3Active.referencingGroupsContents![0]!.flatData.active = true;

      squidexGraphqlResponse.queryCalendarsContentsWithTotal!.items = [
        calendar1Active,
        calendar2Inactive,
        calendar3Active,
      ];
      squidexGraphqlResponse.queryCalendarsContentsWithTotal!.total = 3;

      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await calendarsMockGraphqlClient.fetch();

      const expectedCalendar1 = getCalendarResponse();
      expectedCalendar1.id = calendar1Active.flatData.googleCalendarId;

      const expectedCalendar2 = getCalendarResponse();
      expectedCalendar2.id = calendar3Active.flatData.googleCalendarId;

      expect(result).toEqual({
        total: 2,
        items: [expectedCalendar1, expectedCalendar2],
      });
    });

    test('Should show the calendars which do not belong to any group', async () => {
      const squidexGraphqlResponse = getSquidexCalendarsGraphqlResponse();

      const calendar1 = getSquidexGraphqlCalendar();
      calendar1.flatData.googleCalendarId = 'calendar1@google.com';
      calendar1.referencingGroupsContents = null;
      const calendar2 = getSquidexGraphqlCalendar();
      calendar2.flatData.googleCalendarId = 'calendar1@google.com';
      calendar2.referencingGroupsContents = [];

      const expectedCalendar1 = getCalendarResponse();
      expectedCalendar1.id = calendar1.flatData.googleCalendarId;

      const expectedCalendar2 = getCalendarResponse();
      expectedCalendar2.id = calendar2.flatData.googleCalendarId;

      squidexGraphqlResponse.queryCalendarsContentsWithTotal!.items = [
        calendar1,
        calendar2,
      ];
      squidexGraphqlResponse.queryCalendarsContentsWithTotal!.total = 2;

      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await calendarsMockGraphqlClient.fetch();

      expect(result).toEqual({
        total: 2,
        items: [expectedCalendar1, expectedCalendar2],
      });
    });

    test('Should not skip the calendars which belong to multiple groups of which at least one is active', async () => {
      const squidexGraphqlResponse = getSquidexCalendarsGraphqlResponse();
      const calendar = getSquidexGraphqlCalendar();
      calendar.flatData.googleCalendarId = 'calendar1@google.com';
      calendar.referencingGroupsContents! = [
        {
          flatData: { active: false },
        },
        {
          flatData: { active: true },
        },
      ];
      squidexGraphqlResponse.queryCalendarsContentsWithTotal!.items = [
        calendar,
      ];
      squidexGraphqlResponse.queryCalendarsContentsWithTotal!.total = 1;

      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await calendarsMockGraphqlClient.fetch();

      const expectedListCalendarResponse = getListCalendarResponse();
      expectedListCalendarResponse.items[0]!.id =
        calendar.flatData.googleCalendarId;

      expect(result).toEqual(expectedListCalendarResponse);
    });
  });

  describe('FetchRaw method', () => {
    afterEach(() => {
      expect(nock.isDone()).toBe(true);
    });

    afterEach(() => {
      nock.cleanAll();
    });

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

      const result = await calendarsMockGraphqlClient.fetchRaw({
        take: 50,
        skip: 0,
      });

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

      const result = await calendarsMockGraphqlClient.fetchRaw({
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
          version: 42,
        },
        {
          id: 'cms-calendar-id-2',
          googleCalendarId: 'calendar-id-2',
          color: '#B1365F',
          name: 'Service Mesh Conferences',
          resourceId: 'resource-id-2',
          syncToken: 'sync-token-2',
          expirationDate: 1614697621081,
          version: 42,
        },
      ]);
    });
  });

  describe('FetchById method', () => {
    test('Should fetch the users from squidex graphql', async () => {
      const result = await calendarsMockGraphqlServer.fetchById(
        'calendar-id-1',
      );

      const expected = getCalendarResponse();
      expect(result).toMatchObject(expected);
    });

    test('Should throw an error when the calendar is not found', async () => {
      const calendarId = 'not-found';
      const squidexGraphqlResponse = getSquidexCalendarGraphqlResponse();
      squidexGraphqlResponse.findCalendarsContent = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      await expect(
        calendarsMockGraphqlClient.fetchById(calendarId),
      ).rejects.toThrow(notFound());
    });

    test('Should return the calendar response', async () => {
      const calendarId = 'calendar-id-1';
      const squidexGraphqlResponse = getSquidexCalendarGraphqlResponse();
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await calendarsMockGraphqlClient.fetchById(calendarId);

      expect(result).toEqual(getCalendarResponse());
    });

    test('Should throw if squidex response has invalid colour', async () => {
      const id = 'calendar-id-1';
      const squidexGraphqlResponse = getSquidexCalendarGraphqlResponse();
      squidexGraphqlResponse.findCalendarsContent!.flatData.color = 'invalid';
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      await expect(calendarsMockGraphqlClient.fetchById(id)).rejects.toThrow(
        badGateway('Invalid colour'),
      );
    });

    test('Should throw if missing required data', async () => {
      const id = 'calendar-id-1';
      const squidexGraphqlResponse = getSquidexCalendarGraphqlResponse();
      squidexGraphqlResponse.findCalendarsContent!.flatData.color = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      await expect(calendarsMockGraphqlClient.fetchById(id)).rejects.toThrow(
        badGateway('Missing required data'),
      );
    });

    test('Should return the calendar raw response', async () => {
      const calendarId = 'calendar-id-1';
      const squidexGraphqlResponse = getSquidexCalendarGraphqlResponse();
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await calendarsMockGraphqlClient.fetchById(calendarId, {
        raw: true,
      });

      expect(result).toEqual(getCalendarRaw());
    });
  });

  describe('FetchByResourceId method', () => {
    afterEach(() => {
      expect(nock.isDone()).toBe(true);
    });

    afterEach(() => {
      nock.cleanAll();
    });
    const resourceId = 'resource-id';
    test('Should throw Bad Gateway when squidex throws an error', async () => {
      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/calendars`)
        .query({
          $top: 1,
          $filter: `data/resourceId/iv eq '${resourceId}'`,
        })
        .reply(500);

      await expect(
        calendarsMockGraphqlClient.fetchByResourceId(resourceId),
      ).rejects.toThrow('Bad Gateway');
    });

    test('Should throw Not Found when squidex returns an empty array', async () => {
      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/calendars`)
        .query({
          $top: 1,
          $filter: `data/resourceId/iv eq '${resourceId}'`,
        })
        .reply(200, { total: 0, items: [] });

      await expect(
        calendarsMockGraphqlClient.fetchByResourceId(resourceId),
      ).rejects.toThrow('Not Found');
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

      const result = await calendarsMockGraphqlClient.fetchByResourceId(
        resourceId,
      );

      expect(result).toEqual(rawCalendarResponse);
    });
  });

  describe('Update method', () => {
    afterEach(() => {
      expect(nock.isDone()).toBe(true);
    });

    afterEach(() => {
      nock.cleanAll();
    });
    test('Should throw when calendar does not exist', async () => {
      nock(config.baseUrl)
        .patch(`/api/content/${config.appName}/calendars/calendar-not-found`)
        .reply(404);

      await expect(
        calendarsMockGraphqlClient.update('calendar-not-found', {}),
      ).rejects.toThrow('Not Found');
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

      const result = await calendarsMockGraphqlClient.update(calendarId, {
        syncToken,
      });

      expect(result).toEqual({
        id: restCalendar.data.googleCalendarId.iv,
        color: restCalendar.data.color.iv,
        name: restCalendar.data.name.iv,
      });
    });
  });

  describe('getSyncToken method', () => {
    afterEach(() => {
      expect(nock.isDone()).toBe(true);
    });

    afterEach(() => {
      nock.cleanAll();
    });

    test('Should throw when calendar does not exist', async () => {
      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/calendars/calendar-not-found`)
        .reply(404);

      await expect(
        calendarsMockGraphqlClient.getSyncToken('calendar-not-found'),
      ).rejects.toThrow('Not Found');
    });

    test('Should return the syncToken', async () => {
      const calendarId = 'calendar-id';
      const restCalendar = getRestCalendar();

      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/calendars/${calendarId}`)
        .reply(200, restCalendar);

      const result = await calendarsMockGraphqlClient.getSyncToken(calendarId);

      expect(result).toEqual(restCalendar.data.syncToken!.iv);
    });
  });
});
