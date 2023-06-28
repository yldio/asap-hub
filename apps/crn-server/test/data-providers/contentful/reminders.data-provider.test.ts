import { getContentfulGraphqlClientMockServer } from '@asap-hub/contentful';
import {
  EventNotesReminder,
  FetchRemindersOptions,
  PresentationUpdatedReminder,
  VideoEventReminder,
} from '@asap-hub/model';
import { DateTime } from 'luxon';

import { ReminderContentfulDataProvider } from '../../../src/data-providers/contentful/reminders.data-provider';
import { getContentfulGraphqlClientMock } from '../../mocks/contentful-graphql-client.mock';
import { getContentfulGraphqlEvent } from '../../fixtures/events.fixtures';
import {
  getContentfulReminderEventsCollectionItem,
  getContentfulReminderUsersContent,
  getEventHappeningNowReminder,
  getEventHappeningTodayReminder,
  getNotesUpdatedReminder,
  getPresentationUpdatedReminder,
  getPublishMaterialReminder,
  getSharePresentationReminder,
  getTeamProjectManagerResponse,
  getUploadPresentationReminder,
  getVideoEventUpdatedReminder,
} from '../../fixtures/reminders.fixtures';

describe('Reminders data provider', () => {
  const contentfulGraphqlClientMock = getContentfulGraphqlClientMock();

  const remindersDataProvider = new ReminderContentfulDataProvider(
    contentfulGraphqlClientMock,
  );

  const contentfulGraphqlClientMockServer =
    getContentfulGraphqlClientMockServer({
      Events: () => getContentfulGraphqlEvent(),
    });

  const remindersDataProviderMockGraphql = new ReminderContentfulDataProvider(
    contentfulGraphqlClientMockServer,
  );

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(async () => {
    // set the current date to 1 minute after the beginning of the event
    const dayOfTheEvent = DateTime.fromISO(
      getContentfulGraphqlEvent().startDate,
    )
      .plus({ minutes: 1 })
      .toJSDate();
    jest.setSystemTime(dayOfTheEvent);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Fetch method', () => {
    const userId = 'user-id';
    const timezone = 'Europe/London';
    const fetchRemindersOptions: FetchRemindersOptions = { userId, timezone };

    test('Should fetch the reminders from contentful graphql', async () => {
      const result = await remindersDataProviderMockGraphql.fetch(
        fetchRemindersOptions,
      );

      expect(result).toEqual({
        total: 1,
        items: [
          {
            id: 'event-happening-now-ec3086d4-aa64-4f30-a0f7-5c5b95ffbcca',
            entity: 'Event',
            type: 'Happening Now',
            data: {
              eventId: 'ec3086d4-aa64-4f30-a0f7-5c5b95ffbcca',
              title: 'Example Event',
              startDate: '2009-12-24T16:20:14.000Z',
              endDate: '2009-12-24T16:30:54.000Z',
            },
          },
        ],
      });
    });

    test('Should consider timezone when fetching reminders', async () => {
      const zone = 'America/Sao_Paulo';
      const startDate = '2023-01-01T08:00:00Z';
      const endDate = '2023-01-01T10:00:00Z';
      jest.setSystemTime(
        DateTime.fromISO('2023-01-01T08:02:00.000+04:00', {
          zone,
        }).toJSDate(),
      );

      const eventMockResponse = getContentfulReminderEventsCollectionItem();
      eventMockResponse!.startDate = startDate;
      eventMockResponse!.endDate = endDate;

      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        eventsCollection: {
          items: [eventMockResponse],
        },
      });

      const result = await remindersDataProvider.fetch({
        ...fetchRemindersOptions,
        timezone: zone,
      });

      const expectedEventHappeningNowReminder = getEventHappeningNowReminder();
      expectedEventHappeningNowReminder.data.startDate = startDate;
      expectedEventHappeningNowReminder.data.endDate = endDate;

      expect(result.items.map((r) => r.type)).not.toContain('Happening Now');
      expect(result.items.map((r) => r.type)).toContain('Happening Today');
    });

    describe('Event Happening Now Reminder', () => {
      test('Should fetch the reminder when it has already started', async () => {
        const startDate = '2023-01-01T08:00:00Z';
        const endDate = '2023-01-01T10:00:00Z';
        jest.setSystemTime(DateTime.fromISO('2023-01-01T08:01:00Z').toJSDate());

        const eventMockResponse = getContentfulReminderEventsCollectionItem();
        eventMockResponse!.startDate = startDate;
        eventMockResponse!.endDate = endDate;

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          eventsCollection: {
            items: [eventMockResponse],
          },
        });

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);

        const expectedEventHappeningNowReminder =
          getEventHappeningNowReminder();
        expectedEventHappeningNowReminder.data.startDate = startDate;
        expectedEventHappeningNowReminder.data.endDate = endDate;

        expect(result.items.map((r) => r.type)).toContain('Happening Now');
        expect(result).toEqual({
          total: 1,
          items: [expectedEventHappeningNowReminder],
        });
      });

      test('Should not fetch the reminder when it has already ended', async () => {
        const startDate = '2023-01-01T08:00:00Z';
        const endDate = '2023-01-01T10:00:00Z';
        jest.setSystemTime(DateTime.fromISO('2023-01-01T10:01:00Z').toJSDate());

        const eventMockResponse = getContentfulReminderEventsCollectionItem();
        eventMockResponse!.startDate = startDate;
        eventMockResponse!.endDate = endDate;

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          eventsCollection: {
            items: [eventMockResponse],
          },
        });

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);

        expect(result.items.map((r) => r.type)).not.toContain('Happening Now');
      });

      test('Should not fetch the reminder when it is a future event', async () => {
        const startDate = '2023-01-01T08:00:00Z';
        const endDate = '2023-01-01T10:00:00Z';
        jest.setSystemTime(DateTime.fromISO('2022-12-31T08:01:00Z').toJSDate());

        const eventMockResponse = getContentfulReminderEventsCollectionItem();
        eventMockResponse!.startDate = startDate;
        eventMockResponse!.endDate = endDate;

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          eventsCollection: {
            items: [eventMockResponse],
          },
        });

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);

        expect(result.items.map((r) => r.type)).not.toContain('Happening Now');
        expect(result).toEqual({
          total: 0,
          items: [],
        });
      });
    });

    describe('Event Happening Today Reminder', () => {
      test('Should fetch the reminder if it has not started yet', async () => {
        const startDate = '2023-01-01T08:00:00Z';
        const endDate = '2023-01-01T10:00:00Z';
        jest.setSystemTime(DateTime.fromISO('2023-01-01T07:59:00Z').toJSDate());

        const eventMockResponse = getContentfulReminderEventsCollectionItem();
        eventMockResponse!.startDate = startDate;
        eventMockResponse!.endDate = endDate;

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          eventsCollection: {
            items: [eventMockResponse],
          },
        });

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);

        const expectedEventHappeningTodayReminder =
          getEventHappeningTodayReminder();
        expectedEventHappeningTodayReminder.data.startDate = startDate;

        expect(result.items.map((r) => r.type)).toContain('Happening Today');
        expect(result).toEqual({
          total: 1,
          items: [expectedEventHappeningTodayReminder],
        });
      });

      test('Should not fetch the reminder if it has already started', async () => {
        const startDate = '2023-01-01T08:00:00Z';
        const endDate = '2023-01-01T10:00:00Z';
        jest.setSystemTime(DateTime.fromISO('2023-01-01T08:01:00Z').toJSDate());

        const eventMockResponse = getContentfulReminderEventsCollectionItem();
        eventMockResponse!.startDate = startDate;
        eventMockResponse!.endDate = endDate;

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          eventsCollection: {
            items: [eventMockResponse],
          },
        });

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);

        expect(result.items.map((r) => r.type)).not.toContain(
          'Happening Today',
        );
      });

      test('Should not fetch the reminder if it is a future event', async () => {
        const startDate = '2023-01-01T08:00:00Z';
        const endDate = '2023-01-01T10:00:00Z';
        jest.setSystemTime(DateTime.fromISO('2022-12-31T08:01:00Z').toJSDate());

        const eventMockResponse = getContentfulReminderEventsCollectionItem();
        eventMockResponse!.startDate = startDate;
        eventMockResponse!.endDate = endDate;

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          eventsCollection: {
            items: [eventMockResponse],
          },
        });

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);

        expect(result.items.map((r) => r.type)).not.toContain(
          'Happening Today',
        );
      });
    });

    describe('Share Presentation Reminder', () => {
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
            const startDate = '2023-01-01T08:00:00Z';
            const endDate = '2023-01-01T10:00:00Z';
            jest.setSystemTime(
              DateTime.fromISO('2023-01-02T09:00:00Z').toJSDate(),
            );

            const eventMockResponse =
              getContentfulReminderEventsCollectionItem();
            eventMockResponse!.startDate = startDate;
            eventMockResponse!.endDate = endDate;

            const users = getContentfulReminderUsersContent();
            users!.role = asapRole;
            users!.teamsCollection!.items[0]!.role = teamRole;

            contentfulGraphqlClientMock.request.mockResolvedValueOnce({
              eventsCollection: {
                items: [eventMockResponse],
              },
              users,
            });

            contentfulGraphqlClientMock.request.mockResolvedValueOnce(
              getTeamProjectManagerResponse(),
            );

            const result = await remindersDataProvider.fetch(
              fetchRemindersOptions,
            );

            const sharePresentationReminder = getSharePresentationReminder();
            sharePresentationReminder.data.endDate = endDate;
            sharePresentationReminder.data.pmId = 'project-manager-1';
            expect(result).toEqual({
              total: 1,
              items: [sharePresentationReminder],
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
            const startDate = '2023-01-01T08:00:00Z';
            const endDate = '2023-01-01T10:00:00Z';
            jest.setSystemTime(
              DateTime.fromISO('2023-01-02T09:00:00Z').toJSDate(),
            );

            const eventMockResponse =
              getContentfulReminderEventsCollectionItem();
            eventMockResponse!.startDate = startDate;
            eventMockResponse!.endDate = endDate;

            const users = getContentfulReminderUsersContent();
            users!.role = asapRole;
            users!.teamsCollection!.items[0]!.role = teamRole;

            contentfulGraphqlClientMock.request.mockResolvedValueOnce({
              eventsCollection: {
                items: [eventMockResponse],
              },
              users,
            });

            const result = await remindersDataProvider.fetch(
              fetchRemindersOptions,
            );

            expect(result.items.map((r) => r.type)).not.toContain(
              'Share Presentation',
            );
          },
        );
      });

      it('Should not fetch the reminder when user is not one of the speakers', async () => {
        const startDate = '2023-01-01T08:00:00Z';
        const endDate = '2023-01-01T10:00:00Z';
        jest.setSystemTime(DateTime.fromISO('2023-01-02T09:00:00Z').toJSDate());

        const eventMockResponse = getContentfulReminderEventsCollectionItem();
        eventMockResponse!.startDate = startDate;
        eventMockResponse!.endDate = endDate;

        const users = getContentfulReminderUsersContent();
        users!.linkedFrom!.eventSpeakersCollection!.items = [];

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          eventsCollection: {
            items: [eventMockResponse],
          },
          users,
        });

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);

        expect(result).toEqual({
          total: 0,
          items: [],
        });
      });

      it('Should fetch the reminder up until 72 hours of the end of the event', async () => {
        const startDate = '2023-01-01T08:00:00Z';
        const endDate = '2023-01-01T10:00:00Z';
        jest.setSystemTime(DateTime.fromISO('2023-01-04T09:58:00Z').toJSDate());

        const eventMockResponse = getContentfulReminderEventsCollectionItem();
        eventMockResponse!.startDate = startDate;
        eventMockResponse!.endDate = endDate;

        const users = getContentfulReminderUsersContent();

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          eventsCollection: {
            items: [eventMockResponse],
          },
          users,
        });

        contentfulGraphqlClientMock.request.mockResolvedValueOnce(
          getTeamProjectManagerResponse(),
        );

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);

        const sharePresentationReminder = getSharePresentationReminder();
        sharePresentationReminder.data.endDate = endDate;
        sharePresentationReminder.data.pmId = 'project-manager-1';
        expect(result).toEqual({
          total: 1,
          items: [sharePresentationReminder],
        });
      });

      it('Should not fetch the reminder when it passed more than 72 hours of the end of the event', async () => {
        const startDate = '2023-01-01T08:00:00Z';
        const endDate = '2023-01-01T10:00:00Z';
        jest.setSystemTime(DateTime.fromISO('2023-01-04T10:01:00Z').toJSDate());

        const eventMockResponse = getContentfulReminderEventsCollectionItem();
        eventMockResponse!.startDate = startDate;
        eventMockResponse!.endDate = endDate;

        const users = getContentfulReminderUsersContent();

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          eventsCollection: {
            items: [eventMockResponse],
          },
          users,
        });

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);

        expect(result).toEqual({
          total: 0,
          items: [],
        });
      });

      it('Should not fetch the reminder when the event is a future event', async () => {
        const startDate = '2023-01-01T08:00:00Z';
        const endDate = '2023-01-01T10:00:00Z';
        jest.setSystemTime(DateTime.fromISO('2022-12-31T10:00:00Z').toJSDate());

        const eventMockResponse = getContentfulReminderEventsCollectionItem();
        eventMockResponse!.startDate = startDate;
        eventMockResponse!.endDate = endDate;

        const users = getContentfulReminderUsersContent();

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          eventsCollection: {
            items: [eventMockResponse],
          },
          users,
        });

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);

        expect(result).toEqual({
          total: 0,
          items: [],
        });
      });

      it('Should not fetch the reminder if it has not ended', async () => {
        const startDate = '2023-01-01T08:00:00Z';
        const endDate = '2023-01-01T10:00:00Z';
        jest.setSystemTime(DateTime.fromISO('2023-01-01T09:00:00Z').toJSDate());

        const eventMockResponse = getContentfulReminderEventsCollectionItem();
        eventMockResponse!.startDate = startDate;
        eventMockResponse!.endDate = endDate;

        const users = getContentfulReminderUsersContent();

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          eventsCollection: {
            items: [eventMockResponse],
          },
          users,
        });

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);

        expect(result.items.map((r) => r.type)).not.toContain(
          'Share Presentation',
        );
      });
    });

    describe('Publish Material Reminder', () => {
      describe('When less than 72 hours have passed since the event ended', () => {
        it('Should fetch the reminder if the user asap role is Staff', async () => {
          const startDate = '2023-01-01T08:00:00Z';
          const endDate = '2023-01-01T10:00:00Z';
          jest.setSystemTime(
            DateTime.fromISO('2023-01-02T09:00:00Z').toJSDate(),
          );

          const eventMockResponse = getContentfulReminderEventsCollectionItem();
          eventMockResponse!.startDate = startDate;
          eventMockResponse!.endDate = endDate;

          const users = getContentfulReminderUsersContent();
          users!.role = 'Staff';

          contentfulGraphqlClientMock.request.mockResolvedValueOnce({
            eventsCollection: {
              items: [eventMockResponse],
            },
            users,
          });

          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );

          const publishMaterialReminder = getPublishMaterialReminder();
          publishMaterialReminder.data.endDate = endDate;

          expect(result.items.map((r) => r.type)).toContain('Publish Material');

          expect(result).toEqual({
            total: 1,
            items: [publishMaterialReminder],
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
            const startDate = '2023-01-01T08:00:00Z';
            const endDate = '2023-01-01T10:00:00Z';
            jest.setSystemTime(
              DateTime.fromISO('2023-01-02T09:00:00Z').toJSDate(),
            );

            const eventMockResponse =
              getContentfulReminderEventsCollectionItem();
            eventMockResponse!.startDate = startDate;
            eventMockResponse!.endDate = endDate;

            const users = getContentfulReminderUsersContent();
            users!.role = asapRole;

            contentfulGraphqlClientMock.request.mockResolvedValueOnce({
              eventsCollection: {
                items: [eventMockResponse],
              },
              users,
            });

            contentfulGraphqlClientMock.request.mockResolvedValueOnce(
              getTeamProjectManagerResponse(),
            );

            const result = await remindersDataProvider.fetch(
              fetchRemindersOptions,
            );

            expect(result.items.map((r) => r.type)).not.toContain(
              'Publish Material',
            );
          },
        );
      });

      it('Should fetch the reminder up until 72 hours of the end of the event', async () => {
        const startDate = '2023-01-01T08:00:00Z';
        const endDate = '2023-01-01T10:00:00Z';
        jest.setSystemTime(DateTime.fromISO('2023-01-04T09:58:00Z').toJSDate());

        const eventMockResponse = getContentfulReminderEventsCollectionItem();
        eventMockResponse!.startDate = startDate;
        eventMockResponse!.endDate = endDate;

        const users = getContentfulReminderUsersContent();
        users!.role = 'Staff';

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          eventsCollection: {
            items: [eventMockResponse],
          },
          users,
        });

        contentfulGraphqlClientMock.request.mockResolvedValueOnce(
          getTeamProjectManagerResponse(),
        );

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);

        const publishMaterialReminder = getPublishMaterialReminder();
        publishMaterialReminder.data.endDate = endDate;
        expect(result).toEqual({
          total: 1,
          items: [publishMaterialReminder],
        });
      });

      it('Should not fetch the reminder when it passed more than 72 hours of the end of the event', async () => {
        const startDate = '2023-01-01T08:00:00Z';
        const endDate = '2023-01-01T10:00:00Z';
        jest.setSystemTime(DateTime.fromISO('2023-01-04T10:01:00Z').toJSDate());

        const eventMockResponse = getContentfulReminderEventsCollectionItem();
        eventMockResponse!.startDate = startDate;
        eventMockResponse!.endDate = endDate;

        const users = getContentfulReminderUsersContent();
        users!.role = 'Staff';

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          eventsCollection: {
            items: [eventMockResponse],
          },
          users,
        });

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);

        expect(result.items.map((r) => r.type)).not.toContain(
          'Publish Material',
        );
      });

      it('Should not fetch the reminder when the event is a future event', async () => {
        const startDate = '2023-01-01T08:00:00Z';
        const endDate = '2023-01-01T10:00:00Z';
        jest.setSystemTime(DateTime.fromISO('2022-12-31T10:00:00Z').toJSDate());

        const eventMockResponse = getContentfulReminderEventsCollectionItem();
        eventMockResponse!.startDate = startDate;
        eventMockResponse!.endDate = endDate;

        const users = getContentfulReminderUsersContent();
        users!.role = 'Staff';

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          eventsCollection: {
            items: [eventMockResponse],
          },
          users,
        });

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);

        expect(result.items.map((r) => r.type)).not.toContain(
          'Publish Material',
        );
      });

      it('Should not fetch the reminder if it has not ended', async () => {
        const startDate = '2023-01-01T08:00:00Z';
        const endDate = '2023-01-01T10:00:00Z';
        jest.setSystemTime(DateTime.fromISO('2023-01-01T09:00:00Z').toJSDate());

        const eventMockResponse = getContentfulReminderEventsCollectionItem();
        eventMockResponse!.startDate = startDate;
        eventMockResponse!.endDate = endDate;

        const users = getContentfulReminderUsersContent();
        users!.role = 'Staff';

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          eventsCollection: {
            items: [eventMockResponse],
          },
          users,
        });

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);

        expect(result.items.map((r) => r.type)).not.toContain(
          'Publish Material',
        );
      });
    });

    describe('Upload Presentation Reminder', () => {
      describe('When less than 72 hours have passed since the event ended', () => {
        it.each`
          asapRole
          ${`Grantee`}
          ${`Guest`}
          ${`Hidden`}
        `(
          `Should fetch the reminder when user asap role is $asapRole and user is Project Manager of one of the speakers team`,
          async ({ asapRole }) => {
            const startDate = '2023-01-01T08:00:00Z';
            const endDate = '2023-01-01T10:00:00Z';
            jest.setSystemTime(
              DateTime.fromISO('2023-01-02T09:00:00Z').toJSDate(),
            );

            const eventMockResponse =
              getContentfulReminderEventsCollectionItem();
            eventMockResponse!.startDate = startDate;
            eventMockResponse!.endDate = endDate;

            const users = getContentfulReminderUsersContent();
            users!.role = asapRole;
            users!.teamsCollection!.items[0]!.role = 'Project Manager';

            contentfulGraphqlClientMock.request.mockResolvedValueOnce({
              eventsCollection: {
                items: [eventMockResponse],
              },
              users,
            });

            const result = await remindersDataProvider.fetch(
              fetchRemindersOptions,
            );

            const uploadPresentationReminder = getUploadPresentationReminder();
            uploadPresentationReminder.data.endDate = endDate;

            expect(result.items.map((r) => r.type)).toContain(
              'Upload Presentation',
            );

            expect(result).toEqual({
              total: 1,
              items: [uploadPresentationReminder],
            });
          },
        );
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
        ${`Staff`}   | ${'Co-PI (Core Leadership)'}
        ${`Staff`}   | ${'Collaborating PI'}
        ${`Staff`}   | ${`Key Personnel`}
        ${`Staff`}   | ${`Scientific Advisory Board`}
        ${`Staff`}   | ${`Project Manager`}
        ${`Staff`}   | ${`ASAP Staff`}
      `(
        `Should not fetch the reminder when user has asap role $asapRole and team role $teamRole`,
        async ({ asapRole, teamRole }) => {
          const startDate = '2023-01-01T08:00:00Z';
          const endDate = '2023-01-01T10:00:00Z';
          jest.setSystemTime(
            DateTime.fromISO('2023-01-02T09:00:00Z').toJSDate(),
          );

          const eventMockResponse = getContentfulReminderEventsCollectionItem();
          eventMockResponse!.startDate = startDate;
          eventMockResponse!.endDate = endDate;

          const users = getContentfulReminderUsersContent();
          users!.role = asapRole;
          users!.teamsCollection!.items[0]!.role = teamRole;

          contentfulGraphqlClientMock.request.mockResolvedValueOnce({
            eventsCollection: {
              items: [eventMockResponse],
            },
            users,
          });

          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            getTeamProjectManagerResponse(),
          );

          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );

          const uploadPresentationReminder = getUploadPresentationReminder();
          uploadPresentationReminder.data.endDate = endDate;

          expect(result.items.map((r) => r.type)).not.toContain(
            'Upload Presentation',
          );
        },
      );

      it('Should not fetch the reminder when user is a PM but not one of a team which is associated to a speaker', async () => {
        const startDate = '2023-01-01T08:00:00Z';
        const endDate = '2023-01-01T10:00:00Z';
        jest.setSystemTime(DateTime.fromISO('2023-01-02T09:00:00Z').toJSDate());

        const eventMockResponse = getContentfulReminderEventsCollectionItem();
        eventMockResponse!.startDate = startDate;
        eventMockResponse!.endDate = endDate;

        const users = getContentfulReminderUsersContent();
        users!.role = 'Grantee';
        users!.teamsCollection!.items[0]!.role = 'Project Manager';
        users!.teamsCollection!.items[0]!.team!.sys.id = 'team-2';

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          eventsCollection: {
            items: [eventMockResponse],
          },
          users,
        });

        contentfulGraphqlClientMock.request.mockResolvedValueOnce(
          getTeamProjectManagerResponse(),
        );

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);

        const uploadPresentationReminder = getUploadPresentationReminder();
        uploadPresentationReminder.data.endDate = endDate;

        expect(result.items.map((r) => r.type)).not.toContain(
          'Upload Presentation',
        );
      });

      it('Should not fetch the reminder when the event does not have speakers', async () => {
        const startDate = '2023-01-01T08:00:00Z';
        const endDate = '2023-01-01T10:00:00Z';
        jest.setSystemTime(DateTime.fromISO('2023-01-02T09:00:00Z').toJSDate());

        const eventMockResponse = getContentfulReminderEventsCollectionItem();
        eventMockResponse!.startDate = startDate;
        eventMockResponse!.endDate = endDate;
        eventMockResponse!.speakersCollection!.items = [];

        const users = getContentfulReminderUsersContent();
        users!.role = 'Grantee';
        users!.teamsCollection!.items[0]!.role = 'Project Manager';

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          eventsCollection: {
            items: [eventMockResponse],
          },
          users,
        });

        contentfulGraphqlClientMock.request.mockResolvedValueOnce(
          getTeamProjectManagerResponse(),
        );

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);

        const uploadPresentationReminder = getUploadPresentationReminder();
        uploadPresentationReminder.data.endDate = endDate;

        expect(result.items.map((r) => r.type)).not.toContain(
          'Upload Presentation',
        );
      });

      it('Should not fetch the reminder when event speakersCollection come as null', async () => {
        const startDate = '2023-01-01T08:00:00Z';
        const endDate = '2023-01-01T10:00:00Z';
        jest.setSystemTime(DateTime.fromISO('2023-01-02T09:00:00Z').toJSDate());

        const eventMockResponse = getContentfulReminderEventsCollectionItem();
        eventMockResponse!.startDate = startDate;
        eventMockResponse!.endDate = endDate;
        eventMockResponse!.speakersCollection = null;

        const users = getContentfulReminderUsersContent();
        users!.role = 'Grantee';
        users!.teamsCollection!.items[0]!.role = 'Project Manager';

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          eventsCollection: {
            items: [eventMockResponse],
          },
          users,
        });

        contentfulGraphqlClientMock.request.mockResolvedValueOnce(
          getTeamProjectManagerResponse(),
        );

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);

        const uploadPresentationReminder = getUploadPresentationReminder();
        uploadPresentationReminder.data.endDate = endDate;

        expect(result.items.map((r) => r.type)).not.toContain(
          'Upload Presentation',
        );
      });

      it('Should fetch the reminder up until 72 hours of the end of the event', async () => {
        const startDate = '2023-01-01T08:00:00Z';
        const endDate = '2023-01-01T10:00:00Z';
        jest.setSystemTime(DateTime.fromISO('2023-01-04T09:58:00Z').toJSDate());

        const eventMockResponse = getContentfulReminderEventsCollectionItem();
        eventMockResponse!.startDate = startDate;
        eventMockResponse!.endDate = endDate;

        const users = getContentfulReminderUsersContent();
        users!.role = 'Grantee';
        users!.teamsCollection!.items[0]!.role = 'Project Manager';

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          eventsCollection: {
            items: [eventMockResponse],
          },
          users,
        });

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);

        const uploadPresentationReminder = getUploadPresentationReminder();
        uploadPresentationReminder.data.endDate = endDate;

        expect(result.items.map((r) => r.type)).toContain(
          'Upload Presentation',
        );

        expect(result).toEqual({
          total: 1,
          items: [uploadPresentationReminder],
        });
      });

      it('Should not fetch the reminder when it passed more than 72 hours of the end of the event', async () => {
        const startDate = '2023-01-01T08:00:00Z';
        const endDate = '2023-01-01T10:00:00Z';
        jest.setSystemTime(DateTime.fromISO('2023-01-04T10:01:00Z').toJSDate());

        const eventMockResponse = getContentfulReminderEventsCollectionItem();
        eventMockResponse!.startDate = startDate;
        eventMockResponse!.endDate = endDate;

        const users = getContentfulReminderUsersContent();
        users!.role = 'Grantee';
        users!.teamsCollection!.items[0]!.role = 'Project Manager';

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          eventsCollection: {
            items: [eventMockResponse],
          },
          users,
        });

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);

        const uploadPresentationReminder = getUploadPresentationReminder();
        uploadPresentationReminder.data.endDate = endDate;

        expect(result.items.map((r) => r.type)).not.toContain(
          'Upload Presentation',
        );
      });

      it('Should not fetch the reminder when the event is a future event', async () => {
        const startDate = '2023-01-01T08:00:00Z';
        const endDate = '2023-01-01T10:00:00Z';
        jest.setSystemTime(DateTime.fromISO('2022-12-31T10:00:00Z').toJSDate());

        const eventMockResponse = getContentfulReminderEventsCollectionItem();
        eventMockResponse!.startDate = startDate;
        eventMockResponse!.endDate = endDate;

        const users = getContentfulReminderUsersContent();
        users!.role = 'Grantee';
        users!.teamsCollection!.items[0]!.role = 'Project Manager';

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          eventsCollection: {
            items: [eventMockResponse],
          },
          users,
        });

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);

        const uploadPresentationReminder = getUploadPresentationReminder();
        uploadPresentationReminder.data.endDate = endDate;

        expect(result.items.map((r) => r.type)).not.toContain(
          'Upload Presentation',
        );
      });

      it('Should not fetch the reminder if it has not ended', async () => {
        const startDate = '2023-01-01T08:00:00Z';
        const endDate = '2023-01-01T10:00:00Z';
        jest.setSystemTime(DateTime.fromISO('2023-01-01T09:00:00Z').toJSDate());

        const eventMockResponse = getContentfulReminderEventsCollectionItem();
        eventMockResponse!.startDate = startDate;
        eventMockResponse!.endDate = endDate;

        const users = getContentfulReminderUsersContent();
        users!.role = 'Grantee';
        users!.teamsCollection!.items[0]!.role = 'Project Manager';

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          eventsCollection: {
            items: [eventMockResponse],
          },
          users,
        });

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);

        const uploadPresentationReminder = getUploadPresentationReminder();
        uploadPresentationReminder.data.endDate = endDate;

        expect(result.items.map((r) => r.type)).not.toContain(
          'Upload Presentation',
        );
      });
    });

    interface MaterialTestProps {
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
      }: MaterialTestProps) => {
        test(`Should fetch the reminder if a ${material} was updated in an event between now and 24 hours ago`, async () => {
          const materialUpdatedAt = '2023-01-01T08:00:00Z';
          jest.setSystemTime(
            DateTime.fromISO('2023-01-02T07:59:00Z').toJSDate(),
          );

          const eventMockResponse = getContentfulReminderEventsCollectionItem();
          eventMockResponse![materialUpdatedAtName] = materialUpdatedAt;

          const users = getContentfulReminderUsersContent();

          contentfulGraphqlClientMock.request.mockResolvedValueOnce({
            eventsCollection: {
              items: [eventMockResponse],
            },
            users,
          });

          const result = await remindersDataProvider.fetch(
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
          const materialUpdatedAt = '2023-01-01T08:00:00Z';
          jest.setSystemTime(
            DateTime.fromISO('2023-01-02T08:10:00Z').toJSDate(),
          );

          const eventMockResponse = getContentfulReminderEventsCollectionItem();
          eventMockResponse![materialUpdatedAtName] = materialUpdatedAt;

          const users = getContentfulReminderUsersContent();

          contentfulGraphqlClientMock.request.mockResolvedValueOnce({
            eventsCollection: {
              items: [eventMockResponse],
            },
            users,
          });

          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );

          expect(result).toEqual({
            total: 0,
            items: [],
          });
        });

        test(`Should not fetch the reminder if a ${material} in an event was updated after the current time`, async () => {
          const materialUpdatedAt = '2023-01-01T08:00:00Z';
          jest.setSystemTime(
            DateTime.fromISO('2023-01-01T07:00:00Z').toJSDate(),
          );

          const eventMockResponse = getContentfulReminderEventsCollectionItem();
          eventMockResponse![materialUpdatedAtName] = materialUpdatedAt;

          const users = getContentfulReminderUsersContent();

          contentfulGraphqlClientMock.request.mockResolvedValueOnce({
            eventsCollection: {
              items: [eventMockResponse],
            },
            users,
          });

          const result = await remindersDataProvider.fetch(
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
      test(`Should fetch the reminders if more than one material was updated in an event between now and 24 hours ago`, async () => {
        const materialUpdatedAt = '2023-01-01T08:00:00Z';
        jest.setSystemTime(DateTime.fromISO('2023-01-02T07:59:00Z').toJSDate());

        const eventMockResponse = getContentfulReminderEventsCollectionItem();
        eventMockResponse!.videoRecordingUpdatedAt = materialUpdatedAt;
        eventMockResponse!.presentationUpdatedAt = materialUpdatedAt;
        eventMockResponse!.notesUpdatedAt = materialUpdatedAt;

        const users = getContentfulReminderUsersContent();

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          eventsCollection: {
            items: [eventMockResponse],
          },
          users,
        });

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);

        const videoEventUpdatedReminder = getVideoEventUpdatedReminder();
        videoEventUpdatedReminder.data.videoRecordingUpdatedAt =
          materialUpdatedAt;

        const presentationUpdatedReminder = getPresentationUpdatedReminder();
        presentationUpdatedReminder.data.presentationUpdatedAt =
          materialUpdatedAt;

        const notesEventUpdatedReminder = getNotesUpdatedReminder();
        notesEventUpdatedReminder.data.notesUpdatedAt = materialUpdatedAt;

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
      test('Should sort the reminders by the date they are referring to, in a descending order', async () => {
        jest.setSystemTime(new Date('2022-01-01T09:00:00Z'));

        const event1 = getContentfulReminderEventsCollectionItem();
        event1!.sys.id = 'event-1';
        // using event start-date for sorting
        event1!.startDate = '2022-01-01T12:00:00Z';
        event1!.endDate = '2022-01-01T13:00:00Z';
        event1!.presentationUpdatedAt = '2022-01-01T08:04:00Z';

        const event2 = getContentfulReminderEventsCollectionItem();
        event2!.sys.id = 'event-2';
        event2!.startDate = '2022-01-01T08:00:00Z';
        // using event end-date for sorting
        event2!.endDate = '2022-01-01T10:00:00Z';
        event2!.videoRecordingUpdatedAt = '2022-01-01T08:02:00Z';

        const event3 = getContentfulReminderEventsCollectionItem();
        event3!.sys.id = 'event-3';
        event3!.startDate = '2022-01-01T06:00:00Z';
        event3!.endDate = '2022-01-01T07:00:00Z';
        event1!.notesUpdatedAt = '2022-01-01T08:00:00Z';

        const users = getContentfulReminderUsersContent();
        users!.role = 'Grantee';
        users!.teamsCollection!.items[0]!.role = 'Project Manager';

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          eventsCollection: {
            items: [event1, event2, event3],
          },
          users,
        });

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);

        const reminderIds = result.items.map((reminder) => reminder.id);

        expect(reminderIds).toEqual([
          'event-happening-today-event-1',
          'event-happening-now-event-2',
          'presentation-event-updated-event-1',
          'video-event-updated-event-2',
          'notes-event-updated-event-1',
          'upload-presentation-event-3',
        ]);
      });
    });
  });

  describe('Fetch-by-id', () => {
    test('should throw an error', async () => {
      await expect(remindersDataProvider.fetchById()).rejects.toThrow(
        'Method not implemented.',
      );
    });
  });
});
