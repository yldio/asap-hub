import {
  FetchRemindersQuery,
  getContentfulGraphqlClientMockServer,
} from '@asap-hub/contentful';
import {
  EventNotesReminder,
  FetchRemindersOptions,
  PresentationUpdatedReminder,
  VideoEventReminder,
} from '@asap-hub/model';
import { DateTime } from 'luxon';

import { ReminderContentfulDataProvider } from '../../../src/data-providers/contentful/reminder.data-provider';
import { getContentfulGraphqlClientMock } from '../../mocks/contentful-graphql-client.mock';
import { getContentfulGraphqlEvent } from '../../fixtures/events.fixtures';
import {
  getContentfulReminderEventsCollectionItem,
  getContentfulReminderResearchOutputCollectionItem,
  getContentfulReminderResearchOutputVersionCollectionItem,
  getContentfulReminderUsersContent,
  getEventHappeningNowReminder,
  getEventHappeningTodayReminder,
  getNotesUpdatedReminder,
  getPresentationUpdatedReminder,
  getPublishMaterialReminder,
  getResearchOutputDraftTeamReminder,
  getResearchOutputInReviewTeamReminder,
  getResearchOutputPublishedReminder,
  getResearchOutputSwitchToDraftTeamReminder,
  getResearchOutputSwitchToDraftWorkingGroupReminder,
  getResearchOutputVersionPublishedReminder,
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

    describe('Research Output', () => {
      type ResearchOutputItem = NonNullable<
        FetchRemindersQuery['researchOutputsCollection']
      >['items'][number];
      let publishedResearchOutputItem: ResearchOutputItem;
      let draftResearchOutputsItem: ResearchOutputItem;
      let inReviewResearchOutputItem: ResearchOutputItem;
      let switchToDraftResearchOutputItem: ResearchOutputItem;

      const addedDate = '2023-01-01T08:00:00Z';
      const createdDate = '2023-01-01T08:00:00Z';
      const statusChangedAt = '2021-05-21T13:18:31Z';

      const setNowToLast24Hours = (date: string) => {
        jest.setSystemTime(
          DateTime.fromISO(date).plus({ hours: 2 }).toJSDate(),
        );
      };

      const setContentfulMock = (
        researchOutputsCollection: FetchRemindersQuery['researchOutputsCollection'],
        users?: FetchRemindersQuery['users'],
      ) => {
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          researchOutputsCollection,
          users:
            users === undefined ? getContentfulReminderUsersContent() : users,
        });
      };

      beforeEach(() => {
        publishedResearchOutputItem =
          getContentfulReminderResearchOutputCollectionItem();
        publishedResearchOutputItem!.sys.publishedAt = addedDate;
        publishedResearchOutputItem!.addedDate = addedDate;

        draftResearchOutputsItem =
          getContentfulReminderResearchOutputCollectionItem();
        draftResearchOutputsItem!.createdDate = createdDate;
        draftResearchOutputsItem!.sys.publishedAt = null;
        draftResearchOutputsItem!.addedDate = null;
        draftResearchOutputsItem!.statusChangedBy = null;

        inReviewResearchOutputItem =
          getContentfulReminderResearchOutputCollectionItem();
        inReviewResearchOutputItem!.sys.publishedAt = null;
        inReviewResearchOutputItem!.addedDate = null;
        inReviewResearchOutputItem!.isInReview = true;
        inReviewResearchOutputItem!.statusChangedBy = {
          sys: {
            id: 'user-1',
          },
          firstName: 'Tom',
          lastName: 'Hardy',
        };

        switchToDraftResearchOutputItem =
          getContentfulReminderResearchOutputCollectionItem();
        switchToDraftResearchOutputItem!.sys.publishedAt = null;
        switchToDraftResearchOutputItem!.addedDate = null;
        switchToDraftResearchOutputItem!.isInReview = false;
        switchToDraftResearchOutputItem!.statusChangedBy = {
          sys: {
            id: 'user-1',
          },
          firstName: 'Tom',
          lastName: 'Hardy',
        };
        switchToDraftResearchOutputItem!.statusChangedAt = statusChangedAt;
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      describe('Shared tests', () => {
        beforeEach(() => {
          setNowToLast24Hours(addedDate);
        });

        test('Should fetch and sort appropriately all types of Research Output reminders when conditions are met', async () => {
          publishedResearchOutputItem!.addedDate = '2023-01-01T08:00:00Z';
          draftResearchOutputsItem!.createdDate = '2023-01-01T08:01:00Z';
          inReviewResearchOutputItem!.createdDate = '2023-01-01T08:02:00Z';

          const researchOutputsCollection = {
            items: [
              publishedResearchOutputItem,
              draftResearchOutputsItem,
              inReviewResearchOutputItem,
            ],
          };
          const usersResponse = getContentfulReminderUsersContent();
          usersResponse!.role = 'Staff';
          setContentfulMock(researchOutputsCollection, usersResponse);

          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );
          expect(result).toEqual({
            items: [
              expect.objectContaining({
                entity: 'Research Output',
                type: 'In Review',
              }),
              expect.objectContaining({
                entity: 'Research Output',
                type: 'Draft',
              }),
              expect.objectContaining({
                entity: 'Research Output',
                type: 'Published',
              }),
            ],
            total: 3,
          });
        });

        test('Should not fetch the reminders if user data is null', async () => {
          const researchOutputsCollection = {
            items: [
              publishedResearchOutputItem,
              draftResearchOutputsItem,
              inReviewResearchOutputItem,
            ],
          };
          const usersResponse = null;
          setContentfulMock(researchOutputsCollection, usersResponse);

          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );
          expect(result).toEqual({ items: [], total: 0 });
        });

        test('Should not fetch the reminders if user does not belong to a team', async () => {
          const researchOutputsCollection = {
            items: [
              publishedResearchOutputItem,
              draftResearchOutputsItem,
              inReviewResearchOutputItem,
            ],
          };
          const usersResponse = getContentfulReminderUsersContent();
          usersResponse!.role = 'Staff';
          usersResponse!.teamsCollection = null;
          setContentfulMock(researchOutputsCollection, usersResponse);

          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );
          expect(result).toEqual({ items: [], total: 0 });
        });

        test("Should not fetch the published reminder if there isn't any research outputs", async () => {
          const researchOutputsCollection = { items: [] };
          const usersResponse = getContentfulReminderUsersContent();
          usersResponse!.role = 'Staff';
          setContentfulMock(researchOutputsCollection, usersResponse);

          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );
          expect(result).toEqual({ items: [], total: 0 });
        });

        test("Should not fetch the reminders if the research output doesn't have a title", async () => {
          publishedResearchOutputItem!.title = null;
          draftResearchOutputsItem!.title = null;
          inReviewResearchOutputItem!.title = null;
          const researchOutputsCollection = {
            items: [
              publishedResearchOutputItem,
              draftResearchOutputsItem,
              inReviewResearchOutputItem,
            ],
          };
          const usersResponse = getContentfulReminderUsersContent();
          usersResponse!.role = 'Staff';
          setContentfulMock(researchOutputsCollection, usersResponse);

          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );
          expect(result).toEqual({ items: [], total: 0 });
        });

        test("Should not fetch the reminders if the research output doesn't have a documentType", async () => {
          publishedResearchOutputItem!.documentType = null;
          draftResearchOutputsItem!.documentType = null;
          inReviewResearchOutputItem!.documentType = null;
          const researchOutputsCollection = {
            items: [
              publishedResearchOutputItem,
              draftResearchOutputsItem,
              inReviewResearchOutputItem,
            ],
          };
          const usersResponse = getContentfulReminderUsersContent();
          usersResponse!.role = 'Staff';
          setContentfulMock(researchOutputsCollection, usersResponse);

          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );
          expect(result).toEqual({ items: [], total: 0 });
        });

        test('Should not fetch the reminder if the research output documentType property is not a valid documentType', async () => {
          publishedResearchOutputItem!.documentType = 'invalid-document-type';
          draftResearchOutputsItem!.documentType = 'invalid-document-type';
          inReviewResearchOutputItem!.documentType = 'invalid-document-type';
          const researchOutputsCollection = {
            items: [
              publishedResearchOutputItem,
              draftResearchOutputsItem,
              inReviewResearchOutputItem,
            ],
          };
          const usersResponse = getContentfulReminderUsersContent();
          usersResponse!.role = 'Staff';
          setContentfulMock(researchOutputsCollection, usersResponse);

          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );
          expect(result).toEqual({ items: [], total: 0 });
        });

        test('Should not fetch the reminder if associated team name is null', async () => {
          publishedResearchOutputItem!.teamsCollection!.items[0]!.displayName =
            null;
          draftResearchOutputsItem!.teamsCollection!.items[0]!.displayName =
            null;
          inReviewResearchOutputItem!.teamsCollection!.items[0]!.displayName =
            null;
          publishedResearchOutputItem!.workingGroup = null;
          draftResearchOutputsItem!.workingGroup = null;
          inReviewResearchOutputItem!.workingGroup = null;
          const researchOutputsCollection = {
            items: [
              publishedResearchOutputItem,
              draftResearchOutputsItem,
              inReviewResearchOutputItem,
            ],
          };
          const usersResponse = getContentfulReminderUsersContent();
          usersResponse!.role = 'Staff';
          setContentfulMock(researchOutputsCollection, usersResponse);

          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );
          expect(result).toEqual({ items: [], total: 0 });
        });

        test('Should not fetch the reminder if associated working group name is null', async () => {
          publishedResearchOutputItem!.teamsCollection!.items = [];
          draftResearchOutputsItem!.teamsCollection!.items = [];
          inReviewResearchOutputItem!.teamsCollection!.items = [];

          publishedResearchOutputItem!.workingGroup!.title = null;
          draftResearchOutputsItem!.workingGroup!.title = null;
          inReviewResearchOutputItem!.workingGroup!.title = null;
          const researchOutputsCollection = {
            items: [
              publishedResearchOutputItem,
              draftResearchOutputsItem,
              inReviewResearchOutputItem,
            ],
          };
          const usersResponse = getContentfulReminderUsersContent();
          usersResponse!.role = 'Staff';
          setContentfulMock(researchOutputsCollection, usersResponse);

          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );
          expect(result).toEqual({ items: [], total: 0 });
        });

        test('Should not fetch the reminder if user who (published | created a draft | requested review) is null', async () => {
          publishedResearchOutputItem!.createdBy = null;
          draftResearchOutputsItem!.createdBy = null;
          inReviewResearchOutputItem!.statusChangedBy = null;

          const researchOutputsCollection = {
            items: [
              publishedResearchOutputItem,
              draftResearchOutputsItem,
              inReviewResearchOutputItem,
            ],
          };
          const usersResponse = getContentfulReminderUsersContent();
          usersResponse!.role = 'Staff';
          setContentfulMock(researchOutputsCollection, usersResponse);

          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );
          expect(result).toEqual({ items: [], total: 0 });
        });
      });

      describe('Published Reminder', () => {
        beforeEach(() => {
          setNowToLast24Hours(addedDate);
        });

        test('Should fetch the published reminder if user is part of a team associated with the research output', async () => {
          publishedResearchOutputItem!.workingGroup = null;
          const researchOutputsCollection = {
            items: [publishedResearchOutputItem],
          };

          setContentfulMock(researchOutputsCollection);
          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );

          const expectedReminder = getResearchOutputPublishedReminder();
          expectedReminder.data.addedDate = addedDate;

          expect(result.items.map((r) => r.type)).toContain('Published');
          expect(result).toEqual({
            total: 1,
            items: [expectedReminder],
          });
        });

        test('Should fetch the published reminder if user is part of the working group associated with the research output', async () => {
          const researchOutputsCollection = {
            items: [publishedResearchOutputItem],
          };

          setContentfulMock(researchOutputsCollection);

          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );

          const expectedReminder = getResearchOutputPublishedReminder();
          expectedReminder.data.addedDate = addedDate;
          expectedReminder.data.associationName = 'Working Group 1';
          expectedReminder.data.associationType = 'working group';

          expect(result.items.map((r) => r.type)).toContain('Published');
          expect(result).toEqual({
            total: 1,
            items: [expectedReminder],
          });
        });

        test('Should not fetch the published reminder of research output associated with working group if user is not part of any working group', async () => {
          const researchOutputsCollection = {
            items: [publishedResearchOutputItem],
          };

          const usersResponse = getContentfulReminderUsersContent();
          usersResponse!.linkedFrom!.workingGroupMembersCollection = null;
          usersResponse!.linkedFrom!.workingGroupLeadersCollection = null;

          setContentfulMock(researchOutputsCollection, usersResponse);

          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );

          expect(result.items.map((r) => r.type)).not.toContain('Published');
        });

        test('Should not fetch the published reminder if the user is not associated with any team or working group from the research output', async () => {
          publishedResearchOutputItem!.teamsCollection!.items = [
            {
              sys: {
                id: 'team-user-is-not-part-of',
              },
              displayName: 'Team that user is not part of',
            },
          ];
          publishedResearchOutputItem!.workingGroup = {
            sys: {
              id: 'wg-user-is-not-part-of',
            },
            title: 'Working Group that user is not part of',
          };
          const researchOutputsCollection = {
            items: [publishedResearchOutputItem],
          };
          setContentfulMock(researchOutputsCollection);

          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );
          expect(result.items.map((r) => r.type)).not.toContain('Published');
        });

        test('Should not fetch the published reminder if it has passed more than 24 hours from the addedDate', async () => {
          jest.setSystemTime(
            DateTime.fromISO(addedDate).plus({ hours: 25 }).toJSDate(),
          );

          const researchOutputsCollection = {
            items: [publishedResearchOutputItem],
          };

          setContentfulMock(researchOutputsCollection);
          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );
          expect(result.items.map((r) => r.type)).not.toContain('Published');
        });

        test('Should not fetch the published reminder if research output is a draft', async () => {
          publishedResearchOutputItem!.sys.publishedAt = null; // draft output
          const researchOutputsCollection = {
            items: [publishedResearchOutputItem],
          };

          setContentfulMock(researchOutputsCollection);
          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );
          expect(result.items.map((r) => r.type)).not.toContain('Published');
        });
      });

      describe('Draft Reminder', () => {
        beforeEach(() => {
          setNowToLast24Hours(createdDate);
        });

        test('Should fetch the draft reminder if user is not a Staff but is part of a team associated with the research output', async () => {
          draftResearchOutputsItem!.workingGroup = null;
          const researchOutputsCollection = {
            items: [draftResearchOutputsItem],
          };

          setContentfulMock(researchOutputsCollection);
          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );

          const expectedReminder = getResearchOutputDraftTeamReminder();
          expectedReminder.data.createdDate = createdDate;

          expect(result.items.map((r) => r.type)).toContain('Draft');
          expect(result).toEqual({
            total: 1,
            items: [expectedReminder],
          });
        });

        test('Should fetch the draft reminder if user is not a Staff but is part of the working group associated with the research output', async () => {
          const researchOutputsCollection = {
            items: [draftResearchOutputsItem],
          };

          setContentfulMock(researchOutputsCollection);
          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );

          const expectedReminder = getResearchOutputDraftTeamReminder();
          expectedReminder.data.createdDate = createdDate;
          expectedReminder.data.associationName = 'Working Group 1';
          expectedReminder.data.associationType = 'working group';

          expect(result.items.map((r) => r.type)).toContain('Draft');
          expect(result).toEqual({
            total: 1,
            items: [expectedReminder],
          });
        });

        test('Should not fetch the draft reminder if the user is not a Staff and is not associated with any team or working group from the research output', async () => {
          draftResearchOutputsItem!.teamsCollection!.items = [
            {
              sys: {
                id: 'team-user-is-not-part-of',
              },
              displayName: 'Team that user is not part of',
            },
          ];
          draftResearchOutputsItem!.workingGroup = {
            sys: {
              id: 'wg-user-is-not-part-of',
            },
            title: 'Working Group that user is not part of',
          };
          const researchOutputsCollection = {
            items: [draftResearchOutputsItem],
          };

          setContentfulMock(researchOutputsCollection);
          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );

          expect(result.items.map((r) => r.type)).not.toContain('Draft');
        });

        test('Should fetch the draft reminder if the user is a Staff even if is not associated with any team or working group from the research output', async () => {
          draftResearchOutputsItem!.teamsCollection!.items = [
            {
              sys: {
                id: 'team-user-is-not-part-of',
              },
              displayName: 'Team that user is not part of',
            },
          ];
          draftResearchOutputsItem!.workingGroup = {
            sys: {
              id: 'wg-user-is-not-part-of',
            },
            title: 'Working Group that user is not part of',
          };
          const usersResponse = getContentfulReminderUsersContent();
          usersResponse!.role = 'Staff';

          const researchOutputsCollection = {
            items: [draftResearchOutputsItem],
          };

          setContentfulMock(researchOutputsCollection, usersResponse);
          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );

          expect(result.items.map((r) => r.type)).toContain('Draft');
        });

        test('Should not fetch the draft reminder if it has passed more than 24 hours from the createdDate', async () => {
          jest.setSystemTime(
            DateTime.fromISO(createdDate).plus({ hours: 25 }).toJSDate(),
          );
          const researchOutputsCollection = {
            items: [draftResearchOutputsItem],
          };

          setContentfulMock(researchOutputsCollection);
          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );
          expect(result.items.map((r) => r.type)).not.toContain('Draft');
        });

        test('Should not fetch the draft reminder if research output is published', async () => {
          draftResearchOutputsItem!.sys.publishedAt = createdDate;
          const researchOutputsCollection = {
            items: [draftResearchOutputsItem],
          };

          setContentfulMock(researchOutputsCollection);
          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );
          expect(result.items.map((r) => r.type)).not.toContain('Draft');
        });

        test('Should return no reminder when the statusChangedBy attribute is populated', async () => {
          draftResearchOutputsItem!.statusChangedBy = {
            sys: {
              id: 'user-1',
            },
            firstName: 'Tom',
            lastName: 'Hardy',
          };

          const researchOutputsCollection = {
            items: [draftResearchOutputsItem],
          };

          setContentfulMock(researchOutputsCollection);
          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );

          expect(result.items.map((r) => r.type)).not.toContain('Draft');
        });
      });

      describe('Switch to Draft Reminder', () => {
        beforeEach(() => {
          setNowToLast24Hours(statusChangedAt);
        });

        test('Should fetch the switch to draft reminder if user is not Staff but is part of a team associated with the research output', async () => {
          switchToDraftResearchOutputItem!.workingGroup = null;
          const researchOutputsCollection = {
            items: [switchToDraftResearchOutputItem],
          };

          setContentfulMock(researchOutputsCollection);
          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );

          const expectedReminder = getResearchOutputSwitchToDraftTeamReminder();

          expect(result.items.map((r) => r.type)).toContain('Switch To Draft');

          expect(result).toEqual({
            total: 1,
            items: [expectedReminder],
          });
        });

        test('Should fetch the switch to draft reminder if user is not Staff but is part of the working group associated with the research output', async () => {
          const researchOutputsCollection = {
            items: [switchToDraftResearchOutputItem],
          };

          setContentfulMock(researchOutputsCollection);
          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );

          const expectedReminder =
            getResearchOutputSwitchToDraftWorkingGroupReminder();

          expect(result.items.map((r) => r.type)).toContain('Switch To Draft');
          expect(result).toEqual({
            total: 1,
            items: [expectedReminder],
          });
        });

        test('Should not fetch the switch to draft reminder if the user is not a Staff and is not associated with any team or working group from the research output', async () => {
          switchToDraftResearchOutputItem!.teamsCollection!.items = [
            {
              sys: {
                id: 'team-user-is-not-part-of',
              },
              displayName: 'Team that user is not part of',
            },
          ];
          switchToDraftResearchOutputItem!.workingGroup = {
            sys: {
              id: 'wg-user-is-not-part-of',
            },
            title: 'Working Group that user is not part of',
          };
          const researchOutputsCollection = {
            items: [switchToDraftResearchOutputItem],
          };

          setContentfulMock(researchOutputsCollection);
          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );

          expect(result.items.map((r) => r.type)).not.toContain(
            'Switch To Draft',
          );
        });

        test('Should fetch the switch to draft reminder if the user is a Staff even if is not associated with any team or working group from the research output', async () => {
          switchToDraftResearchOutputItem!.teamsCollection!.items = [
            {
              sys: {
                id: 'team-user-is-not-part-of',
              },
              displayName: 'Team that user is not part of',
            },
          ];
          switchToDraftResearchOutputItem!.workingGroup = {
            sys: {
              id: 'wg-user-is-not-part-of',
            },
            title: 'Working Group that user is not part of',
          };
          const usersResponse = getContentfulReminderUsersContent();
          usersResponse!.role = 'Staff';

          const researchOutputsCollection = {
            items: [switchToDraftResearchOutputItem],
          };

          setContentfulMock(researchOutputsCollection, usersResponse);
          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );

          expect(result.items.map((r) => r.type)).toContain('Switch To Draft');
        });

        test('Should not fetch the switch to draft reminder if it has passed more than 24 hours from the statusChangedAt', async () => {
          jest.setSystemTime(
            DateTime.fromISO(statusChangedAt).plus({ hours: 25 }).toJSDate(),
          );
          const researchOutputsCollection = {
            items: [switchToDraftResearchOutputItem],
          };

          setContentfulMock(researchOutputsCollection);
          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );
          expect(result.items.map((r) => r.type)).not.toContain(
            'Switch To Draft',
          );
        });

        test('Should not fetch the draft reminder if research output is published', async () => {
          switchToDraftResearchOutputItem!.sys.publishedAt = createdDate;
          const researchOutputsCollection = {
            items: [switchToDraftResearchOutputItem],
          };

          setContentfulMock(researchOutputsCollection);
          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );
          expect(result.items.map((r) => r.type)).not.toContain(
            'Switch To Draft',
          );
        });
      });

      describe('In Review Reminder', () => {
        test('Should fetch the reminder if user is not a Staff but is a PM of a team associated with the research output', async () => {
          inReviewResearchOutputItem!.workingGroup = null;
          const researchOutputsCollection = {
            items: [inReviewResearchOutputItem],
          };
          const usersResponse = getContentfulReminderUsersContent();
          usersResponse!.teamsCollection!.items = [
            {
              role: 'Project Manager',
              team: {
                sys: {
                  id: 'team-1',
                },
              },
            },
          ];

          setContentfulMock(researchOutputsCollection, usersResponse);
          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );

          const expectedReminder = getResearchOutputInReviewTeamReminder();

          expect(result.items.map((r) => r.type)).toContain('In Review');
          expect(result).toEqual({
            total: 1,
            items: [expectedReminder],
          });
        });

        test('Should fetch the reminder if user is a Staff even if is not a PM of a team associated with the research output', async () => {
          inReviewResearchOutputItem!.workingGroup = null;
          const researchOutputsCollection = {
            items: [inReviewResearchOutputItem],
          };
          const usersResponse = getContentfulReminderUsersContent();
          usersResponse!.role = 'Staff';
          usersResponse!.teamsCollection!.items = [
            {
              role: 'Collaborating PI',
              team: {
                sys: {
                  id: 'team-1',
                },
              },
            },
          ];

          setContentfulMock(researchOutputsCollection, usersResponse);
          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );

          const expectedReminder = getResearchOutputInReviewTeamReminder();

          expect(result.items.map((r) => r.type)).toContain('In Review');
          expect(result).toEqual({
            total: 1,
            items: [expectedReminder],
          });
        });

        test('Should fetch the reminder if user is not a Staff but is a PM of the working group associated with the research output', async () => {
          const researchOutputsCollection = {
            items: [inReviewResearchOutputItem],
          };
          const usersResponse = getContentfulReminderUsersContent();
          usersResponse!.linkedFrom!.workingGroupLeadersCollection!.items = [
            {
              role: 'Project Manager',
              linkedFrom: {
                workingGroupsCollection: {
                  items: [
                    {
                      sys: {
                        id: 'wg-id-1',
                      },
                      title: 'Working Group 1',
                    },
                  ],
                },
              },
            },
          ];
          setContentfulMock(researchOutputsCollection, usersResponse);
          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );

          const expectedReminder = getResearchOutputInReviewTeamReminder();
          expectedReminder.data.associationName = 'Working Group 1';
          expectedReminder.data.associationType = 'working group';

          expect(result.items.map((r) => r.type)).toContain('In Review');
          expect(result).toEqual({
            total: 1,
            items: [expectedReminder],
          });
        });

        test('Should fetch the reminder if user is a Staff even if is not a PM of the working group associated with the research output', async () => {
          inReviewResearchOutputItem!.workingGroup = null;
          const researchOutputsCollection = {
            items: [inReviewResearchOutputItem],
          };
          const usersResponse = getContentfulReminderUsersContent();
          usersResponse!.role = 'Staff';
          usersResponse!.linkedFrom!.workingGroupLeadersCollection!.items = [
            {
              role: 'Chair',
              linkedFrom: {
                workingGroupsCollection: {
                  items: [
                    {
                      sys: {
                        id: 'wg-id-1',
                      },
                      title: 'Working Group 1',
                    },
                  ],
                },
              },
            },
          ];
          setContentfulMock(researchOutputsCollection, usersResponse);
          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );

          const expectedReminder = getResearchOutputInReviewTeamReminder();

          expect(result.items.map((r) => r.type)).toContain('In Review');
          expect(result).toEqual({
            total: 1,
            items: [expectedReminder],
          });
        });

        test('Should not fetch the reminder if user is not a Staff and is not a PM of a team associated with the research output', async () => {
          inReviewResearchOutputItem!.workingGroup = null;
          const researchOutputsCollection = {
            items: [inReviewResearchOutputItem],
          };
          const usersResponse = getContentfulReminderUsersContent();
          usersResponse!.teamsCollection!.items = [
            {
              role: 'Collaborating PI',
              team: {
                sys: {
                  id: 'team-1',
                },
              },
            },
          ];

          setContentfulMock(researchOutputsCollection, usersResponse);
          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );

          expect(result.items.map((r) => r.type)).not.toContain('In Review');
        });

        test('Should not fetch the reminder of research output associated to working group if user is not a Staff and is not a leader of any working group', async () => {
          const researchOutputsCollection = {
            items: [inReviewResearchOutputItem],
          };
          const usersResponse = getContentfulReminderUsersContent();
          usersResponse!.linkedFrom!.workingGroupLeadersCollection = null;
          setContentfulMock(researchOutputsCollection, usersResponse);
          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );

          expect(result.items.map((r) => r.type)).not.toContain('In Review');
        });

        test('Should not fetch the reminder if user is not a Staff but and is not a PM of the working group associated with the research output', async () => {
          const researchOutputsCollection = {
            items: [inReviewResearchOutputItem],
          };
          const usersResponse = getContentfulReminderUsersContent();
          usersResponse!.linkedFrom!.workingGroupLeadersCollection!.items = [
            {
              role: 'Chair',
              linkedFrom: {
                workingGroupsCollection: {
                  items: [
                    {
                      sys: {
                        id: 'wg-id-1',
                      },
                      title: 'Working Group 1',
                    },
                  ],
                },
              },
            },
          ];
          setContentfulMock(researchOutputsCollection, usersResponse);
          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );

          expect(result.items.map((r) => r.type)).not.toContain('In Review');
        });

        test('Should not fetch the reminder if research output is published', async () => {
          inReviewResearchOutputItem!.sys.publishedAt = new Date();
          const researchOutputsCollection = {
            items: [inReviewResearchOutputItem],
          };
          const usersResponse = getContentfulReminderUsersContent();
          usersResponse!.role = 'Staff';

          setContentfulMock(researchOutputsCollection, usersResponse);
          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );

          expect(result.items.map((r) => r.type)).not.toContain('In Review');
        });
      });
    });

    describe('Research Output Versions', () => {
      type ResearchOutputVersionItem = NonNullable<
        FetchRemindersQuery['researchOutputVersionsCollection']
      >['items'][number];

      let researchOutputVersionItem: ResearchOutputVersionItem;

      const publishedAt = '2023-01-01T08:00:00Z';

      const setNowToLast24Hours = (date: string) => {
        jest.setSystemTime(
          DateTime.fromISO(date).plus({ hours: 2 }).toJSDate(),
        );
      };

      const setContentfulMock = ({
        researchOutputVersionsCollection,
        researchOutputsCollection,
        users,
      }: {
        researchOutputVersionsCollection: FetchRemindersQuery['researchOutputVersionsCollection'];
        researchOutputsCollection?: FetchRemindersQuery['researchOutputsCollection'];
        users?: FetchRemindersQuery['users'];
      }) => {
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          researchOutputsCollection:
            researchOutputsCollection === undefined
              ? { items: [] }
              : researchOutputsCollection,
          researchOutputVersionsCollection,
          users:
            users === undefined ? getContentfulReminderUsersContent() : users,
        });
      };

      beforeEach(() => {
        researchOutputVersionItem =
          getContentfulReminderResearchOutputVersionCollectionItem();
        researchOutputVersionItem!.sys.publishedAt = publishedAt;
        setNowToLast24Hours(publishedAt);
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      test('Should fetch and sort appropriately research output version reminders when conditions are met', async () => {
        const version1 = {
          sys: {
            id: 'version-1',
            publishedAt: '2023-01-01T08:00:00Z',
          },
          linkedFrom: {
            researchOutputsCollection: {
              items: [
                {
                  ...researchOutputVersionItem!.linkedFrom!
                    .researchOutputsCollection!.items[0],
                  sys: {
                    id: 'research-output-1',
                  },
                },
              ],
            },
          },
        };
        const version2 = {
          sys: {
            id: 'version-2',
            publishedAt: '2023-01-01T09:00:00Z',
          },
          linkedFrom: {
            researchOutputsCollection: {
              items: [
                {
                  ...researchOutputVersionItem!.linkedFrom!
                    .researchOutputsCollection!.items[0],
                  sys: {
                    id: 'research-output-2',
                  },
                },
              ],
            },
          },
        };
        const version3 = {
          sys: {
            id: 'version-3',
            publishedAt: '2023-01-01T10:00:00Z',
          },
          linkedFrom: {
            researchOutputsCollection: {
              items: [
                {
                  ...researchOutputVersionItem!.linkedFrom!
                    .researchOutputsCollection!.items[0],
                  sys: {
                    id: 'research-output-3',
                  },
                },
              ],
            },
          },
        };

        const researchOutputVersionsCollection = {
          items: [version1, version2, version3],
        };
        const users = getContentfulReminderUsersContent();
        users!.role = 'Staff';
        setContentfulMock({ researchOutputVersionsCollection, users });

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);

        expect(result).toEqual({
          items: [
            expect.objectContaining({
              id: 'research-output-version-published-version-3',
              entity: 'Research Output Version',
              type: 'Published',
            }),
            expect.objectContaining({
              id: 'research-output-version-published-version-2',
              entity: 'Research Output Version',
              type: 'Published',
            }),
            expect.objectContaining({
              id: 'research-output-version-published-version-1',
              entity: 'Research Output Version',
              type: 'Published',
            }),
          ],
          total: 3,
        });
      });

      test('Should not fetch the reminders if user data is null', async () => {
        const researchOutputVersionsCollection = {
          items: [researchOutputVersionItem],
        };
        const users = null;
        setContentfulMock({ researchOutputVersionsCollection, users });

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);
        expect(result).toEqual({ items: [], total: 0 });
      });

      test('Should not fetch the reminders if user does not belong to a team', async () => {
        const researchOutputVersionsCollection = {
          items: [researchOutputVersionItem],
        };
        const users = getContentfulReminderUsersContent();
        users!.role = 'Staff';
        users!.teamsCollection = null;
        setContentfulMock({ researchOutputVersionsCollection, users });

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);
        expect(result).toEqual({ items: [], total: 0 });
      });

      test("Should not fetch the published reminder if there isn't any research output versions", async () => {
        const researchOutputVersionsCollection = { items: [] };
        const users = getContentfulReminderUsersContent();
        users!.role = 'Staff';
        setContentfulMock({ researchOutputVersionsCollection, users });

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);
        expect(result).toEqual({ items: [], total: 0 });
      });

      test("Should not fetch the reminders if the related research output doesn't have a title", async () => {
        researchOutputVersionItem!.linkedFrom!.researchOutputsCollection!.items[0]!.title =
          null;

        const researchOutputVersionsCollection = {
          items: [researchOutputVersionItem],
        };
        const users = getContentfulReminderUsersContent();
        users!.role = 'Staff';
        setContentfulMock({ researchOutputVersionsCollection, users });

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);
        expect(result).toEqual({ items: [], total: 0 });
      });

      test("Should not fetch the reminders if the related research output doesn't have a documentType", async () => {
        researchOutputVersionItem!.linkedFrom!.researchOutputsCollection!.items[0]!.documentType =
          null;

        const researchOutputVersionsCollection = {
          items: [researchOutputVersionItem],
        };
        const users = getContentfulReminderUsersContent();
        users!.role = 'Staff';
        setContentfulMock({ researchOutputVersionsCollection, users });

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);
        expect(result).toEqual({ items: [], total: 0 });
      });

      test('Should not fetch the reminder if the related research output documentType property is not a valid documentType', async () => {
        researchOutputVersionItem!.linkedFrom!.researchOutputsCollection!.items[0]!.documentType =
          'invalid-document-type';

        const researchOutputVersionsCollection = {
          items: [researchOutputVersionItem],
        };
        const users = getContentfulReminderUsersContent();
        users!.role = 'Staff';
        setContentfulMock({ researchOutputVersionsCollection, users });

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);
        expect(result).toEqual({ items: [], total: 0 });
      });

      test('Should not fetch the reminder if associated team name is null', async () => {
        researchOutputVersionItem!.linkedFrom!.researchOutputsCollection!.items[0]!.teamsCollection!.items[0]!.displayName =
          null;
        researchOutputVersionItem!.linkedFrom!.researchOutputsCollection!.items[0]!.workingGroup =
          null;

        const researchOutputVersionsCollection = {
          items: [researchOutputVersionItem],
        };
        const users = getContentfulReminderUsersContent();
        users!.role = 'Staff';
        setContentfulMock({ researchOutputVersionsCollection, users });

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);
        expect(result).toEqual({ items: [], total: 0 });
      });

      test('Should not fetch the reminder if associated working group name is null', async () => {
        researchOutputVersionItem!.linkedFrom!.researchOutputsCollection!.items[0]!.teamsCollection!.items =
          [];
        researchOutputVersionItem!.linkedFrom!.researchOutputsCollection!.items[0]!.workingGroup!.title =
          null;

        const researchOutputVersionsCollection = {
          items: [researchOutputVersionItem],
        };
        const users = getContentfulReminderUsersContent();
        users!.role = 'Staff';
        setContentfulMock({ researchOutputVersionsCollection, users });

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);
        expect(result).toEqual({ items: [], total: 0 });
      });

      test('Should fetch the published reminder if user is part of a team associated with the research output version', async () => {
        researchOutputVersionItem!.linkedFrom!.researchOutputsCollection!.items[0]!.workingGroup =
          null;
        const researchOutputVersionsCollection = {
          items: [researchOutputVersionItem],
        };

        setContentfulMock({ researchOutputVersionsCollection });
        const result = await remindersDataProvider.fetch(fetchRemindersOptions);

        const expectedReminder = getResearchOutputVersionPublishedReminder();
        expectedReminder.data.publishedAt = publishedAt;

        expect(result.items.map((r) => r.type)).toContain('Published');
        expect(result).toEqual({
          total: 1,
          items: [expectedReminder],
        });
      });

      test('Should fetch the published reminder if user is part of the working group associated with the research output version', async () => {
        const researchOutputVersionsCollection = {
          items: [researchOutputVersionItem],
        };

        setContentfulMock({ researchOutputVersionsCollection });

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);

        const expectedReminder = getResearchOutputVersionPublishedReminder();
        expectedReminder.data.publishedAt = publishedAt;
        expectedReminder.data.associationName = 'Working Group 1';
        expectedReminder.data.associationType = 'working group';

        expect(result.items.map((r) => r.type)).toContain('Published');
        expect(result).toEqual({
          total: 1,
          items: [expectedReminder],
        });
      });

      test('Should not fetch the published reminder of research output version associated with working group if user is not part of any working group', async () => {
        const researchOutputVersionsCollection = {
          items: [researchOutputVersionItem],
        };

        const users = getContentfulReminderUsersContent();
        users!.linkedFrom!.workingGroupMembersCollection = null;
        users!.linkedFrom!.workingGroupLeadersCollection = null;

        setContentfulMock({ researchOutputVersionsCollection, users });

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);

        expect(result).toEqual({ total: 0, items: [] });
      });

      test('Should not fetch the published reminder if the user is not associated with any team or working group from the research output version', async () => {
        researchOutputVersionItem!.linkedFrom!.researchOutputsCollection!.items[0]!.teamsCollection!.items =
          [
            {
              sys: {
                id: 'team-user-is-not-part-of',
              },
              displayName: 'Team that user is not part of',
            },
          ];
        researchOutputVersionItem!.linkedFrom!.researchOutputsCollection!.items[0]!.workingGroup =
          {
            sys: {
              id: 'wg-user-is-not-part-of',
            },
            title: 'Working Group that user is not part of',
          };
        const researchOutputVersionsCollection = {
          items: [researchOutputVersionItem],
        };
        setContentfulMock({ researchOutputVersionsCollection });

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);
        expect(result).toEqual({ total: 0, items: [] });
      });

      test('Should not fetch the published reminder if it is has been more than 24 hours sinced it was published', async () => {
        jest.setSystemTime(
          DateTime.fromISO(publishedAt).plus({ hours: 25 }).toJSDate(),
        );

        const researchOutputVersionsCollection = {
          items: [researchOutputVersionItem],
        };

        setContentfulMock({ researchOutputVersionsCollection });
        const result = await remindersDataProvider.fetch(fetchRemindersOptions);
        expect(result).toEqual({ total: 0, items: [] });
      });

      test('Should not return published research output reminder, if there is a related version reminder', async () => {
        const publishedResearchOutputItem =
          getContentfulReminderResearchOutputCollectionItem();
        publishedResearchOutputItem!.sys.publishedAt = publishedAt;
        publishedResearchOutputItem!.addedDate = publishedAt;

        publishedResearchOutputItem!.sys.id =
          researchOutputVersionItem!.linkedFrom!.researchOutputsCollection!.items[0]!.sys.id;

        const researchOutputVersionsCollection = {
          items: [researchOutputVersionItem],
        };

        const researchOutputsCollection = {
          items: [publishedResearchOutputItem],
        };

        setContentfulMock({
          researchOutputVersionsCollection,
          researchOutputsCollection,
        });

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);
        const expectedReminder = getResearchOutputVersionPublishedReminder();

        expectedReminder.data.publishedAt = publishedAt;
        expectedReminder.data.associationName = 'Working Group 1';
        expectedReminder.data.associationType = 'working group';

        expect(result).toEqual({
          total: 1,
          items: [expectedReminder],
        });
      });
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

          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );

          expect(result.items.map((r) => r.type)).not.toContain(
            'Share Presentation',
          );
        },
      );

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

        expect(result.items.map((r) => r.type)).not.toContain(
          'Share Presentation',
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

        expect(result.items.map((r) => r.type)).not.toContain(
          'Share Presentation',
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
      it('Should fetch the reminder if the user asap role is Staff', async () => {
        const startDate = '2023-01-01T08:00:00Z';
        const endDate = '2023-01-01T10:00:00Z';
        jest.setSystemTime(DateTime.fromISO('2023-01-02T09:00:00Z').toJSDate());

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

          const eventMockResponse = getContentfulReminderEventsCollectionItem();
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

          const eventMockResponse = getContentfulReminderEventsCollectionItem();
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

          expect(result.items.map((r) => r.type)).not.toContain(
            expectedMaterialReminder.type,
          );
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

          expect(result.items.map((r) => r.type)).not.toContain(
            expectedMaterialReminder.type,
          );
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
