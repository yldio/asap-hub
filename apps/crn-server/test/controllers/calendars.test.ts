import nock from 'nock';
import { GenericError, NotFoundError } from '@asap-hub/errors';
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
  calendarsListRestResponse,
  getCalendarInput,
} from '../fixtures/calendars.fixtures';
import { getSquidexGraphqlClientMockServer } from '../mocks/squidex-graphql-client-with-server.mock';
import { getSquidexGraphqlClientMock } from '../mocks/squidex-graphql-client.mock';
import {
  InputCalendar,
  parseToSquidex,
  RestCalendar,
  SquidexRest,
} from '@asap-hub/squidex';
import { getAuthToken } from '../../src/utils/auth';
import { appName, baseUrl } from '../../src/config';
import CalendarSquidexDataProvider from '../../src/data-providers/calendars.data-provider';

describe('Calendars controller', () => {
  const squidexGraphqlClientMock = getSquidexGraphqlClientMock();
  const calendarRestClient = new SquidexRest<RestCalendar, InputCalendar>(
    getAuthToken,
    'calendars',
    { appName, baseUrl },
  );
  const calendarDataProvider = new CalendarSquidexDataProvider(
    calendarRestClient,
    squidexGraphqlClientMock,
  );
  const calendarsController = new Calendars(calendarDataProvider);

  const squidexGraphqlClientMockServer = getSquidexGraphqlClientMockServer();
  const calendarDataProviderMockServer = new CalendarSquidexDataProvider(
    calendarRestClient,
    squidexGraphqlClientMockServer,
  );
  const calendarsControllerMockGraphql = new Calendars(
    calendarDataProviderMockServer,
  );

  beforeAll(() => {
    identity();
    jest.resetAllMocks();
  });

  describe('Fetch method', () => {
    test('Should fetch the calendars from squidex graphql', async () => {
      const result = await calendarsControllerMockGraphql.fetch();

      expect(result).toMatchObject(getListCalendarResponse());
    });

    test('Should return an empty result when the client returns an empty array of data', async () => {
      const squidexGraphqlResponse = getSquidexCalendarsGraphqlResponse();
      squidexGraphqlResponse.queryCalendarsContentsWithTotal!.total = 0;
      squidexGraphqlResponse.queryCalendarsContentsWithTotal!.items = [];
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await calendarsController.fetch();

      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should return an empty result when the client returns a response with query property set to null', async () => {
      const squidexGraphqlResponse = getSquidexCalendarsGraphqlResponse();
      squidexGraphqlResponse.queryCalendarsContentsWithTotal = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await calendarsController.fetch();

      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should return an empty result when the client returns a response with items property set to null', async () => {
      const squidexGraphqlResponse = getSquidexCalendarsGraphqlResponse();
      squidexGraphqlResponse.queryCalendarsContentsWithTotal!.items = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await calendarsController.fetch();

      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should call the client with the default pagination parameters (pagination disabled)', async () => {
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        getSquidexCalendarsGraphqlResponse(),
      );

      await calendarsController.fetch();

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

      const response = await calendarsController.fetch();

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

      const result = await calendarsController.fetch();

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

      const result = await calendarsController.fetch();

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

      const result = await calendarsController.fetch();

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
      nock(baseUrl)
        .get(`/api/content/${appName}/calendars`)
        .query({
          q: JSON.stringify({
            take: 50,
            skip: 0,
            sort: [{ path: 'data.name.iv', order: 'ascending' }],
          }),
        })
        .reply(200, { total: 0, items: [] });

      const result = await calendarsController.fetchRaw({
        take: 50,
        skip: 0,
      });

      expect(result).toEqual([]);
    });

    test('Should query calendars by expiration date and return them', async () => {
      const maxExpiration = 1614697798681;

      nock(baseUrl)
        .get(`/api/content/${appName}/calendars`)
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

      const result = await calendarsController.fetchRaw({
        take: 50,
        skip: 0,
        maxExpiration,
      });

      expect(result).toEqual(calendarsListRestResponse());
    });
  });

  describe('FetchById method', () => {
    test('Should fetch the users from squidex graphql', async () => {
      const result = await calendarsControllerMockGraphql.fetchById(
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

      await expect(calendarsController.fetchById(calendarId)).rejects.toThrow(
        notFound(),
      );
    });

    test('Should return the calendar response', async () => {
      const calendarId = 'calendar-id-1';
      const squidexGraphqlResponse = getSquidexCalendarGraphqlResponse();
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await calendarsController.fetchById(calendarId);

      expect(result).toEqual(getCalendarResponse());
    });

    test('Should throw if squidex response has invalid colour', async () => {
      const id = 'calendar-id-1';
      const squidexGraphqlResponse = getSquidexCalendarGraphqlResponse();
      squidexGraphqlResponse.findCalendarsContent!.flatData.color = 'invalid';
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      await expect(calendarsController.fetchById(id)).rejects.toThrow(
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

      await expect(calendarsController.fetchById(id)).rejects.toThrow(
        badGateway('Missing required data'),
      );
    });

    test('Should return the calendar raw response', async () => {
      const calendarId = 'calendar-id-1';
      const squidexGraphqlResponse = getSquidexCalendarGraphqlResponse();
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await calendarsController.fetchById(calendarId, {
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
      nock(baseUrl)
        .get(`/api/content/${appName}/calendars`)
        .query({
          $top: 1,
          $filter: `data/resourceId/iv eq '${resourceId}'`,
        })
        .reply(500);

      await expect(
        calendarsController.fetchByResourceId(resourceId),
      ).rejects.toThrow('Bad Gateway');
    });

    test('Should throw Not Found when squidex returns an empty array', async () => {
      nock(baseUrl)
        .get(`/api/content/${appName}/calendars`)
        .query({
          $top: 1,
          $filter: `data/resourceId/iv eq '${resourceId}'`,
        })
        .reply(200, {
          total: 0,
          items: [],
        });

      await expect(
        calendarsController.fetchByResourceId(resourceId),
      ).rejects.toThrow('Not Found');
    });

    test('Should return the calendar when finds it', async () => {
      const rawCalendarResponse = getCalendarRaw();

      nock(baseUrl)
        .get(`/api/content/${appName}/calendars`)
        .query({
          $top: 1,
          $filter: `data/resourceId/iv eq '${resourceId}'`,
        })
        .reply(200, { total: 1, items: [rawCalendarResponse] });

      const result = await calendarsController.fetchByResourceId(resourceId);

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
      nock(baseUrl)
        .patch(`/api/content/${appName}/calendars/calendar-not-found`)
        .reply(404);

      await expect(
        calendarsController.update('calendar-not-found', {}),
      ).rejects.toThrow(NotFoundError);
    });

    test('Should return the calendars', async () => {
      const syncToken = 'google-sync-token';
      const calendarId = 'calendar-id';
      const restCalendar = getRestCalendar();

      nock(baseUrl)
        .patch(`/api/content/${appName}/calendars/${calendarId}`, {
          syncToken: { iv: syncToken },
        })
        .reply(200, restCalendar);

      const result = await calendarsController.update(calendarId, {
        syncToken,
      });

      expect(result).toEqual({
        id: restCalendar.data.googleCalendarId.iv,
        color: restCalendar.data.color.iv,
        name: restCalendar.data.name.iv,
      });
    });
  });

  describe('Create method', () => {
    afterEach(() => {
      expect(nock.isDone()).toBe(true);
    });

    afterEach(() => {
      nock.cleanAll();
    });

    test('Should throw when the POST request to Squidex fails', async () => {
      nock(baseUrl)
        .post(`/api/content/${appName}/calendars?publish=true`)
        .reply(500);

      await expect(
        calendarsController.create(getCalendarInput()),
      ).rejects.toThrow(GenericError);
    });

    test('Should send the POST request to Squidex and return the calendar', async () => {
      const restCalendar = getRestCalendar();
      const calendarInput = getCalendarInput();

      nock(baseUrl)
        .post(
          `/api/content/${appName}/calendars?publish=true`,
          parseToSquidex(calendarInput),
        )
        .reply(200, restCalendar);

      const result = await calendarsController.create(calendarInput);

      expect(result).toEqual({
        googleCalendarId: restCalendar.data.googleCalendarId.iv,
        color: restCalendar.data.color.iv,
        name: restCalendar.data.name.iv,
        id: restCalendar.id,
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
      nock(baseUrl)
        .get(`/api/content/${appName}/calendars/calendar-not-found`)
        .reply(404);

      await expect(
        calendarsController.getSyncToken('calendar-not-found'),
      ).rejects.toThrow(NotFoundError);
    });

    test('Should return the syncToken', async () => {
      const calendarId = 'calendar-id';
      const restCalendar = getRestCalendar();

      nock(baseUrl)
        .get(`/api/content/${appName}/calendars/${calendarId}`)
        .reply(200, restCalendar);

      const result = await calendarsController.getSyncToken(calendarId);

      expect(result).toEqual(restCalendar.data.syncToken!.iv);
    });
  });
});
