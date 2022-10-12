import nock from 'nock';
import { InputCalendar, RestCalendar, SquidexRest } from '@asap-hub/squidex';
import { getAuthToken } from '../../src/utils/auth';
import { appName, baseUrl } from '../../src/config';
import { getSquidexGraphqlClientMock } from '../mocks/squidex-graphql-client.mock';
import { identity } from '../helpers/squidex';
import { getSquidexGraphqlClientMockServer } from '../mocks/squidex-graphql-client-with-server.mock';
import {
  getCalendarCreateDataObject,
  getCalendarDataObject,
  getRestCalendar,
  getSquidexCalendarGraphqlResponse,
  getSquidexCalendarsGraphqlResponse,
  getSquidexGraphqlCalendar,
} from '../fixtures/calendars.fixtures';
import { GenericError } from '@asap-hub/errors';
import { CalendarSquidexDataProvider } from '../../src/data-providers/calendars.data-provider';

describe('Calendars data provider', () => {
  const squidexGraphqlClientMock = getSquidexGraphqlClientMock();
  const squidexGraphqlClientMockServer = getSquidexGraphqlClientMockServer();

  const calendarRestClient = new SquidexRest<RestCalendar, InputCalendar>(
    getAuthToken,
    'calendars',
    { appName, baseUrl },
  );

  const calendarDataProvider = new CalendarSquidexDataProvider(
    calendarRestClient,
    squidexGraphqlClientMock,
  );
  const calendarDataProviderMockGraphql = new CalendarSquidexDataProvider(
    calendarRestClient,
    squidexGraphqlClientMockServer,
  );

  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Fetch by ID', () => {
    test('Should fetch the calendar from squidex graphql', async () => {
      const result = await calendarDataProviderMockGraphql.fetchById(
        'calendar-id',
      );

      expect(result).toMatchObject(getCalendarDataObject());
    });

    test('Should return null when the user is not found', async () => {
      const mockResponse = getSquidexCalendarGraphqlResponse();
      mockResponse.findCalendarsContent = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      expect(await calendarDataProvider.fetchById('not-found')).toBeNull();
    });

    test('Should default missing data to an empty string', async () => {
      const squidexGraphqlResponse = getSquidexCalendarGraphqlResponse();
      squidexGraphqlResponse.findCalendarsContent!.flatData!.name = null;
      squidexGraphqlResponse.findCalendarsContent!.flatData!.googleCalendarId =
        null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await calendarDataProvider.fetchById('calendar-id');

      expect(result).toMatchObject({
        name: '',
        googleCalendarId: '',
      });
    });

    test('Should default an invalid colour to #333333', async () => {
      const squidexGraphqlResponse = getSquidexCalendarGraphqlResponse();
      squidexGraphqlResponse.findCalendarsContent!.flatData.color = 'invalid';
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await calendarDataProvider.fetchById('calendar-id');

      expect(result!.color).toBe('#333333');
    });
  });

  describe('Fetch', () => {
    test('Should fetch the calendars from squidex graphql', async () => {
      const result = await calendarDataProviderMockGraphql.fetch();

      expect(result).toMatchObject({
        total: 1,
        items: [getCalendarDataObject()],
      });
    });

    test('Should return an empty result when the client returns an empty array of data', async () => {
      const squidexGraphqlResponse = getSquidexCalendarsGraphqlResponse();
      squidexGraphqlResponse.queryCalendarsContentsWithTotal!.total = 0;
      squidexGraphqlResponse.queryCalendarsContentsWithTotal!.items = [];
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await calendarDataProvider.fetch();

      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should return an empty result when the client returns a response with query property set to null', async () => {
      const squidexGraphqlResponse = getSquidexCalendarsGraphqlResponse();
      squidexGraphqlResponse.queryCalendarsContentsWithTotal = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await calendarDataProvider.fetch();

      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should return an empty result when the client returns a response with items property set to null', async () => {
      const squidexGraphqlResponse = getSquidexCalendarsGraphqlResponse();
      squidexGraphqlResponse.queryCalendarsContentsWithTotal!.items = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await calendarDataProvider.fetch();

      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should call the client with the default pagination parameters (pagination disabled)', async () => {
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        getSquidexCalendarsGraphqlResponse(),
      );

      await calendarDataProvider.fetch();

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

    test('Should filter calendars by the resourceId', async () => {
      const resourceId = 'some-resource-id';
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        getSquidexCalendarsGraphqlResponse(),
      );

      const result = await calendarDataProvider.fetch({ resourceId });

      expect(squidexGraphqlClientMock.request).toBeCalledWith(
        expect.anything(),
        {
          top: 50,
          skip: 0,
          filter: `data/resourceId/iv eq '${resourceId}'`,
          order: 'data/name/iv asc',
        },
      );
      expect(result).toEqual({ total: 1, items: [getCalendarDataObject()] });
    });

    test('Should default missing data to an empty string', async () => {
      const calendarResponse = getSquidexCalendarsGraphqlResponse();
      calendarResponse.queryCalendarsContentsWithTotal!.items![0]!.flatData.name =
        null;
      calendarResponse.queryCalendarsContentsWithTotal!.items![0]!.flatData.googleCalendarId =
        null;

      squidexGraphqlClientMock.request.mockResolvedValueOnce(calendarResponse);

      const response = await calendarDataProvider.fetch();

      expect(response.items[0]).toMatchObject({
        name: '',
        googleCalendarId: '',
      });
    });

    test('Should default the calendar color to #333333', async () => {
      const calendarResponse = getSquidexCalendarsGraphqlResponse();
      calendarResponse.queryCalendarsContentsWithTotal!.items![0]!.flatData.color =
        null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(calendarResponse);

      const response = await calendarDataProvider.fetch();

      expect(response.items[0]!.color).toBe('#333333');
    });

    describe('Active filter', () => {
      test('Should skip the calendars which belong to an inactive group when active is set to true', async () => {
        const squidexGraphqlResponse = getSquidexCalendarsGraphqlResponse();
        const calendar1Active = getSquidexGraphqlCalendar();
        calendar1Active.id = 'calendar-id-1';
        calendar1Active.referencingGroupsContents![0]!.flatData.active = true;

        const calendar2Inactive = getSquidexGraphqlCalendar();
        calendar2Inactive.id = 'calendar-id-2';
        calendar2Inactive.referencingGroupsContents![0]!.flatData.active =
          false;

        const calendar3Active = getSquidexGraphqlCalendar();
        calendar3Active.id = 'calendar-id-3';
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

        const result = await calendarDataProvider.fetch({ active: true });

        expect(result).toEqual({
          total: 2,
          items: [
            expect.objectContaining({
              id: calendar1Active.id,
            }),
            expect.objectContaining({
              id: calendar3Active.id,
            }),
          ],
        });
      });

      test('Should not skip the calendars which belong to an inactive group when active is set to false', async () => {
        const squidexGraphqlResponse = getSquidexCalendarsGraphqlResponse();
        const calendar1Active = getSquidexGraphqlCalendar();
        calendar1Active.id = 'calendar-id-1';
        calendar1Active.referencingGroupsContents![0]!.flatData.active = true;

        const calendar2Inactive = getSquidexGraphqlCalendar();
        calendar2Inactive.id = 'calendar-id-2';
        calendar2Inactive.referencingGroupsContents![0]!.flatData.active =
          false;

        const calendar3Active = getSquidexGraphqlCalendar();
        calendar3Active.id = 'calendar-id-3';
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

        const result = await calendarDataProvider.fetch({ active: false });

        expect(result).toEqual({
          total: 3,
          items: [
            expect.objectContaining({
              id: calendar1Active.id,
            }),
            expect.objectContaining({
              id: calendar2Inactive.id,
            }),
            expect.objectContaining({
              id: calendar3Active.id,
            }),
          ],
        });
      });

      test('Should show the calendars which do not belong to any group', async () => {
        const squidexGraphqlResponse = getSquidexCalendarsGraphqlResponse();

        const calendar1 = getSquidexGraphqlCalendar();
        calendar1.id = 'calendar-id-1';
        calendar1.referencingGroupsContents = null;
        const calendar2 = getSquidexGraphqlCalendar();
        calendar2.id = 'calendar-id-2';
        calendar2.referencingGroupsContents = [];
        squidexGraphqlResponse.queryCalendarsContentsWithTotal!.items = [
          calendar1,
          calendar2,
        ];
        squidexGraphqlResponse.queryCalendarsContentsWithTotal!.total = 2;

        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          squidexGraphqlResponse,
        );

        const result = await calendarDataProvider.fetch({ active: true });

        expect(result).toEqual({
          total: 2,
          items: [
            expect.objectContaining({
              id: calendar1.id,
            }),
            expect.objectContaining({
              id: calendar2.id,
            }),
          ],
        });
      });

      test('Should not skip the calendars which belong to multiple groups of which at least one is active', async () => {
        const squidexGraphqlResponse = getSquidexCalendarsGraphqlResponse();
        const calendar = getSquidexGraphqlCalendar();
        calendar.id = 'calendar-id-1';
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

        const result = await calendarDataProvider.fetch({ active: true });

        expect(result).toEqual({
          total: 1,
          items: [
            expect.objectContaining({
              id: calendar.id,
            }),
          ],
        });
      });
    });

    test('Should query calendars by expiration date', async () => {
      const maxExpiration = 1614697798681;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        getSquidexCalendarsGraphqlResponse(),
      );

      await calendarDataProvider.fetch({
        maxExpiration,
      });

      expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        {
          filter: `data/expirationDate/iv lt ${maxExpiration}`,
          top: 50,
          skip: 0,
          order: 'data/name/iv asc',
        },
      );
    });
  });

  describe('Create and Update', () => {
    afterEach(() => {
      expect(nock.isDone()).toBe(true);
    });

    afterEach(() => {
      nock.cleanAll();
    });

    describe('Create', () => {
      test('Should throw when the POST request to Squidex fails', async () => {
        const calendarInput = getCalendarCreateDataObject();

        nock(baseUrl)
          .post(`/api/content/${appName}/calendars?publish=true`)
          .reply(500);

        await expect(
          calendarDataProvider.create(calendarInput),
        ).rejects.toThrow(GenericError);
      });

      test('Should send the POST request to Squidex and return the calendar ID', async () => {
        const restCalendar = getRestCalendar();
        const calendarInput = getCalendarCreateDataObject();

        nock(baseUrl)
          .post(
            `/api/content/${appName}/calendars?publish=true`,
            restCalendar.data,
          )
          .reply(200, restCalendar);

        const result = await calendarDataProvider.create(calendarInput);

        expect(result).toEqual(restCalendar.id);
      });
    });

    describe('Update', () => {
      test('Should throw when the POST request to Squidex fails', async () => {
        nock(baseUrl)
          .patch(`/api/content/${appName}/calendars/not-found`)
          .reply(500);

        await expect(
          calendarDataProvider.update(
            'not-found',
            getCalendarCreateDataObject(),
          ),
        ).rejects.toThrow(GenericError);
      });

      test('Should send the PATCH request to Squidex', async () => {
        const restCalendar = getRestCalendar();
        const calendarInput = getCalendarCreateDataObject();

        nock(baseUrl)
          .patch(
            `/api/content/${appName}/calendars/${restCalendar.id}`,
            restCalendar.data,
          )
          .reply(200, restCalendar);

        await calendarDataProvider.update(restCalendar.id, calendarInput);
      });

      test('Should support partial updates', async () => {
        const restCalendar = getRestCalendar();
        const {
          color: _color,
          name: _name,
          ...restCalendarData
        } = restCalendar.data;
        const {
          color: __color,
          name: __name,
          ...calendarInput
        } = getCalendarCreateDataObject();

        nock(baseUrl)
          .patch(
            `/api/content/${appName}/calendars/${restCalendar.id}`,
            restCalendarData as any,
          )
          .reply(200, restCalendar);

        await calendarDataProvider.update(restCalendar.id, calendarInput);
      });
    });
  });
});
