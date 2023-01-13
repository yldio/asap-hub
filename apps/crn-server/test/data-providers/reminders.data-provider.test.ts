import {
  FetchRemindersOptions,
  PresentationUpdatedReminder,
  VideoEventReminder,
  EventNotesReminder,
} from '@asap-hub/model';
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
  getVideoEventUpdatedReminder,
  getPresentationUpdatedReminder,
  getNotesUpdatedReminder,
  getSharePresentationReminder,
  getPublishMaterialReminder,
  getUploadPresentationReminder,
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
        jest.useFakeTimers();
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

      test('Should not fetch the reminder if it is a future event', async () => {
        jest.setSystemTime(new Date('2021-12-30T09:00:00Z'));

        const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
        squidexGraphqlResponse.queryResearchOutputsContents = [];
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
          jest.useFakeTimers();
        });

        afterAll(() => {
          jest.useRealTimers();
        });

        test('Should return the filter for London time', () => {
          // set system date to midday UTC
          jest.setSystemTime(new Date('2022-08-10T12:00:00.0Z'));

          expect(getEventFilter('Europe/London')).toEqual(
            `data/videoRecordingUpdatedAt/iv ge 2022-08-09T12:00:00.000Z or data/presentationUpdatedAt/iv ge 2022-08-09T12:00:00.000Z or data/notesUpdatedAt/iv ge 2022-08-09T12:00:00.000Z or (data/startDate/iv ge 2022-08-09T23:00:00.000Z and data/startDate/iv le 2022-08-10T23:00:00.000Z) or (data/endDate/iv ge 2022-08-07T12:00:00.000Z and data/endDate/iv le 2022-08-10T12:00:00.000Z)`,
          );
        });

        test('Should return the filter for Los Angeles time', () => {
          // set system date to midday UTC
          jest.setSystemTime(new Date('2022-08-10T12:00:00.0Z'));

          expect(getEventFilter('America/Los_Angeles')).toEqual(
            `data/videoRecordingUpdatedAt/iv ge 2022-08-09T12:00:00.000Z or data/presentationUpdatedAt/iv ge 2022-08-09T12:00:00.000Z or data/notesUpdatedAt/iv ge 2022-08-09T12:00:00.000Z or (data/startDate/iv ge 2022-08-10T07:00:00.000Z and data/startDate/iv le 2022-08-11T07:00:00.000Z) or (data/endDate/iv ge 2022-08-07T12:00:00.000Z and data/endDate/iv le 2022-08-10T12:00:00.000Z)`,
          );
        });

        test('Should return the filter for Los Angeles time where it is still the previous day', () => {
          // set system date to 2AM UTC
          jest.setSystemTime(new Date('2022-08-10T02:00:00.0Z'));

          expect(getEventFilter('America/Los_Angeles')).toEqual(
            `data/videoRecordingUpdatedAt/iv ge 2022-08-09T02:00:00.000Z or data/presentationUpdatedAt/iv ge 2022-08-09T02:00:00.000Z or data/notesUpdatedAt/iv ge 2022-08-09T02:00:00.000Z or (data/startDate/iv ge 2022-08-09T07:00:00.000Z and data/startDate/iv le 2022-08-10T07:00:00.000Z) or (data/endDate/iv ge 2022-08-07T02:00:00.000Z and data/endDate/iv le 2022-08-10T02:00:00.000Z)`,
          );
        });
      });
    });

    describe('Event Happening Now Reminder', () => {
      beforeAll(() => {
        jest.useFakeTimers();
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

      test('Should not fetch the reminder when it is a future event', async () => {
        jest.setSystemTime(DateTime.fromISO('2021-12-30T10:01:00Z').toJSDate());
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

    describe('Share Presentation Reminder', () => {
      beforeAll(() => {
        jest.useFakeTimers();
      });

      afterAll(() => {
        jest.useRealTimers();
      });

      describe('When the user is one of the speakers and less than 72 hours have passed since the event ended', () => {
        it.each`
          asapRole     | teamRole
          ${`Grantee`} | ${`Lead PI (Core Leadership)`}
          ${`Grantee`} | ${'Co-PI (Core Leadership)'}
          ${`Grantee`} | ${'Collaborating PI'}
          ${`Grantee`} | ${`Key Personnel`}
          ${`Grantee`} | ${`Scientific Advisory Board`}
        `(
          `Should fetch the reminder when user has asap role $asapRole and team role $teamRole`,
          async ({ asapRole, teamRole }) => {
            // set current time to one minute after the end of the fixture event
            jest.setSystemTime(
              DateTime.fromISO('2022-01-01T10:01:00Z').toJSDate(),
            );
            const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
            squidexGraphqlResponse.queryEventsContents![0]!.flatData.startDate =
              '2022-01-01T08:00:00Z';
            squidexGraphqlResponse.queryEventsContents![0]!.flatData.endDate =
              '2022-01-01T10:00:00Z';

            squidexGraphqlResponse.queryEventsContents![0]!.flatData.speakers![0]!.team![0]! =
              { id: 'team-id-3', referencingUsersContents: [] };

            squidexGraphqlResponse.queryEventsContents![0]!.flatData.speakers![0]!.user![0]! =
              {
                id: 'user-id',
                flatData: {
                  role: asapRole,
                  teams: [
                    {
                      id: [
                        {
                          id: 'team-id-3',
                        },
                      ],
                      role: teamRole,
                    },
                  ],
                },
              };

            squidexGraphqlResponse.queryResearchOutputsContents = [];
            squidexGraphqlClientMock.request.mockResolvedValueOnce(
              squidexGraphqlResponse,
            );

            const result = await reminderDataProvider.fetch(
              fetchRemindersOptions,
            );

            const expectedEventRecentlyEndedReminder =
              getSharePresentationReminder();
            expectedEventRecentlyEndedReminder.data.endDate =
              '2022-01-01T10:00:00Z';
            expect(result).toEqual({
              total: 1,
              items: [expectedEventRecentlyEndedReminder],
            });
          },
        );

        it.each`
          asapRole     | teamRole
          ${`Grantee`} | ${`Project Manager`}
          ${`Grantee`} | ${`ASAP Staff`}
          ${`Staff`}   | ${`Lead PI (Core Leadership)`}
          ${`Staff`}   | ${`Lead PI (Core Leadership)`}
          ${`Staff`}   | ${'Co-PI (Core Leadership)'}
          ${`Staff`}   | ${'Collaborating PI'}
          ${`Staff`}   | ${`Key Personnel`}
          ${`Staff`}   | ${`Scientific Advisory Board`}
          ${`Staff`}   | ${`Project Manager`}
          ${`Staff`}   | ${`ASAP Staff`}
        `(
          `Should not fetch the reminder when user has asap role $asapRole and team role $teamRole`,
          async ({ asapRole, teamRole }) => {
            // set current time to one minute after the end of the fixture event
            jest.setSystemTime(
              DateTime.fromISO('2022-01-01T10:01:00Z').toJSDate(),
            );
            const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
            squidexGraphqlResponse.queryEventsContents![0]!.flatData.startDate =
              '2022-01-01T08:00:00Z';
            squidexGraphqlResponse.queryEventsContents![0]!.flatData.endDate =
              '2022-01-01T10:00:00Z';

            squidexGraphqlResponse.queryEventsContents![0]!.flatData.speakers![0]!.team![0]! =
              { id: 'team-id-3', referencingUsersContents: [] };

            squidexGraphqlResponse.queryEventsContents![0]!.flatData.speakers![0]!.user![0]! =
              {
                id: 'user-id',
                flatData: {
                  role: asapRole,
                  teams: [
                    {
                      id: [
                        {
                          id: 'team-id-3',
                        },
                      ],
                      role: teamRole,
                    },
                  ],
                },
              };

            squidexGraphqlResponse.queryResearchOutputsContents = [];
            squidexGraphqlClientMock.request.mockResolvedValueOnce(
              squidexGraphqlResponse,
            );

            const result = await reminderDataProvider.fetch(
              fetchRemindersOptions,
            );

            expect(result).toEqual({
              total: 0,
              items: [],
            });
          },
        );
      });

      it('Should not fetch the reminder when user is not one of the speakers', async () => {
        // set current time to one minute after the end of the fixture event
        jest.setSystemTime(DateTime.fromISO('2022-01-01T10:01:00Z').toJSDate());
        const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
        squidexGraphqlResponse.queryEventsContents![0]!.flatData.startDate =
          '2022-01-01T08:00:00Z';
        squidexGraphqlResponse.queryEventsContents![0]!.flatData.endDate =
          '2022-01-01T10:00:00Z';

        squidexGraphqlResponse.queryEventsContents![0]!.flatData.speakers![0]!.team![0]! =
          { id: 'team-id-3', referencingUsersContents: [] };

        squidexGraphqlResponse.queryEventsContents![0]!.flatData.speakers![0]!.user![0]! =
          {
            id: 'non-speaker',
            flatData: {
              role: 'Grantee',
              teams: [
                {
                  id: [
                    {
                      id: 'team-id-3',
                    },
                  ],
                  role: 'Lead PI (Core Leadership)',
                },
              ],
            },
          };

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

      it('Should not fetch the reminder when the event does not have speakers', async () => {
        // set current time to one minute after the end of the fixture event
        jest.setSystemTime(DateTime.fromISO('2022-01-01T10:01:00Z').toJSDate());
        const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
        squidexGraphqlResponse.queryEventsContents![0]!.flatData.startDate =
          '2022-01-01T08:00:00Z';
        squidexGraphqlResponse.queryEventsContents![0]!.flatData.endDate =
          '2022-01-01T10:00:00Z';

        squidexGraphqlResponse.queryEventsContents![0]!.flatData.speakers = [];

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

      it('Should not fetch the reminder when event speakers data come as null', async () => {
        // set current time to one minute after the end of the fixture event
        jest.setSystemTime(DateTime.fromISO('2022-01-01T10:01:00Z').toJSDate());
        const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
        squidexGraphqlResponse.queryEventsContents![0]!.flatData.startDate =
          '2022-01-01T08:00:00Z';
        squidexGraphqlResponse.queryEventsContents![0]!.flatData.endDate =
          '2022-01-01T10:00:00Z';

        squidexGraphqlResponse.queryEventsContents![0]!.flatData.speakers![0]!.team =
          null;

        squidexGraphqlResponse.queryEventsContents![0]!.flatData.speakers![0]!.user =
          null;
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

      it('Should fetch the reminder up until 72 hours of the end of the event', async () => {
        // set current time to 72 hours after the end of the fixture event
        jest.setSystemTime(DateTime.fromISO('2022-01-04T10:00:00Z').toJSDate());
        const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
        squidexGraphqlResponse.queryEventsContents![0]!.flatData.startDate =
          '2022-01-01T08:00:00Z';
        squidexGraphqlResponse.queryEventsContents![0]!.flatData.endDate =
          '2022-01-01T10:00:00Z';

        squidexGraphqlResponse.queryEventsContents![0]!.flatData.speakers![0]!.team![0]! =
          { id: 'team-id-3', referencingUsersContents: [] };

        squidexGraphqlResponse.queryEventsContents![0]!.flatData.speakers![0]!.user![0]! =
          {
            id: 'user-id',
            flatData: {
              role: 'Grantee',
              teams: [
                {
                  id: [
                    {
                      id: 'team-id-3',
                    },
                  ],
                  role: 'Lead PI (Core Leadership)',
                },
              ],
            },
          };

        squidexGraphqlResponse.queryResearchOutputsContents = [];
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          squidexGraphqlResponse,
        );

        const result = await reminderDataProvider.fetch(fetchRemindersOptions);

        const expectedEventRecentlyEndedReminder =
          getSharePresentationReminder();
        expectedEventRecentlyEndedReminder.data.endDate =
          '2022-01-01T10:00:00Z';
        expect(result).toEqual({
          total: 1,
          items: [expectedEventRecentlyEndedReminder],
        });
      });

      it('Should not fetch the reminder when it passed more than 72 hours of the end of the event', async () => {
        // set current time to 72 hours + 1 minute after the end of the fixture event
        jest.setSystemTime(DateTime.fromISO('2022-01-04T10:01:00Z').toJSDate());
        const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
        squidexGraphqlResponse.queryEventsContents![0]!.flatData.startDate =
          '2022-01-01T08:00:00Z';
        squidexGraphqlResponse.queryEventsContents![0]!.flatData.endDate =
          '2022-01-01T10:00:00Z';

        squidexGraphqlResponse.queryEventsContents![0]!.flatData.speakers![0]!.team![0]! =
          { id: 'team-id-3', referencingUsersContents: [] };

        squidexGraphqlResponse.queryEventsContents![0]!.flatData.speakers![0]!.user![0]! =
          {
            id: 'user-id',
            flatData: {
              role: 'Grantee',
              teams: [
                {
                  id: [
                    {
                      id: 'team-id-3',
                    },
                  ],
                  role: 'Lead PI (Core Leadership)',
                },
              ],
            },
          };

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

      it('Should not fetch the reminder when the event is a future event', async () => {
        jest.setSystemTime(DateTime.fromISO('2023-01-04T10:00:00Z').toJSDate());
        const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
        squidexGraphqlResponse.queryEventsContents![0]!.flatData.startDate =
          '2023-01-06T08:00:00Z';
        squidexGraphqlResponse.queryEventsContents![0]!.flatData.endDate =
          '2023-01-06T10:00:00Z';

        squidexGraphqlResponse.queryEventsContents![0]!.flatData.speakers![0]!.team![0]! =
          { id: 'team-id-3', referencingUsersContents: [] };

        squidexGraphqlResponse.queryEventsContents![0]!.flatData.speakers![0]!.user![0]! =
          {
            id: 'user-id',
            flatData: {
              role: 'Grantee',
              teams: [
                {
                  id: [
                    {
                      id: 'team-id-3',
                    },
                  ],
                  role: 'Lead PI (Core Leadership)',
                },
              ],
            },
          };

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

      it('Should not fetch the publish material reminder when the event has not ended', async () => {
        jest.setSystemTime(DateTime.fromISO('2023-01-06T10:00:00Z').toJSDate());
        const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
        squidexGraphqlResponse.queryEventsContents![0]!.flatData.startDate =
          '2023-01-06T08:00:00Z';
        squidexGraphqlResponse.queryEventsContents![0]!.flatData.endDate =
          '2023-01-06T11:00:00Z';

        squidexGraphqlResponse.queryEventsContents![0]!.flatData.speakers![0]!.team![0]! =
          { id: 'team-id-3', referencingUsersContents: [] };

        squidexGraphqlResponse.queryEventsContents![0]!.flatData.speakers![0]!.user![0]! =
          {
            id: 'user-id',
            flatData: {
              role: 'Grantee',
              teams: [
                {
                  id: [
                    {
                      id: 'team-id-3',
                    },
                  ],
                  role: 'Lead PI (Core Leadership)',
                },
              ],
            },
          };

        squidexGraphqlResponse.queryResearchOutputsContents = [];
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          squidexGraphqlResponse,
        );

        const result = await reminderDataProvider.fetch(fetchRemindersOptions);

        expect(result.items.map((reminder) => reminder.type)).toEqual([
          'Happening Now',
        ]);
      });

      it('Should fetch the reminder if user is linked to some team that she/he does not belong in the event', async () => {
        // set current time to one minute after the end of the fixture event
        jest.setSystemTime(DateTime.fromISO('2022-01-01T10:01:00Z').toJSDate());
        const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
        squidexGraphqlResponse.queryEventsContents![0]!.flatData.startDate =
          '2022-01-01T08:00:00Z';
        squidexGraphqlResponse.queryEventsContents![0]!.flatData.endDate =
          '2022-01-01T10:00:00Z';

        squidexGraphqlResponse.queryEventsContents![0]!.flatData.speakers![0]!.team![0]! =
          { id: 'random-team', referencingUsersContents: [] };

        squidexGraphqlResponse.queryEventsContents![0]!.flatData.speakers![0]!.user![0]! =
          {
            id: 'user-id',
            flatData: {
              role: 'Grantee',
              teams: [
                {
                  id: [
                    {
                      id: 'team-id-3',
                    },
                  ],
                  role: 'Lead PI (Core Leadership)',
                },
              ],
            },
          };

        squidexGraphqlResponse.queryResearchOutputsContents = [];
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          squidexGraphqlResponse,
        );

        const result = await reminderDataProvider.fetch(fetchRemindersOptions);

        const expectedEventRecentlyEndedReminder =
          getSharePresentationReminder();
        expectedEventRecentlyEndedReminder.data.endDate =
          '2022-01-01T10:00:00Z';
        expect(result).toEqual({
          total: 1,
          items: [expectedEventRecentlyEndedReminder],
        });
      });
    });

    describe('Publish Material Reminder', () => {
      beforeAll(() => {
        jest.useFakeTimers();
      });

      afterAll(() => {
        jest.useRealTimers();
      });

      describe('When less than 72 hours have passed since the event ended', () => {
        it(`Should fetch the reminder if user has asap role Staff`, async () => {
          // set current time to one minute after the end of the fixture event
          jest.setSystemTime(
            DateTime.fromISO('2022-01-01T10:01:00Z').toJSDate(),
          );
          const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
          squidexGraphqlResponse.queryEventsContents![0]!.flatData.startDate =
            '2022-01-01T08:00:00Z';
          squidexGraphqlResponse.queryEventsContents![0]!.flatData.endDate =
            '2022-01-01T10:00:00Z';

          squidexGraphqlResponse.findUsersContent!.flatData!.role! = 'Staff';

          squidexGraphqlResponse.queryResearchOutputsContents = [];
          squidexGraphqlClientMock.request.mockResolvedValueOnce(
            squidexGraphqlResponse,
          );

          const result = await reminderDataProvider.fetch(
            fetchRemindersOptions,
          );

          const expectedEventRecentlyEndedReminder =
            getPublishMaterialReminder();
          expectedEventRecentlyEndedReminder.data.endDate =
            '2022-01-01T10:00:00Z';
          expect(result).toEqual({
            total: 1,
            items: [expectedEventRecentlyEndedReminder],
          });
        });

        it.each`
          asapRole
          ${`Grantee`}
          ${`Guest`}
          ${`Hidden`}
        `(
          `Should not fetch the reminder if user has asap role $asapRole`,
          async ({ asapRole }) => {
            // set current time to one minute after the end of the fixture event
            jest.setSystemTime(
              DateTime.fromISO('2022-01-01T10:01:00Z').toJSDate(),
            );
            const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
            squidexGraphqlResponse.queryEventsContents![0]!.flatData.startDate =
              '2022-01-01T08:00:00Z';
            squidexGraphqlResponse.queryEventsContents![0]!.flatData.endDate =
              '2022-01-01T10:00:00Z';

            squidexGraphqlResponse.findUsersContent!.flatData!.role! = asapRole;

            squidexGraphqlResponse.queryResearchOutputsContents = [];
            squidexGraphqlClientMock.request.mockResolvedValueOnce(
              squidexGraphqlResponse,
            );

            const result = await reminderDataProvider.fetch(
              fetchRemindersOptions,
            );

            expect(result).toEqual({
              total: 0,
              items: [],
            });
          },
        );
      });

      it('Should not fetch the reminder when it passed more than 72 hours of the end of the event', async () => {
        // set current time to 72 hours + 1 minute after the end of the fixture event
        jest.setSystemTime(DateTime.fromISO('2022-01-04T10:01:00Z').toJSDate());
        const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
        squidexGraphqlResponse.queryEventsContents![0]!.flatData.startDate =
          '2022-01-01T08:00:00Z';
        squidexGraphqlResponse.queryEventsContents![0]!.flatData.endDate =
          '2022-01-01T10:00:00Z';

        squidexGraphqlResponse.findUsersContent!.flatData!.role! = 'Staff';

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

      it('Should not fetch the reminder when the event is a future event', async () => {
        jest.setSystemTime(DateTime.fromISO('2022-01-04T10:01:00Z').toJSDate());
        const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
        squidexGraphqlResponse.queryEventsContents![0]!.flatData.startDate =
          '2023-01-01T08:00:00Z';
        squidexGraphqlResponse.queryEventsContents![0]!.flatData.endDate =
          '2023-01-01T10:00:00Z';

        squidexGraphqlResponse.findUsersContent!.flatData!.role! = 'Staff';

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

      it('Should not fetch the publish material reminder when the event has not ended', async () => {
        jest.setSystemTime(DateTime.fromISO('2022-01-04T10:01:00Z').toJSDate());
        const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
        squidexGraphqlResponse.queryEventsContents![0]!.flatData.startDate =
          '2022-01-04T08:00:00Z';
        squidexGraphqlResponse.queryEventsContents![0]!.flatData.endDate =
          '2022-01-04T11:00:00Z';

        squidexGraphqlResponse.findUsersContent!.flatData!.role! = 'Staff';

        squidexGraphqlResponse.queryResearchOutputsContents = [];
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          squidexGraphqlResponse,
        );

        const result = await reminderDataProvider.fetch(fetchRemindersOptions);

        expect(result.items.map((reminder) => reminder.type)).toEqual([
          'Happening Now',
        ]);
      });
    });

    describe('Upload Presentation Reminder', () => {
      beforeAll(() => {
        jest.useFakeTimers();
      });

      afterAll(() => {
        jest.useRealTimers();
      });

      describe('When the user is PM of a speakers team and less than 72 hours have passed since the event ended', () => {
        it(`Should fetch the reminder when user has asap role Grantee and team role Project Manager`, async () => {
          // set current time to one minute after the end of the fixture event
          jest.setSystemTime(
            DateTime.fromISO('2022-01-01T10:01:00Z').toJSDate(),
          );
          const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
          squidexGraphqlResponse.queryEventsContents![0]!.flatData.startDate =
            '2022-01-01T08:00:00Z';
          squidexGraphqlResponse.queryEventsContents![0]!.flatData.endDate =
            '2022-01-01T10:00:00Z';

          squidexGraphqlResponse.queryEventsContents![0]!.flatData.speakers![0]!.team![0]! =
            { id: 'team-id-3', referencingUsersContents: [] };

          squidexGraphqlResponse.findUsersContent!.flatData.teams = [
            {
              id: [{ id: 'team-id-3' }],
              role: 'Project Manager',
            },
          ];
          squidexGraphqlResponse.findUsersContent!.flatData!.role! = 'Grantee';

          squidexGraphqlResponse.queryResearchOutputsContents = [];
          squidexGraphqlClientMock.request.mockResolvedValueOnce(
            squidexGraphqlResponse,
          );

          const result = await reminderDataProvider.fetch(
            fetchRemindersOptions,
          );

          const expectedEventRecentlyEndedReminder =
            getUploadPresentationReminder();
          expectedEventRecentlyEndedReminder.data.endDate =
            '2022-01-01T10:00:00Z';
          expect(result).toEqual({
            total: 1,
            items: [expectedEventRecentlyEndedReminder],
          });
        });

        it.each`
          asapRole     | teamRole
          ${`Grantee`} | ${`Lead PI (Core Leadership)`}
          ${`Grantee`} | ${'Co-PI (Core Leadership)'}
          ${`Grantee`} | ${'Collaborating PI'}
          ${`Grantee`} | ${`Key Personnel`}
          ${`Grantee`} | ${`Scientific Advisory Board`}
          ${`Grantee`} | ${`ASAP Staff`}
          ${`Staff`}   | ${`Lead PI (Core Leadership)`}
          ${`Staff`}   | ${`Lead PI (Core Leadership)`}
          ${`Staff`}   | ${'Co-PI (Core Leadership)'}
          ${`Staff`}   | ${'Collaborating PI'}
          ${`Staff`}   | ${`Key Personnel`}
          ${`Staff`}   | ${`Scientific Advisory Board`}
          ${`Staff`}   | ${`Project Manager`}
          ${`Staff`}   | ${`ASAP Staff`}
        `(
          `Should not fetch the reminder when user has asap role $asapRole and team role $teamRole`,
          async ({ asapRole, teamRole }) => {
            // set current time to one minute after the end of the fixture event
            jest.setSystemTime(
              DateTime.fromISO('2022-01-01T10:01:00Z').toJSDate(),
            );
            const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
            squidexGraphqlResponse.queryEventsContents![0]!.flatData.startDate =
              '2022-01-01T08:00:00Z';
            squidexGraphqlResponse.queryEventsContents![0]!.flatData.endDate =
              '2022-01-01T10:00:00Z';

            squidexGraphqlResponse.queryEventsContents![0]!.flatData.speakers![0]!.team![0]! =
              { id: 'team-id-3', referencingUsersContents: [] };

            squidexGraphqlResponse.findUsersContent!.flatData.teams = [
              {
                id: [{ id: 'team-id-3' }],
                role: teamRole,
              },
            ];
            squidexGraphqlResponse.findUsersContent!.flatData!.role! = asapRole;

            squidexGraphqlResponse.queryResearchOutputsContents = [];
            squidexGraphqlClientMock.request.mockResolvedValueOnce(
              squidexGraphqlResponse,
            );

            const result = await reminderDataProvider.fetch(
              fetchRemindersOptions,
            );
            expect(
              result.items
                .map((reminder) => reminder.type)
                .includes('Upload Presentation'),
            ).toBeFalsy();
          },
        );
      });

      it('Should not fetch the reminder when user is a PM but not one of a team which is associated to a speaker', async () => {
        // set current time to one minute after the end of the fixture event
        jest.setSystemTime(DateTime.fromISO('2022-01-01T10:01:00Z').toJSDate());
        const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
        squidexGraphqlResponse.queryEventsContents![0]!.flatData.startDate =
          '2022-01-01T08:00:00Z';
        squidexGraphqlResponse.queryEventsContents![0]!.flatData.endDate =
          '2022-01-01T10:00:00Z';

        squidexGraphqlResponse.queryEventsContents![0]!.flatData.speakers![0]!.team![0]! =
          { id: 'team-id-3', referencingUsersContents: [] };

        squidexGraphqlResponse.findUsersContent!.flatData.teams = [
          {
            id: [{ id: 'team-id-333' }],
            role: 'Project Manager',
          },
        ];

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

      it('Should not fetch the reminder when the event does not have speakers', async () => {
        // set current time to one minute after the end of the fixture event
        jest.setSystemTime(DateTime.fromISO('2022-01-01T10:01:00Z').toJSDate());
        const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
        squidexGraphqlResponse.queryEventsContents![0]!.flatData.startDate =
          '2022-01-01T08:00:00Z';
        squidexGraphqlResponse.queryEventsContents![0]!.flatData.endDate =
          '2022-01-01T10:00:00Z';

        squidexGraphqlResponse.queryEventsContents![0]!.flatData.speakers = [];

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

      it('Should not fetch the reminder when event speakers data come as null', async () => {
        // set current time to one minute after the end of the fixture event
        jest.setSystemTime(DateTime.fromISO('2022-01-01T10:01:00Z').toJSDate());
        const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
        squidexGraphqlResponse.queryEventsContents![0]!.flatData.startDate =
          '2022-01-01T08:00:00Z';
        squidexGraphqlResponse.queryEventsContents![0]!.flatData.endDate =
          '2022-01-01T10:00:00Z';

        squidexGraphqlResponse.queryEventsContents![0]!.flatData.speakers![0]!.team =
          null;

        squidexGraphqlResponse.queryEventsContents![0]!.flatData.speakers![0]!.user =
          null;
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

      it('Should fetch the reminder until 72 hours of the end of the event', async () => {
        // set current time to 72 hours after the end of the fixture event
        jest.setSystemTime(DateTime.fromISO('2022-01-04T10:00:00Z').toJSDate());
        const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
        squidexGraphqlResponse.queryEventsContents![0]!.flatData.startDate =
          '2022-01-01T08:00:00Z';
        squidexGraphqlResponse.queryEventsContents![0]!.flatData.endDate =
          '2022-01-01T10:00:00Z';

        squidexGraphqlResponse.queryEventsContents![0]!.flatData.speakers![0]!.team![0]! =
          { id: 'team-id-3', referencingUsersContents: [] };

        squidexGraphqlResponse.findUsersContent!.flatData.teams = [
          {
            id: [{ id: 'team-id-3' }],
            role: 'Project Manager',
          },
        ];

        squidexGraphqlResponse.queryResearchOutputsContents = [];
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          squidexGraphqlResponse,
        );

        const result = await reminderDataProvider.fetch(fetchRemindersOptions);

        const expectedEventRecentlyEndedReminder =
          getUploadPresentationReminder();
        expectedEventRecentlyEndedReminder.data.endDate =
          '2022-01-01T10:00:00Z';
        expect(result).toEqual({
          total: 1,
          items: [expectedEventRecentlyEndedReminder],
        });
      });

      it('Should not fetch the reminder when more than 72 hours have passed since the end of the event', async () => {
        // set current time to 72 hours + 1 minute after the end of the fixture event
        jest.setSystemTime(DateTime.fromISO('2022-01-04T10:01:00Z').toJSDate());
        const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
        squidexGraphqlResponse.queryEventsContents![0]!.flatData.startDate =
          '2022-01-01T08:00:00Z';
        squidexGraphqlResponse.queryEventsContents![0]!.flatData.endDate =
          '2022-01-01T10:00:00Z';

        squidexGraphqlResponse.queryEventsContents![0]!.flatData.speakers![0]!.team![0]! =
          { id: 'team-id-3', referencingUsersContents: [] };

        squidexGraphqlResponse.findUsersContent!.flatData.teams = [
          {
            id: [{ id: 'team-id-3' }],
            role: 'Project Manager',
          },
        ];

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

      it('Should not fetch the reminder when the event is a future event', async () => {
        jest.setSystemTime(DateTime.fromISO('2023-01-04T10:00:00Z').toJSDate());
        const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
        squidexGraphqlResponse.queryEventsContents![0]!.flatData.startDate =
          '2023-01-06T08:00:00Z';
        squidexGraphqlResponse.queryEventsContents![0]!.flatData.endDate =
          '2023-01-06T10:00:00Z';

        squidexGraphqlResponse.queryEventsContents![0]!.flatData.speakers![0]!.team![0]! =
          { id: 'team-id-3', referencingUsersContents: [] };

        squidexGraphqlResponse.findUsersContent!.flatData.teams = [
          {
            id: [{ id: 'team-id-3' }],
            role: 'Project Manager',
          },
        ];

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

      it('Should not fetch the reminder when the event has not ended', async () => {
        jest.setSystemTime(DateTime.fromISO('2023-01-06T10:00:00Z').toJSDate());
        const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
        squidexGraphqlResponse.queryEventsContents![0]!.flatData.startDate =
          '2023-01-06T08:00:00Z';
        squidexGraphqlResponse.queryEventsContents![0]!.flatData.endDate =
          '2023-01-06T11:00:00Z';

        squidexGraphqlResponse.queryEventsContents![0]!.flatData.speakers![0]!.team![0]! =
          { id: 'team-id-3', referencingUsersContents: [] };

        squidexGraphqlResponse.findUsersContent!.flatData.teams = [
          {
            id: [{ id: 'team-id-3' }],
            role: 'Project Manager',
          },
        ];

        squidexGraphqlResponse.queryResearchOutputsContents = [];
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          squidexGraphqlResponse,
        );

        const result = await reminderDataProvider.fetch(fetchRemindersOptions);

        expect(result.items.map((reminder) => reminder.type)).toEqual([
          'Happening Now',
        ]);
      });
    });

    interface TestProps {
      material: 'Video' | 'Presentation' | 'Notes';
      materialUpdatedAtName:
        | 'videoRecordingUpdatedAt'
        | 'presentationUpdatedAt'
        | 'notesUpdatedAt';
      expectedMaterialReminder:
        | PresentationUpdatedReminder
        | VideoEventReminder
        | EventNotesReminder;
    }

    describe.each`
      material          | materialUpdatedAtName        | expectedMaterialReminder
      ${'Video'}        | ${'videoRecordingUpdatedAt'} | ${getVideoEventUpdatedReminder()}
      ${'Presentation'} | ${'presentationUpdatedAt'}   | ${getPresentationUpdatedReminder()}
      ${'Notes'}        | ${'notesUpdatedAt'}          | ${getNotesUpdatedReminder()}
    `(
      '$material Updated Reminder',
      ({
        material,
        materialUpdatedAtName,
        expectedMaterialReminder,
      }: TestProps) => {
        beforeAll(() => {
          jest.useFakeTimers('modern');
        });

        afterAll(() => {
          jest.useRealTimers();
        });

        test(`Should fetch the reminder if a ${material} was updated in an event between now and 24 hours ago`, async () => {
          const materialUpdatedAt = '2022-09-01T08:00:00Z';
          // set the current date to seconds after the material updated at
          const time = DateTime.fromISO(materialUpdatedAt)
            .plus({ seconds: 40 })
            .toJSDate();
          jest.setSystemTime(time);

          const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
          squidexGraphqlResponse.queryResearchOutputsContents = [];
          squidexGraphqlResponse.queryEventsContents![0]!.flatData[
            materialUpdatedAtName
          ] = materialUpdatedAt;
          squidexGraphqlClientMock.request.mockResolvedValueOnce(
            squidexGraphqlResponse,
          );

          const result = await reminderDataProvider.fetch(
            fetchRemindersOptions,
          );
          expect(result).toEqual({
            total: 1,
            items: [
              {
                ...expectedMaterialReminder,
                data: {
                  ...expectedMaterialReminder.data,
                  [materialUpdatedAtName]: materialUpdatedAt,
                },
              },
            ],
          });
        });

        test(`Should not fetch the reminder if a ${material} in an event was updated more that 24 hours ago`, async () => {
          const materialUpdatedAt = '2022-09-01T08:00:00Z';
          // set the current date to more than 24 hours after the material updated at
          const time = DateTime.fromISO(materialUpdatedAt)
            .plus({ hours: 24, minutes: 1 })
            .toJSDate();
          jest.setSystemTime(time);

          const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
          squidexGraphqlResponse.queryResearchOutputsContents = [];
          squidexGraphqlResponse.queryEventsContents![0]!.flatData[
            materialUpdatedAtName
          ] = materialUpdatedAt;
          squidexGraphqlClientMock.request.mockResolvedValueOnce(
            squidexGraphqlResponse,
          );

          const result = await reminderDataProvider.fetch(
            fetchRemindersOptions,
          );
          expect(result).toEqual({
            total: 0,
            items: [],
          });
        });

        test(`Should not fetch the reminder if a ${material} in an event was updated after the current time`, async () => {
          /* This in theory could never happen, it would mean that the material will be updated in the future */

          const materialUpdatedAt = '2022-09-01T08:00:00Z';
          // set current time to 1 minute before the material is going to be updated
          const time = DateTime.fromISO(materialUpdatedAt)
            .minus({ minutes: 1 })
            .toJSDate();
          jest.setSystemTime(time);

          const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
          squidexGraphqlResponse.queryResearchOutputsContents = [];
          squidexGraphqlResponse.queryEventsContents![0]!.flatData[
            materialUpdatedAtName
          ] = materialUpdatedAt;
          squidexGraphqlClientMock.request.mockResolvedValueOnce(
            squidexGraphqlResponse,
          );

          const result = await reminderDataProvider.fetch(
            fetchRemindersOptions,
          );
          expect(result).toEqual({
            total: 0,
            items: [],
          });
        });
      },
    );

    describe('Multiple material reminders', () => {
      beforeAll(() => {
        jest.useFakeTimers('modern');
      });

      afterAll(() => {
        jest.useRealTimers();
      });

      test(`Should fetch the reminders if more than one material was updated in an event between now and 24 hours ago`, async () => {
        const materialsUpdatedAt = '2022-09-01T08:00:00Z';
        // set the current date to seconds after the material updated at
        const time = DateTime.fromISO(materialsUpdatedAt)
          .plus({ seconds: 40 })
          .toJSDate();
        jest.setSystemTime(time);

        const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
        squidexGraphqlResponse.queryResearchOutputsContents = [];
        squidexGraphqlResponse.queryEventsContents![0]!.flatData.presentationUpdatedAt =
          materialsUpdatedAt;
        squidexGraphqlResponse.queryEventsContents![0]!.flatData.videoRecordingUpdatedAt =
          materialsUpdatedAt;
        squidexGraphqlResponse.queryEventsContents![0]!.flatData.notesUpdatedAt =
          materialsUpdatedAt;
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          squidexGraphqlResponse,
        );

        const result = await reminderDataProvider.fetch(fetchRemindersOptions);

        const presentationUpdatedReminder = getPresentationUpdatedReminder();
        presentationUpdatedReminder.data.presentationUpdatedAt =
          materialsUpdatedAt;

        const videoEventUpdatedReminder = getVideoEventUpdatedReminder();
        videoEventUpdatedReminder.data.videoRecordingUpdatedAt =
          materialsUpdatedAt;

        const notesEventUpdatedReminder = getNotesUpdatedReminder();
        notesEventUpdatedReminder.data.notesUpdatedAt = materialsUpdatedAt;

        expect(result).toEqual({
          total: 3,
          items: [
            videoEventUpdatedReminder,
            presentationUpdatedReminder,
            notesEventUpdatedReminder,
          ],
        });
      });
    });

    describe('All types of reminders', () => {
      beforeAll(() => {
        jest.useFakeTimers();
      });

      afterAll(() => {
        jest.useRealTimers();
      });

      test('Should sort the reminders by the date they are referring to, in a descending order', async () => {
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
        event1.flatData.videoRecordingUpdatedAt = '2022-01-01T08:00:00Z';
        event1.flatData.presentationUpdatedAt = '2022-01-01T08:02:00Z';
        const event2 = getSquidexReminderEventsContents();
        event2.id = 'event-2';
        event2.flatData.startDate = '2022-01-01T08:00:00Z';
        // using event end-date for sorting
        event2.flatData.endDate = '2022-01-01T10:00:00Z';
        event2.flatData.videoRecordingUpdatedAt = '2022-01-01T7:00:00Z';

        const event3 = getSquidexReminderEventsContents();
        event3.id = 'event-3';
        event3.flatData.startDate = '2022-01-01T07:00:00Z';
        event3.flatData.endDate = '2022-01-01T08:00:00Z';
        event3.flatData.speakers![0]!.user![0] = {
          id: 'user-id',
          flatData: {
            role: 'Grantee',
            teams: [
              {
                id: [
                  {
                    id: 'team-id-3',
                  },
                ],
                role: 'Lead PI (Core Leadership)',
              },
            ],
          },
        };

        squidexGraphqlResponse.queryEventsContents = [event1, event2, event3];
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
          `presentation-event-updated-${event1.id}`,
          `share-presentation-${event3.id}`,
          `video-event-updated-${event1.id}`,
        ]);
      });
    });
  });
});
