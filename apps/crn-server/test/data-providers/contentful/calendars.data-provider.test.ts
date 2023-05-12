import { GraphQLError } from 'graphql';
import {
  getContentfulGraphqlClientMockServer,
  Environment,
} from '@asap-hub/contentful';

import {
  getContentfulGraphqlCalendar,
  getContentfulCalendarsGraphqlResponse,
  getCalendarCreateDataObject,
  getCalendarDataObject,
} from '../../fixtures/calendars.fixtures';
import { getContentfulGraphqlClientMock } from '../../mocks/contentful-graphql-client.mock';
import { getContentfulEnvironmentMock } from '../../mocks/contentful-rest-client.mock';
import {
  CalendarContentfulDataProvider,
  calendarUnreadyResponse,
} from '../../../src/data-providers/contentful/calendars.data-provider';
import { getEntry } from '../../fixtures/contentful.fixtures';

describe('Calendars data provider', () => {
  const contentfulGraphqlClientMock = getContentfulGraphqlClientMock();
  const environmentMock = getContentfulEnvironmentMock();
  const contentfulRestClientMock: () => Promise<Environment> = () =>
    Promise.resolve(environmentMock);

  const calendarDataProvider = new CalendarContentfulDataProvider(
    contentfulGraphqlClientMock,
    contentfulRestClientMock,
  );

  const contentfulGraphqlClientMockServer =
    getContentfulGraphqlClientMockServer({
      Calendars: () => getContentfulGraphqlCalendar(),
    });

  const calendarDataProviderMock = new CalendarContentfulDataProvider(
    contentfulGraphqlClientMockServer,
    contentfulRestClientMock,
  );

  afterEach(() => {
    jest.resetAllMocks();
  });

  const getContentfulCalendarDataObject = () => ({
    ...getCalendarDataObject(),
    ...calendarUnreadyResponse,
  });

  describe('Fetch method', () => {
    test('Should fetch the list of calendars from Contentful GraphQl', async () => {
      const result = await calendarDataProviderMock.fetch({});

      expect(result.items[0]).toMatchObject(getContentfulCalendarDataObject());
    });

    test('Should return an empty result when no calendars exist', async () => {
      const contentfulGraphQLResponse = getContentfulCalendarsGraphqlResponse();
      contentfulGraphQLResponse.calendarsCollection!.total = 0;
      contentfulGraphQLResponse.calendarsCollection!.items = [];

      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphQLResponse,
      );

      const result = await calendarDataProvider.fetch({});

      expect(result).toEqual({
        items: [],
        total: 0,
      });
    });

    test('Should throw an error with a specific error message when the graphql client throws one', async () => {
      contentfulGraphqlClientMock.request.mockRejectedValueOnce(
        new GraphQLError('some error message'),
      );

      await expect(calendarDataProvider.fetch({})).rejects.toThrow(
        'some error message',
      );
    });

    test('Should return an empty result when the query is returned as null', async () => {
      const contentfulGraphQLResponse = getContentfulCalendarsGraphqlResponse();
      contentfulGraphQLResponse.calendarsCollection = null;

      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphQLResponse,
      );

      const result = await calendarDataProvider.fetch({});

      expect(result).toEqual({
        items: [],
        total: 0,
      });
    });

    test('Should use default query params when request does not have any', async () => {
      const contentfulGraphQLResponse = getContentfulCalendarsGraphqlResponse();

      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphQLResponse,
      );

      const result = await calendarDataProvider.fetch({});

      expect(result).toEqual({
        total: 1,
        items: [getContentfulCalendarDataObject()],
      });

      expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          limit: 50,
          order: ['name_ASC'],
          skip: 0,
          where: {},
        }),
      );
    });

    test('Should filter calendars by the resourceId', async () => {
      const contentfulGraphqlResponse = getContentfulCalendarsGraphqlResponse();
      const resourceId =
        contentfulGraphqlResponse.calendarsCollection?.items[0]
          ?.googleApiMetadata.resourceId;
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphqlResponse,
      );

      const result = await calendarDataProvider.fetch({ resourceId });

      expect(contentfulGraphqlClientMock.request).toBeCalledWith(
        expect.anything(),
        {
          limit: 50,
          order: ['name_ASC'],
          skip: 0,
          where: {
            googleApiMetadata_exists: true,
          },
        },
      );
      expect(result).toEqual({
        total: 1,
        items: [getContentfulCalendarDataObject()],
      });
    });

    test('Should filter calendars by maxExpiration when it is greater than results expirationDate', async () => {
      const contentfulGraphqlResponse = getContentfulCalendarsGraphqlResponse();
      const responseExpirationDate =
        contentfulGraphqlResponse.calendarsCollection?.items[0]
          ?.googleApiMetadata.expirationDate;
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphqlResponse,
      );

      const result = await calendarDataProvider.fetch({
        maxExpiration: responseExpirationDate + 1,
      });

      expect(contentfulGraphqlClientMock.request).toBeCalledWith(
        expect.anything(),
        {
          limit: 50,
          order: ['name_ASC'],
          skip: 0,
          where: {
            googleApiMetadata_exists: true,
          },
        },
      );
      expect(result).toEqual({
        total: 1,
        items: [getContentfulCalendarDataObject()],
      });
    });

    test('Should filter calendars by maxExpiration when it is less than results expirationDate', async () => {
      const contentfulGraphqlResponse = getContentfulCalendarsGraphqlResponse();
      const responseExpirationDate =
        contentfulGraphqlResponse.calendarsCollection?.items[0]
          ?.googleApiMetadata.expirationDate;
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphqlResponse,
      );

      const result = await calendarDataProvider.fetch({
        maxExpiration: responseExpirationDate - 1,
      });

      expect(contentfulGraphqlClientMock.request).toBeCalledWith(
        expect.anything(),
        {
          limit: 50,
          order: ['name_ASC'],
          skip: 0,
          where: {
            googleApiMetadata_exists: true,
          },
        },
      );
      expect(result).toEqual({
        total: 0,
        items: [],
      });
    });

    test('Should filter calendars by resourceId and maxExpiration', async () => {
      const modifiedContentfulGraphqlCalendar = getContentfulGraphqlCalendar();
      modifiedContentfulGraphqlCalendar.googleApiMetadata!.resourceId! =
        'resource-2';
      const responseExpirationDate =
        modifiedContentfulGraphqlCalendar?.googleApiMetadata?.expirationDate;

      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        calendarsCollection: {
          total: 2,
          items: [
            getContentfulGraphqlCalendar(),
            modifiedContentfulGraphqlCalendar,
          ],
        },
      });

      const result = await calendarDataProvider.fetch({
        resourceId: 'resource-2',
        maxExpiration: responseExpirationDate + 1,
      });

      expect(contentfulGraphqlClientMock.request).toBeCalledWith(
        expect.anything(),
        {
          limit: 50,
          order: ['name_ASC'],
          skip: 0,
          where: {
            googleApiMetadata_exists: true,
          },
        },
      );
      expect(result).toEqual({
        total: 1,
        items: [
          {
            ...getCalendarDataObject(),
            resourceId: 'resource-2',
            groups: [],
            workingGroups: [],
          },
        ],
      });
    });

    test('Should default missing data to an empty string', async () => {
      const calendarResponse = getContentfulCalendarsGraphqlResponse();
      calendarResponse.calendarsCollection!.items![0]!.name = null;
      calendarResponse.calendarsCollection!.items![0]!.googleCalendarId = null;

      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        calendarResponse,
      );

      const response = await calendarDataProvider.fetch();

      expect(response.items[0]).toMatchObject({
        name: '',
        googleCalendarId: '',
      });
    });

    test('Should default the calendar color to #333333', async () => {
      const calendarResponse = getContentfulCalendarsGraphqlResponse();
      calendarResponse.calendarsCollection!.items![0]!.color = null;

      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        calendarResponse,
      );

      const response = await calendarDataProvider.fetch();

      expect(response.items[0]!.color).toBe('#333333');
    });
  });

  describe('Fetch-by-id method', () => {
    test('Should fetch the calendar from Contentful GraphQl', async () => {
      const calendarId = 'calendar-id-0';
      const result = await calendarDataProviderMock.fetchById(calendarId);

      expect(result).toMatchObject(getContentfulCalendarDataObject());
    });

    test('Should return null when the calendar is not found', async () => {
      const calendarId = 'not-found';

      const contentfulGraphQLResponse = getContentfulCalendarsGraphqlResponse();
      contentfulGraphQLResponse.calendarsCollection = null;

      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphQLResponse,
      );

      expect(await calendarDataProvider.fetchById(calendarId)).toBeNull();
    });

    test('Should throw an error with a specific error message when the graphql client throws one', async () => {
      const id = 'some-id';
      contentfulGraphqlClientMock.request.mockRejectedValueOnce(
        new GraphQLError('some error message'),
      );

      await expect(calendarDataProvider.fetchById(id)).rejects.toThrow(
        'some error message',
      );
    });

    test('Should return the result when the calendar exists', async () => {
      const id = 'some-id';
      const contentfulGraphQLResponse = {
        calendars: getContentfulGraphqlCalendar(),
      };

      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphQLResponse,
      );

      const result = await calendarDataProvider.fetchById(id);

      expect(result).toEqual(getContentfulCalendarDataObject());
      expect(contentfulGraphqlClientMock.request).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({
          id,
        }),
      );
    });

    test('Should default missing data to an empty string', async () => {
      const contentfulGraphQLResponse = {
        calendars: getContentfulGraphqlCalendar(),
      };

      contentfulGraphQLResponse.calendars.name = null;
      contentfulGraphQLResponse.calendars.googleCalendarId = null;

      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphQLResponse,
      );

      const result = await calendarDataProvider.fetchById('calendar-id');

      expect(result).toMatchObject({
        name: '',
        googleCalendarId: '',
      });
    });

    test('Should default an invalid colour to #333333', async () => {
      const contentfulGraphQLResponse = {
        calendars: getContentfulGraphqlCalendar(),
      };

      contentfulGraphQLResponse.calendars.color = 'invalid';

      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphQLResponse,
      );

      const result = await calendarDataProvider.fetchById('calendar-id');

      expect(result!.color).toBe('#333333');
    });
  });

  describe('Update method', () => {
    test('Should update the calendar - without google api metadata', async () => {
      const calendarId = 'calendar-id-1';

      const calendarMock = getEntry({});
      environmentMock.getEntry.mockResolvedValueOnce(calendarMock);
      const calendarMockUpdated = getEntry({});
      calendarMock.update = jest
        .fn()
        .mockResolvedValueOnce(calendarMockUpdated);

      await calendarDataProviderMock.update(calendarId, { color: '#060D5E' });

      expect(environmentMock.getEntry).toHaveBeenCalledWith(calendarId);

      expect(calendarMock.fields).toEqual({ color: { 'en-US': '#060D5E' } });
      expect(calendarMock.update).toHaveBeenCalled();
      expect(calendarMockUpdated.publish).toHaveBeenCalled();
    });

    test('Should update the calendar - with google api metadata', async () => {
      const calendarId = 'calendar-id-1';

      const calendarMock = getEntry({
        googleApiMetadata: {
          'en-US': {
            syncToken: 'syncToken-1',
          },
        },
      });
      environmentMock.getEntry.mockResolvedValueOnce(calendarMock);
      const calendarMockUpdated = getEntry({});
      calendarMock.update = jest
        .fn()
        .mockResolvedValueOnce(calendarMockUpdated);

      await calendarDataProviderMock.update(calendarId, {
        resourceId: 'resourceId-1',
      });

      expect(environmentMock.getEntry).toHaveBeenCalledWith(calendarId);

      expect(calendarMock.fields).toEqual({
        googleApiMetadata: {
          'en-US': {
            associatedGoogleCalendarId: 'calendar-id-1',
            resourceId: 'resourceId-1',
            syncToken: 'syncToken-1',
          },
        },
      });
      expect(calendarMock.update).toHaveBeenCalled();
      expect(calendarMockUpdated.publish).toHaveBeenCalled();
    });
  });

  describe('Create method', () => {
    test('Should create and publish a calendar', async () => {
      const calendarMock = getEntry({});
      environmentMock.createEntry.mockResolvedValue(calendarMock);
      calendarMock.publish = jest.fn().mockResolvedValueOnce(calendarMock);

      const calendarDataObject = getCalendarCreateDataObject();
      await calendarDataProviderMock.create(calendarDataObject);

      expect(environmentMock.createEntry).toHaveBeenCalledWith('calendars', {
        fields: {
          color: { 'en-US': '#2952A3' },
          expirationDate: { 'en-US': 1617196357000 },
          googleCalendarId: { 'en-US': '3@group.calendar.google.com' },
          name: { 'en-US': 'Tech 4a - iPSCs - 3D & Co-cultures' },
          resourceId: { 'en-US': 'resource-id' },
          syncToken: { 'en-US': 'sync-token' },
        },
      });

      expect(calendarMock.publish).toHaveBeenCalled();
    });
  });
});
