import { InputCalendar, RestCalendar, SquidexRest } from '@asap-hub/squidex';
import { getAuthToken } from '../../src/utils/auth';
import { appName, baseUrl } from '../../src/config';
import CalendarSquidexDataProvider from '../../src/data-providers/calendars.data-provider';
import { getSquidexGraphqlClientMock } from '../mocks/squidex-graphql-client.mock';
import { identity } from '../helpers/squidex';
import { getCreateCalendarDataObject } from '../fixtures/calendars.fixtures';
import { CalendarRawDataObject, FetchCalendarError } from '@asap-hub/model';

describe('Calendars data provider', () => {
  const squidexGraphqlClientMock = getSquidexGraphqlClientMock();

  const restClient = new SquidexRest<RestCalendar, InputCalendar>(
    getAuthToken,
    'calendars',
    { appName, baseUrl },
  );

  const calendarDataProvider = new CalendarSquidexDataProvider(
    restClient,
    squidexGraphqlClientMock,
  );

  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Create & update', () => {
    test('Correctly creates on Squidex', async () => {
      const calendar = getCreateCalendarDataObject();
      const result = await calendarDataProvider.create(calendar);

      expect(result.googleCalendarId).toEqual(calendar.googleCalendarId);
      expect(result.color).toEqual(calendar.color);
      expect(result.name).toEqual(calendar.name);
      expect(result.expirationDate).toEqual(calendar.expirationDate);
      expect(result.resourceId).toEqual(calendar.resourceId);
    });

    test('Correctly updates on Squidex', async () => {
      const calendar = getCreateCalendarDataObject();
      const createResult = await calendarDataProvider.create(calendar);

      const result = await calendarDataProvider.update(createResult.id, {
        name: 'Updated',
      });

      expect(result.googleCalendarId).toEqual(calendar.googleCalendarId);
      expect(result.color).toEqual(calendar.color);
      expect(result.expirationDate).toEqual(calendar.expirationDate);
      expect(result.resourceId).toEqual(calendar.resourceId);
      expect(result.name).toEqual('Updated');
    });
  });

  describe('Fetch', () => {
    test('Correctly fetches a created Calendar', async () => {
      const calendar = getCreateCalendarDataObject();
      await calendarDataProvider.create(calendar);

      const results = (await calendarDataProvider.fetch({
        take: 50,
        skip: 0,
      })) as CalendarRawDataObject[];

      expect(results.length).toBe(1);

      const result = results[0];

      expect(result?.googleCalendarId).toEqual(calendar.googleCalendarId);
      expect(result?.color).toEqual(calendar.color);
      expect(result?.expirationDate).toEqual(calendar.expirationDate);
      expect(result?.resourceId).toEqual(calendar.resourceId);
      expect(result?.name).toEqual(calendar.name);
    });
  });

  describe('Fetch by ID', async () => {
    test('Correctly fetches a created Calendar', async () => {
      const calendar = getCreateCalendarDataObject();
      const created = await calendarDataProvider.create(calendar);

      const result = (await calendarDataProvider.fetchById(
        created.id,
      )) as CalendarRawDataObject;

      expect(result.googleCalendarId).toEqual(calendar.googleCalendarId);
      expect(result.color).toEqual(calendar.color);
      expect(result.expirationDate).toEqual(calendar.expirationDate);
      expect(result.resourceId).toEqual(calendar.resourceId);
      expect(result.name).toEqual('Updated');
    });

    test('Correctly errors if ID not found', async () => {
      const result = await calendarDataProvider.fetchById(
        'this-id-doesnt-exist',
      );

      expect(result).toEqual(FetchCalendarError.CalendarNotFound);
    });
  });
});
