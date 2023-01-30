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
import { getSquidexGraphqlWorkingGroup } from '../fixtures/working-groups.fixtures';

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
      expect(result).toEqual({
        total: 1,
        items: [getCalendarDataObject()],
      });
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
      test('Should show calendars that belong to an inactive group and to a working group that is not complete', async () => {
        const squidexGraphqlResponse = getSquidexCalendarsGraphqlResponse();
        const calendar = getSquidexGraphqlCalendar();

        calendar.id = 'calendar-id-1';
        calendar.referencingGroupsContents![0]!.flatData.active = false;
        calendar.referencingWorkingGroupsContents![0]!.flatData.complete =
          false;

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
      test('Should show calendars that belong to an active group and to a working group that is complete', async () => {
        const squidexGraphqlResponse = getSquidexCalendarsGraphqlResponse();
        const calendar = getSquidexGraphqlCalendar();

        calendar.id = 'calendar-id-1';
        calendar.referencingGroupsContents![0]!.flatData.active = true;
        calendar.referencingWorkingGroupsContents![0]!.flatData.complete = true;

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
      test('Should skip a calendar that belong to an inactive group and to a working group that is complete', async () => {
        const squidexGraphqlResponse = getSquidexCalendarsGraphqlResponse();
        const calendar = getSquidexGraphqlCalendar();

        calendar.id = 'calendar-id-1';
        calendar.referencingGroupsContents![0]!.flatData.active = false;
        calendar.referencingWorkingGroupsContents![0]!.flatData.complete = true;

        squidexGraphqlResponse.queryCalendarsContentsWithTotal!.items = [
          calendar,
        ];
        squidexGraphqlResponse.queryCalendarsContentsWithTotal!.total = 4;

        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          squidexGraphqlResponse,
        );

        const result = await calendarDataProvider.fetch({ active: true });

        expect(result).toEqual({
          total: 0,
          items: [],
        });
      });
      test('Should skip the calendars which belong to an inactive group and complete working group but show the rest when active is set to true', async () => {
        const squidexGraphqlResponse = getSquidexCalendarsGraphqlResponse();
        const calendar1ActiveComplete = getSquidexGraphqlCalendar();
        calendar1ActiveComplete.id = 'calendar-id-1';
        calendar1ActiveComplete.referencingGroupsContents![0]!.flatData.active =
          true;
        calendar1ActiveComplete.referencingWorkingGroupsContents![0]!.flatData.complete =
          true;

        const calendar2InactiveIncomplete = getSquidexGraphqlCalendar();
        calendar2InactiveIncomplete.id = 'calendar-id-2';
        calendar2InactiveIncomplete.referencingGroupsContents![0]!.flatData.active =
          false;
        calendar2InactiveIncomplete.referencingWorkingGroupsContents![0]!.flatData.complete =
          false;

        const calendar3InactiveComplete = getSquidexGraphqlCalendar();
        calendar3InactiveComplete.id = 'calendar-id-3';
        calendar3InactiveComplete.referencingGroupsContents![0]!.flatData.active =
          false;
        calendar3InactiveComplete.referencingWorkingGroupsContents!![0]!.flatData.complete =
          true;

        const calendar4 = getSquidexGraphqlCalendar();
        calendar4.id = 'calendar-id-4';

        squidexGraphqlResponse.queryCalendarsContentsWithTotal!.items = [
          calendar1ActiveComplete,
          calendar2InactiveIncomplete,
          calendar3InactiveComplete,
          calendar4,
        ];
        squidexGraphqlResponse.queryCalendarsContentsWithTotal!.total = 4;

        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          squidexGraphqlResponse,
        );

        const result = await calendarDataProvider.fetch({ active: true });

        expect(result).toEqual({
          total: 3,
          items: [
            expect.objectContaining({
              id: calendar1ActiveComplete.id,
            }),
            expect.objectContaining({
              id: calendar2InactiveIncomplete.id,
            }),
            expect.objectContaining({
              id: calendar4.id,
            }),
          ],
        });
      });
      test('Should show calendars that belong to multiple working groups of which one is not complete', async () => {
        const squidexGraphqlResponse = getSquidexCalendarsGraphqlResponse();
        const calendar = {
          ...getSquidexGraphqlCalendar(),
          id: 'calendar-id-1',
          referencingWorkingGroupsContents: [
            {
              ...getSquidexGraphqlWorkingGroup(),
              id: 'working-group-id-1',
              flatData: { complete: true },
            },
            {
              ...getSquidexGraphqlWorkingGroup(),
              id: 'working-group-id-2',
              flatData: { complete: true },
            },
            {
              ...getSquidexGraphqlWorkingGroup(),
              id: 'working-group-id-3',
              flatData: { complete: false },
            },
          ],
        };

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
      test('Should not skip the calendars which belong to an inactive group and complete working group when active is set to false', async () => {
        const squidexGraphqlResponse = getSquidexCalendarsGraphqlResponse();
        const calendar1ActiveComplete = getSquidexGraphqlCalendar();
        calendar1ActiveComplete.id = 'calendar-id-1';
        calendar1ActiveComplete.referencingGroupsContents![0]!.flatData.active =
          true;
        calendar1ActiveComplete.referencingWorkingGroupsContents![0]!.flatData.complete =
          true;

        const calendar2InactiveIncomplete = getSquidexGraphqlCalendar();
        calendar2InactiveIncomplete.id = 'calendar-id-2';
        calendar2InactiveIncomplete.referencingGroupsContents![0]!.flatData.active =
          false;
        calendar2InactiveIncomplete.referencingWorkingGroupsContents![0]!.flatData.complete =
          false;

        const calendar3InactiveComplete = getSquidexGraphqlCalendar();
        calendar3InactiveComplete.id = 'calendar-id-3';
        calendar3InactiveComplete.referencingGroupsContents![0]!.flatData.active =
          false;
        calendar3InactiveComplete.referencingWorkingGroupsContents!![0]!.flatData.complete =
          true;

        const calendar4 = getSquidexGraphqlCalendar();
        calendar4.id = 'calendar-id-4';

        squidexGraphqlResponse.queryCalendarsContentsWithTotal!.items = [
          calendar1ActiveComplete,
          calendar2InactiveIncomplete,
          calendar3InactiveComplete,
          calendar4,
        ];
        squidexGraphqlResponse.queryCalendarsContentsWithTotal!.total = 4;

        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          squidexGraphqlResponse,
        );

        const result = await calendarDataProvider.fetch({ active: false });

        expect(result).toEqual({
          total: 4,
          items: [
            expect.objectContaining({
              id: calendar1ActiveComplete.id,
            }),
            expect.objectContaining({
              id: calendar2InactiveIncomplete.id,
            }),
            expect.objectContaining({
              id: calendar3InactiveComplete.id,
            }),
            expect.objectContaining({
              id: calendar4.id,
            }),
          ],
        });
      });
      test('Should show the calendars which do not belong to any group or working group', async () => {
        const squidexGraphqlResponse = getSquidexCalendarsGraphqlResponse();

        const calendar1 = getSquidexGraphqlCalendar();
        calendar1.id = 'calendar-id-1';
        calendar1.referencingGroupsContents = null;
        calendar1.referencingWorkingGroupsContents = null;
        const calendar2 = getSquidexGraphqlCalendar();
        calendar2.id = 'calendar-id-2';
        calendar2.referencingGroupsContents = [];
        calendar2.referencingWorkingGroupsContents = [];
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
            id: 'group-id-1',
            flatData: { active: false },
          },
          {
            id: 'group-id-2',
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
