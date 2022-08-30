import { FetchRemindersOptions } from '@asap-hub/model';
import { DateTime } from 'luxon';
import {
  getEventFilter,
  ReminderSquidexDataProvider,
} from '../../src/data-providers/reminders.data-provider';
import {
  getResearchOutputPublishedReminder,
  getSquidexRemindersGraphqlResponse,
  getSquidexReminderReseachOutputsContents,
  getEventHappeningTodayReminder,
  getSquidexReminderEventsContents,
  getEventHappeningNowReminder,
} from '../fixtures/reminders.fixtures';
import { getSquidexGraphqlClientMockServer } from '../mocks/squidex-graphql-client-with-server.mock';
import { getSquidexGraphqlClientMock } from '../mocks/squidex-graphql-client.mock';

describe('Reminder Data Provider', () => {
  const squidexGraphqlClientMock = getSquidexGraphqlClientMock();
  const reminderDataProvider = new ReminderSquidexDataProvider(
    squidexGraphqlClientMock,
  );

  const squidexGraphqlClientMockServer = getSquidexGraphqlClientMockServer();
  const reminderDataProviderMockGraphql = new ReminderSquidexDataProvider(
    squidexGraphqlClientMockServer,
  );

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Fetch method', () => {
    const userId = 'user-id';
    const timezone = 'Europe/London';
    const fetchRemindersOptions: FetchRemindersOptions = { userId, timezone };

    describe('Research Output Published Reminder', () => {
      test('Should fetch the reminder from squidex graphql', async () => {
        const result = await reminderDataProviderMockGraphql.fetch(
          fetchRemindersOptions,
        );

        expect(result).toEqual({
          total: 1,
          items: [getResearchOutputPublishedReminder()],
        });
      });

      test('Should return an empty result when no research outputs are found', async () => {
        const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
        squidexGraphqlResponse.queryResearchOutputsContents = [];
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          squidexGraphqlResponse,
        );

        const result = await reminderDataProvider.fetch(fetchRemindersOptions);

        expect(result).toEqual({ items: [], total: 0 });
      });

      test('Should return an empty result when no teams are found', async () => {
        const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
        squidexGraphqlResponse.findUsersContent!.flatData.teams = [];
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          squidexGraphqlResponse,
        );

        const result = await reminderDataProvider.fetch(fetchRemindersOptions);

        expect(result).toEqual({ items: [], total: 0 });
      });

      test('Should return an empty result when findUsersContent property is null', async () => {
        const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
        squidexGraphqlResponse.findUsersContent = null;
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          squidexGraphqlResponse,
        );

        const result = await reminderDataProvider.fetch(fetchRemindersOptions);

        expect(result).toEqual({ items: [], total: 0 });
      });

      test('Should return an empty result when user teams property is null', async () => {
        const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
        squidexGraphqlResponse.findUsersContent!.flatData.teams = null;
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          squidexGraphqlResponse,
        );

        const result = await reminderDataProvider.fetch(fetchRemindersOptions);

        expect(result).toEqual({ items: [], total: 0 });
      });

      test('Should return an empty result when user team id property is null', async () => {
        const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
        squidexGraphqlResponse.findUsersContent!.flatData.teams![0]!.id = null;
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          squidexGraphqlResponse,
        );

        const result = await reminderDataProvider.fetch(fetchRemindersOptions);

        expect(result).toEqual({ items: [], total: 0 });
      });

      test('Should return an empty result when user team id property is an empty array', async () => {
        const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
        squidexGraphqlResponse.findUsersContent!.flatData.teams![0]!.id = [];
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          squidexGraphqlResponse,
        );

        const result = await reminderDataProvider.fetch(fetchRemindersOptions);

        expect(result).toEqual({ items: [], total: 0 });
      });

      test('Should return an empty result when queryResearchOutputsContents property is null', async () => {
        const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
        squidexGraphqlResponse.queryResearchOutputsContents = null;
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          squidexGraphqlResponse,
        );

        const result = await reminderDataProvider.fetch(fetchRemindersOptions);

        expect(result).toEqual({ items: [], total: 0 });
      });

      test('Should return an empty result when research-output referencingTeamsContents property is null', async () => {
        const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
        squidexGraphqlResponse.queryResearchOutputsContents![0]!.referencingTeamsContents =
          null;
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          squidexGraphqlResponse,
        );

        const result = await reminderDataProvider.fetch(fetchRemindersOptions);

        expect(result).toEqual({ items: [], total: 0 });
      });

      test('Should return an empty result when research-output documentType property is null', async () => {
        const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
        squidexGraphqlResponse.queryResearchOutputsContents![0]!.flatData.documentType =
          null;
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          squidexGraphqlResponse,
        );

        const result = await reminderDataProvider.fetch(fetchRemindersOptions);

        expect(result).toEqual({ items: [], total: 0 });
      });

      test('Should return an empty result when research-output title property is null', async () => {
        const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
        squidexGraphqlResponse.queryResearchOutputsContents![0]!.flatData.title =
          null;
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          squidexGraphqlResponse,
        );

        const result = await reminderDataProvider.fetch(fetchRemindersOptions);

        expect(result).toEqual({ items: [], total: 0 });
      });

      test('Should return an empty result when research-output documentType property is not a valid document-type', async () => {
        const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
        squidexGraphqlResponse.queryResearchOutputsContents![0]!.flatData.documentType =
          'invalid-document-type';
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          squidexGraphqlResponse,
        );

        const result = await reminderDataProvider.fetch(fetchRemindersOptions);

        expect(result).toEqual({ items: [], total: 0 });
      });

      test('Should sort the reminders by the publish date', async () => {
        const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();

        const researchOutput1 = getSquidexReminderReseachOutputsContents();
        researchOutput1.id = 'research-output-1';
        researchOutput1.flatData.addedDate = '2022-01-01T10:00:00Z';
        const researchOutput2 = getSquidexReminderReseachOutputsContents();
        researchOutput2.id = 'research-output-2';
        researchOutput2.flatData.addedDate = '2022-01-01T14:00:00Z';
        const researchOutput3 = getSquidexReminderReseachOutputsContents();
        researchOutput3.id = 'research-output-3';
        researchOutput3.flatData.addedDate = '2022-01-01T12:00:00Z';

        squidexGraphqlResponse.queryResearchOutputsContents = [
          researchOutput1,
          researchOutput2,
          researchOutput3,
        ];
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          squidexGraphqlResponse,
        );

        const result = await reminderDataProvider.fetch(fetchRemindersOptions);

        const reminderIds = result.items.map((reminder) => reminder.id);
        expect(reminderIds).toEqual([
          `research-output-published-${researchOutput2.id}`,
          `research-output-published-${researchOutput3.id}`,
          `research-output-published-${researchOutput1.id}`,
        ]);
      });
    });

    describe('Event Happening Today Reminder', () => {
      beforeAll(() => {
        jest.useFakeTimers('modern');
      });

      afterAll(() => {
        jest.useRealTimers();
      });

      beforeEach(async () => {
        // set the current date to one hour before the fixture event
        const dayOfTheEvent = DateTime.fromISO(
          getSquidexRemindersGraphqlResponse().queryEventsContents![0]!.flatData
            .startDate,
        )
          .minus({ hour: 1 })
          .toJSDate();
        jest.setSystemTime(dayOfTheEvent);
      });

      test('Should fetch the reminder', async () => {
        const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
        squidexGraphqlResponse.queryResearchOutputsContents = [];
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          squidexGraphqlResponse,
        );

        const result = await reminderDataProvider.fetch(fetchRemindersOptions);

        expect(result).toEqual({
          total: 1,
          items: [getEventHappeningTodayReminder()],
        });
      });

      test('Should not fetch the reminder if it has already started', async () => {
        jest.setSystemTime(new Date('2022-01-01T09:00:00Z'));

        const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
        squidexGraphqlResponse.queryResearchOutputsContents = [];
        // started an hour before the current time
        squidexGraphqlResponse.queryEventsContents![0]!.flatData.startDate =
          '2022-01-01T08:00:00Z';
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          squidexGraphqlResponse,
        );

        const result = await reminderDataProvider.fetch(fetchRemindersOptions);

        expect(result).toEqual({
          total: 0,
          items: [],
        });
      });

      test('Should return an empty result when queryEventsContents property is null', async () => {
        const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
        squidexGraphqlResponse.queryResearchOutputsContents = [];
        squidexGraphqlResponse.queryEventsContents = null;
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          squidexGraphqlResponse,
        );

        const result = await reminderDataProvider.fetch(fetchRemindersOptions);

        expect(result).toEqual({ items: [], total: 0 });
      });

      test('Should fetch the event reminder from squidex graphql when no teams are found', async () => {
        const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
        squidexGraphqlResponse.findUsersContent!.flatData.teams = [];
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          squidexGraphqlResponse,
        );

        const result = await reminderDataProvider.fetch(fetchRemindersOptions);

        expect(result).toEqual({
          total: 1,
          items: [getEventHappeningTodayReminder()],
        });
      });

      test('Should fetch the event reminder from squidex graphql when findUsersContent property is null', async () => {
        const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
        squidexGraphqlResponse.findUsersContent = null;
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          squidexGraphqlResponse,
        );

        const result = await reminderDataProvider.fetch(fetchRemindersOptions);

        expect(result).toEqual({
          total: 1,
          items: [getEventHappeningTodayReminder()],
        });
      });

      test('Should fetch the event reminder from squidex graphql when user teams property is null', async () => {
        const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
        squidexGraphqlResponse.findUsersContent!.flatData.teams = null;
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          squidexGraphqlResponse,
        );

        const result = await reminderDataProvider.fetch(fetchRemindersOptions);

        expect(result).toEqual({
          total: 1,
          items: [getEventHappeningTodayReminder()],
        });
      });

      test('Should fetch the event reminder from squidex graphql when user team id property is null', async () => {
        const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
        squidexGraphqlResponse.findUsersContent!.flatData.teams![0]!.id = null;
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          squidexGraphqlResponse,
        );

        const result = await reminderDataProvider.fetch(fetchRemindersOptions);

        expect(result).toEqual({
          total: 1,
          items: [getEventHappeningTodayReminder()],
        });
      });

      test('Should fetch the event reminder from squidex graphql when user team id property is an empty array', async () => {
        const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
        squidexGraphqlResponse.findUsersContent!.flatData.teams![0]!.id = [];
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          squidexGraphqlResponse,
        );

        const result = await reminderDataProvider.fetch(fetchRemindersOptions);

        expect(result).toEqual({
          total: 1,
          items: [getEventHappeningTodayReminder()],
        });
      });

      test('Should fetch the event reminder from squidex graphql when queryResearchOutputsContents property is null', async () => {
        const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
        squidexGraphqlResponse.queryResearchOutputsContents = null;
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          squidexGraphqlResponse,
        );

        const result = await reminderDataProvider.fetch(fetchRemindersOptions);

        expect(result).toEqual({
          total: 1,
          items: [getEventHappeningTodayReminder()],
        });
      });

      test('Should fetch the event reminder from squidex graphql when research-output referencingTeamsContents property is null', async () => {
        const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
        squidexGraphqlResponse.queryResearchOutputsContents![0]!.referencingTeamsContents =
          null;
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          squidexGraphqlResponse,
        );

        const result = await reminderDataProvider.fetch(fetchRemindersOptions);

        expect(result).toEqual({
          total: 1,
          items: [getEventHappeningTodayReminder()],
        });
      });

      test('Should fetch the event reminder from squidex graphql when research-output documentType property is null', async () => {
        const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
        squidexGraphqlResponse.queryResearchOutputsContents![0]!.flatData.documentType =
          null;
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          squidexGraphqlResponse,
        );

        const result = await reminderDataProvider.fetch(fetchRemindersOptions);

        expect(result).toEqual({
          total: 1,
          items: [getEventHappeningTodayReminder()],
        });
      });

      test('Should fetch the event reminder from squidex graphql when research-output title property is null', async () => {
        const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
        squidexGraphqlResponse.queryResearchOutputsContents![0]!.flatData.title =
          null;
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          squidexGraphqlResponse,
        );

        const result = await reminderDataProvider.fetch(fetchRemindersOptions);

        expect(result).toEqual({
          total: 1,
          items: [getEventHappeningTodayReminder()],
        });
      });

      test('Should fetch the event reminder from squidex graphql when research-output documentType property is not a valid document-type', async () => {
        const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
        squidexGraphqlResponse.queryResearchOutputsContents![0]!.flatData.documentType =
          'invalid-document-type';
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          squidexGraphqlResponse,
        );

        const result = await reminderDataProvider.fetch(fetchRemindersOptions);

        expect(result).toEqual({
          total: 1,
          items: [getEventHappeningTodayReminder()],
        });
      });

      test('Should sort the reminders by the startDate in a descending order', async () => {
        jest.setSystemTime(new Date('2022-01-01T09:00:00Z'));

        const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
        squidexGraphqlResponse.queryResearchOutputsContents = [];
        const event1 = getSquidexReminderEventsContents();
        event1.id = 'event-1';
        event1.flatData.startDate = '2022-01-01T10:00:00Z';
        const event2 = getSquidexReminderEventsContents();
        event2.id = 'event-2';
        event2.flatData.startDate = '2022-01-01T14:00:00Z';
        const event3 = getSquidexReminderEventsContents();
        event3.id = 'event-3';
        event3.flatData.startDate = '2022-01-01T12:00:00Z';
        squidexGraphqlResponse.queryEventsContents = [event1, event2, event3];
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          squidexGraphqlResponse,
        );

        const result = await reminderDataProvider.fetch(fetchRemindersOptions);

        const reminderIds = result.items.map((reminder) => reminder.id);
        expect(reminderIds).toEqual([
          `event-happening-today-${event2.id}`,
          `event-happening-today-${event3.id}`,
          `event-happening-today-${event1.id}`,
        ]);
      });

      describe('Event Filter', () => {
        beforeAll(async () => {
          jest.useFakeTimers('modern');
        });

        afterAll(() => {
          jest.useRealTimers();
        });

        test('Should return the filter for London time', () => {
          // set system date to midday UTC
          jest.setSystemTime(new Date('2022-08-10T12:00:00.0Z'));

          expect(getEventFilter('Europe/London')).toEqual(
            `data/startDate/iv ge 2022-08-09T23:00:00.000Z and data/startDate/iv le 2022-08-10T23:00:00.000Z`,
          );
        });

        test('Should return the filter for Los Angeles time', () => {
          // set system date to midday UTC
          jest.setSystemTime(new Date('2022-08-10T12:00:00.0Z'));

          expect(getEventFilter('America/Los_Angeles')).toEqual(
            `data/startDate/iv ge 2022-08-10T07:00:00.000Z and data/startDate/iv le 2022-08-11T07:00:00.000Z`,
          );
        });

        test('Should return the filter for Los Angeles time where it is still the previous day', () => {
          // set system date to 2AM UTC
          jest.setSystemTime(new Date('2022-08-10T02:00:00.0Z'));

          expect(getEventFilter('America/Los_Angeles')).toEqual(
            `data/startDate/iv ge 2022-08-09T07:00:00.000Z and data/startDate/iv le 2022-08-10T07:00:00.000Z`,
          );
        });
      });
    });

    describe('Event Happening Now Reminder', () => {
      beforeAll(() => {
        jest.useFakeTimers('modern');
      });

      afterAll(() => {
        jest.useRealTimers();
      });

      beforeEach(async () => {});

      test('Should fetch the reminder when it has already started', async () => {
        // set current time to one minute after the start of the fixture event
        jest.setSystemTime(DateTime.fromISO('2022-01-01T08:01:00Z').toJSDate());
        const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
        squidexGraphqlResponse.queryEventsContents![0]!.flatData.startDate =
          '2022-01-01T08:00:00Z';
        squidexGraphqlResponse.queryEventsContents![0]!.flatData.endDate =
          '2022-01-01T10:00:00Z';
        squidexGraphqlResponse.queryResearchOutputsContents = [];
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          squidexGraphqlResponse,
        );

        const result = await reminderDataProvider.fetch(fetchRemindersOptions);

        const expectedEventHappeningNowReminder =
          getEventHappeningNowReminder();
        expectedEventHappeningNowReminder.data.startDate =
          '2022-01-01T08:00:00Z';
        expectedEventHappeningNowReminder.data.endDate = '2022-01-01T10:00:00Z';
        expect(result).toEqual({
          total: 1,
          items: [expectedEventHappeningNowReminder],
        });
      });

      test('Should not fetch the reminder when it has already ended', async () => {
        // set current time to one minute after the end of the fixture event
        jest.setSystemTime(DateTime.fromISO('2022-01-01T10:01:00Z').toJSDate());
        const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
        squidexGraphqlResponse.queryEventsContents![0]!.flatData.startDate =
          '2022-01-01T08:00:00Z';
        squidexGraphqlResponse.queryEventsContents![0]!.flatData.endDate =
          '2022-01-01T10:00:00Z';
        squidexGraphqlResponse.queryResearchOutputsContents = [];
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          squidexGraphqlResponse,
        );

        const result = await reminderDataProvider.fetch(fetchRemindersOptions);

        expect(result).toEqual({
          total: 0,
          items: [],
        });
      });
    });

    describe('All types of reminders', () => {
      beforeAll(() => {
        jest.useFakeTimers('modern');
      });

      afterAll(() => {
        jest.useRealTimers();
      });

      test('Should sort the reminders by the date they are refering to, in a descending order', async () => {
        jest.setSystemTime(new Date('2022-01-01T09:00:00Z'));

        const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();

        const researchOutput1 = getSquidexReminderReseachOutputsContents();
        researchOutput1.id = 'research-output-1';
        researchOutput1.flatData.addedDate = '2022-01-01T09:00:00Z';
        const researchOutput2 = getSquidexReminderReseachOutputsContents();
        researchOutput2.id = 'research-output-2';
        researchOutput2.flatData.addedDate = '2022-01-01T14:00:00Z';

        const event1 = getSquidexReminderEventsContents();
        event1.id = 'event-1';
        // using event start-date for sorting
        event1.flatData.startDate = '2022-01-01T12:00:00Z';
        event1.flatData.endDate = '2022-01-01T13:00:00Z';
        const event2 = getSquidexReminderEventsContents();
        event2.id = 'event-2';
        event2.flatData.startDate = '2022-01-01T08:00:00Z';
        // using event end-date for sorting
        event2.flatData.endDate = '2022-01-01T10:00:00Z';

        squidexGraphqlResponse.queryEventsContents = [event1, event2];
        squidexGraphqlResponse.queryResearchOutputsContents = [
          researchOutput1,
          researchOutput2,
        ];
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          squidexGraphqlResponse,
        );

        const result = await reminderDataProvider.fetch(fetchRemindersOptions);

        const reminderIds = result.items.map((reminder) => reminder.id);
        expect(reminderIds).toEqual([
          `research-output-published-${researchOutput2.id}`,
          `event-happening-today-${event1.id}`,
          `event-happening-now-${event2.id}`,
          `research-output-published-${researchOutput1.id}`,
        ]);
      });
    });
  });
});
