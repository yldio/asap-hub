import {
  FetchRemindersOptions,
  ManuscriptCreatedReminder,
  ManuscriptResubmittedReminder,
  ManuscriptStatusUpdatedReminder,
} from '@asap-hub/model';
import { DateTime } from 'luxon';

import {
  ReminderContentfulDataProvider,
  ManuscriptItem,
} from '../../../../src/data-providers/contentful/reminder.data-provider';
import { getContentfulGraphqlClientMock } from '../../../mocks/contentful-graphql-client.mock';
import {
  getContentfulReminderUsersContent,
  getContentfulReminderManuscriptCollectionItem,
  getManuscriptResubmittedReminder,
  getManuscriptCreatedReminder,
  getManuscriptStatusUpdatedReminder,
  getManuscriptVersion,
} from '../../../fixtures/reminders.fixtures';
import { FetchRemindersQuery } from '@asap-hub/contentful';

describe('Reminders data provider', () => {
  const contentfulGraphqlClientMock = getContentfulGraphqlClientMock();

  const remindersDataProvider = new ReminderContentfulDataProvider(
    contentfulGraphqlClientMock,
  );

  const team = {
    sys: {
      id: 'reminder-team',
    },
  };

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(async () => {
    jest.setSystemTime(
      DateTime.fromISO(
        getContentfulReminderManuscriptCollectionItem()!.sys.firstPublishedAt,
      )
        .plus({ days: 1 })
        .toJSDate(),
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Fetch manuscript reminders', () => {
    const timezone = 'Europe/London';

    const mockEmptyDiscussionGraphqlResponse = () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        discussionsCollection: {
          items: [],
        },
      });

      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        messagesCollection: {
          items: [],
        },
      });
    };
    const mockContentfulGraphqlResponse = (
      manuscript: ManuscriptItem | null = getContentfulReminderManuscriptCollectionItem(),
      user: FetchRemindersQuery['users'] = getContentfulReminderUsersContent(),
    ) => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        manuscriptsCollection: {
          items: [manuscript],
        },
        users: user,
      });

      mockEmptyDiscussionGraphqlResponse();
    };

    describe('Missing Data', () => {
      const userId = 'first-author-user';
      const fetchRemindersOptions: FetchRemindersOptions = {
        userId,
        timezone,
      };

      const expectEmptyResult = async () => {
        const result = await remindersDataProvider.fetch(fetchRemindersOptions);
        expect(result.items).toEqual([]);
      };

      test('does not return the reminder if returned manuscript is null', async () => {
        mockContentfulGraphqlResponse(null);
        await expectEmptyResult();
      });

      test('does not return the reminder if manuscript team name is null', async () => {
        const manuscript = getContentfulReminderManuscriptCollectionItem();
        manuscript!.teamsCollection!.items[0]!.displayName = null;

        mockContentfulGraphqlResponse(manuscript);
        await expectEmptyResult();
      });

      test('does not return the reminder if manuscript first version is null', async () => {
        const manuscript = getContentfulReminderManuscriptCollectionItem();
        manuscript!.versionsCollection!.items[0] = null;

        mockContentfulGraphqlResponse(manuscript);
        await expectEmptyResult();
      });

      test('does not return the reminder if manuscript created by is null', async () => {
        const manuscript = getContentfulReminderManuscriptCollectionItem();
        manuscript!.versionsCollection!.items[0]!.createdBy = null;

        mockContentfulGraphqlResponse(manuscript);
        await expectEmptyResult();
      });
    });

    describe('Manuscript created', () => {
      const expectedReminder: ManuscriptCreatedReminder =
        getManuscriptCreatedReminder();

      test('the person who created the manuscript should not see manuscript created reminders', async () => {
        const userId = 'user-who-created-manuscript';
        const fetchRemindersOptions: FetchRemindersOptions = {
          userId,
          timezone,
        };

        mockContentfulGraphqlResponse();

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);
        expect(result.items).toEqual([]);
      });

      test.each`
        userId                              | role
        ${'scientific-advisory-board-user'} | ${'Scientific Advisory Board'}
        ${'co-pi-user'}                     | ${'Co-PI (Core Leadership)'}
        ${'key-personnel-user'}             | ${'Key Personnel'}
        ${'trainee-user'}                   | ${'Trainee'}
        ${'asap-staff-user'}                | ${'ASAP Staff'}
      `(
        'the team member with role $role should not see manuscript created reminders',
        async ({ userId, role }) => {
          const user = getContentfulReminderUsersContent();
          user!.teamsCollection = {
            items: [
              {
                role,
                team,
              },
            ],
          };

          contentfulGraphqlClientMock.request.mockResolvedValueOnce({
            manuscriptsCollection: {
              items: [getContentfulReminderManuscriptCollectionItem()],
            },
            users: user,
          });
          mockEmptyDiscussionGraphqlResponse();

          const result = await remindersDataProvider.fetch({
            userId,
            timezone,
          });
          expect(result.items).toEqual([]);
        },
      );

      test('the open science team member should see manuscript created reminders', async () => {
        const userId = 'open-science-team-member-user';

        const user = getContentfulReminderUsersContent();
        user!.role = 'Staff';
        user!.openScienceTeamMember = true;

        mockContentfulGraphqlResponse(
          getContentfulReminderManuscriptCollectionItem(),
          user,
        );

        const result = await remindersDataProvider.fetch({
          userId,
          timezone,
        });
        expect(result.items).toEqual([expectedReminder]);
      });

      test.each`
        userId                    | role
        ${'lead-pi-user'}         | ${'Lead PI (Core Leadership)'}
        ${'project-manager-user'} | ${'Project Manager'}
      `(
        'the team member with role $role should see manuscript created reminders',
        async ({ userId, role }) => {
          const fetchRemindersOptions: FetchRemindersOptions = {
            userId,
            timezone,
          };

          const user = getContentfulReminderUsersContent();
          user!.teamsCollection! = {
            items: [
              {
                role,
                team,
              },
            ],
          };

          mockContentfulGraphqlResponse(
            getContentfulReminderManuscriptCollectionItem(),
            user,
          );

          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );
          expect(result.items).toEqual([expectedReminder]);
        },
      );

      test('first author of the manuscript should see manuscript created reminders', async () => {
        mockContentfulGraphqlResponse();

        const result = await remindersDataProvider.fetch({
          userId: 'first-author-user',
          timezone,
        });
        expect(result.items).toEqual([expectedReminder]);
      });

      test('PIs of the manuscript labs should see manuscript created reminders', async () => {
        const manuscript = getContentfulReminderManuscriptCollectionItem();
        manuscript!.versionsCollection!.items[0]!.labsCollection = {
          items: [
            {
              labPi: {
                sys: {
                  id: 'lab-pi-user',
                },
              },
            },
          ],
        };
        mockContentfulGraphqlResponse(manuscript);

        const result = await remindersDataProvider.fetch({
          userId: 'lab-pi-user',
          timezone,
        });
        expect(result.items).toEqual([expectedReminder]);
      });
    });

    describe('Manuscript resubmitted', () => {
      const manuscriptResubmitted =
        getContentfulReminderManuscriptCollectionItem();
      manuscriptResubmitted!.status = 'Manuscript Resubmitted';
      manuscriptResubmitted!.versionsCollection = {
        total: 2,
        items: [
          getManuscriptVersion({
            count: 1,
            firstAuthorIds: ['first-author-user'],
            additionalAuthorIds: [],
            correspondingAuthorIds: [],
            createdById: 'user-who-created-manuscript',
            createdByFirstName: 'Jane',
            createdByLastName: 'Doe',
            labPI: 'lab-pi-on-manuscript',
          }),
          getManuscriptVersion({
            count: 2,
            firstAuthorIds: ['first-author-user'],
            additionalAuthorIds: ['additional-author-user'],
            correspondingAuthorIds: [],
            createdById: 'user-who-resubmitted-manuscript',
            createdByFirstName: 'John',
            createdByLastName: 'Doe',
            labPI: 'lab-pi-on-manuscript',
          }),
        ],
      };

      const expectedReminder: ManuscriptResubmittedReminder =
        getManuscriptResubmittedReminder();

      test('the person who resubmitted the manuscript should not see manuscript resubmitted reminders', async () => {
        const userId = 'user-who-resubmitted-manuscript';
        const fetchRemindersOptions: FetchRemindersOptions = {
          userId,
          timezone,
        };

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          manuscriptsCollection: {
            items: [manuscriptResubmitted],
          },
          users: getContentfulReminderUsersContent(),
        });

        mockEmptyDiscussionGraphqlResponse();

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);
        expect(result.items).toEqual([]);
      });

      test.each`
        userId                    | role
        ${'project-manager-user'} | ${'Project Manager'}
        ${'lead-pi-user'}         | ${'Lead PI (Core Leadership)'}
      `(
        'the team member with role $role should see manuscript resubmitted reminders',
        async ({ userId, role }) => {
          const fetchRemindersOptions: FetchRemindersOptions = {
            userId,
            timezone,
          };

          const user = getContentfulReminderUsersContent();
          user!.teamsCollection! = {
            items: [
              {
                role,
                team,
              },
            ],
          };

          mockContentfulGraphqlResponse(manuscriptResubmitted, user);

          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );
          expect(result.items).toEqual([expectedReminder]);
        },
      );

      test.each`
        userId                              | role
        ${'key-personnel-user'}             | ${'Key Personnel'}
        ${'scientific-advisory-board-user'} | ${'Scientific Advisory Board'}
        ${'co-pi-user'}                     | ${'Co-PI (Core Leadership)'}
        ${'asap-staff-user'}                | ${'ASAP Staff'}
        ${'trainee-user'}                   | ${'Trainee'}
      `(
        'the team member with role $role should not see manuscript created reminders',
        async ({ userId, role }) => {
          const user = getContentfulReminderUsersContent();
          user!.teamsCollection = {
            items: [
              {
                role,
                team,
              },
            ],
          };

          mockContentfulGraphqlResponse(manuscriptResubmitted, user);

          const result = await remindersDataProvider.fetch({
            userId,
            timezone,
          });
          expect(result.items).toEqual([]);
        },
      );

      test('the open science team member assigned to the manuscript should see manuscript resubmitted reminder', async () => {
        const userId = 'assigned-os-member-id';
        const fetchRemindersOptions: FetchRemindersOptions = {
          userId,
          timezone,
        };

        const user = getContentfulReminderUsersContent();
        user!.role = 'Staff';
        user!.openScienceTeamMember = true;

        mockContentfulGraphqlResponse(manuscriptResubmitted, user);

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);
        expect(result.items).toEqual([expectedReminder]);
      });

      test('first author of the manuscript should see manuscript resubmitted reminder', async () => {
        const userId = 'first-author-user';
        const fetchRemindersOptions: FetchRemindersOptions = {
          userId,
          timezone,
        };

        mockContentfulGraphqlResponse(manuscriptResubmitted);

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);
        expect(result.items).toEqual([expectedReminder]);
      });

      test('the additional author of the manuscript should see manuscript resubmitted reminder', async () => {
        const userId = 'additional-author-user';
        const fetchRemindersOptions: FetchRemindersOptions = {
          userId,
          timezone,
        };

        mockContentfulGraphqlResponse(manuscriptResubmitted);

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);
        expect(result.items).toEqual([expectedReminder]);
      });

      test('the PIs of the manuscript labs should see manuscript resubmitted reminder', async () => {
        const userId = 'lab-pi-on-manuscript';
        const fetchRemindersOptions: FetchRemindersOptions = {
          userId,
          timezone,
        };

        mockContentfulGraphqlResponse(manuscriptResubmitted);

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);
        expect(result.items).toEqual([expectedReminder]);
      });
    });

    describe('Manuscript status updated', () => {
      const manuscriptStatusUpdated =
        getContentfulReminderManuscriptCollectionItem();
      manuscriptStatusUpdated!.previousStatus = 'Waiting for Report';
      manuscriptStatusUpdated!.status = 'Review Compliance Report';
      manuscriptStatusUpdated!.statusUpdatedAt = '2025-01-08T10:00:00.000Z';
      manuscriptStatusUpdated!.statusUpdatedBy = {
        firstName: 'Jannet',
        lastName: 'Doe',
        sys: {
          id: 'user-who-updated-manuscript-status',
        },
      };
      manuscriptStatusUpdated!.teamsCollection!.items[0]!.displayName = 'ASAP';

      const expectedReminder: ManuscriptStatusUpdatedReminder =
        getManuscriptStatusUpdatedReminder();

      test('the person who changed the manuscript status should not see manuscript created reminders', async () => {
        const userId = 'user-who-updated-manuscript-status';
        const fetchRemindersOptions: FetchRemindersOptions = {
          userId,
          timezone,
        };

        mockContentfulGraphqlResponse(manuscriptStatusUpdated);

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);
        expect(result.items).toEqual([]);
      });

      test.each`
        userId                    | role
        ${'project-manager-user'} | ${'Project Manager'}
        ${'lead-pi-user'}         | ${'Lead PI (Core Leadership)'}
      `(
        'the team member with role $role should see manuscript status updated reminders',
        async ({ userId, role }) => {
          const fetchRemindersOptions: FetchRemindersOptions = {
            userId,
            timezone,
          };

          const user = getContentfulReminderUsersContent();
          user!.teamsCollection! = {
            items: [
              {
                role,
                team,
              },
            ],
          };

          mockContentfulGraphqlResponse(manuscriptStatusUpdated, user);

          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );
          expect(result.items).toEqual(
            expect.arrayContaining([expectedReminder]),
          );
        },
      );

      test.each`
        userId                              | role
        ${'co-pi-user'}                     | ${'Co-PI (Core Leadership)'}
        ${'key-personnel-user'}             | ${'Key Personnel'}
        ${'scientific-advisory-board-user'} | ${'Scientific Advisory Board'}
        ${'asap-staff-user'}                | ${'ASAP Staff'}
        ${'trainee-user'}                   | ${'Trainee'}
      `(
        'the team member with role $role should not see manuscript created reminders',
        async ({ userId, role }) => {
          const fetchRemindersOptions: FetchRemindersOptions = {
            userId,
            timezone,
          };

          const user = getContentfulReminderUsersContent();
          user!.teamsCollection = {
            items: [
              {
                role,
                team,
              },
            ],
          };

          mockContentfulGraphqlResponse(manuscriptStatusUpdated, user);

          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );
          expect(result.items).toEqual([]);
        },
      );

      test('first author of the manuscript should see manuscript status updated reminders', async () => {
        const userId = 'first-author-user';
        const fetchRemindersOptions: FetchRemindersOptions = {
          userId,
          timezone,
        };

        mockContentfulGraphqlResponse(manuscriptStatusUpdated);

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);
        expect(result.items).toEqual(
          expect.arrayContaining([expectedReminder]),
        );
      });

      test('the corresponding author of the manuscript should see manuscript status updated reminders', async () => {
        const userId = 'corresponding-author-user';
        const fetchRemindersOptions: FetchRemindersOptions = {
          userId,
          timezone,
        };

        manuscriptStatusUpdated!.versionsCollection!.items[0]!.correspondingAuthorCollection =
          {
            items: [
              {
                __typename: 'Users',
                sys: {
                  id: userId,
                },
              },
            ],
          };

        mockContentfulGraphqlResponse(manuscriptStatusUpdated);

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);
        expect(result.items).toEqual(
          expect.arrayContaining([expectedReminder]),
        );
      });
    });

    describe('Manuscript team names', () => {
      test('returns the correct team names when there is only one team', async () => {
        const userId = 'first-author-user';
        const fetchRemindersOptions: FetchRemindersOptions = {
          userId,
          timezone,
        };

        const manuscript = getContentfulReminderManuscriptCollectionItem();
        manuscript!.teamsCollection = {
          items: [
            {
              sys: {
                id: 'team-alessi',
              },
              displayName: 'Alessi',
            },
          ],
        };

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          manuscriptsCollection: {
            items: [manuscript],
          },
          users: getContentfulReminderUsersContent(),
        });
        mockEmptyDiscussionGraphqlResponse();

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);
        expect(result.items[0]!.data).toEqual(
          expect.objectContaining({
            teams: 'Team Alessi',
          }),
        );
      });

      test('returns the correct team names when there are two teams', async () => {
        const userId = 'first-author-user';
        const fetchRemindersOptions: FetchRemindersOptions = {
          userId,
          timezone,
        };

        const manuscript = getContentfulReminderManuscriptCollectionItem();
        manuscript!.teamsCollection = {
          items: [
            {
              sys: {
                id: 'team-alessi',
              },
              displayName: 'Alessi',
            },
            {
              sys: {
                id: 'team-de-camilli',
              },
              displayName: 'De Camilli',
            },
          ],
        };

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          manuscriptsCollection: {
            items: [manuscript],
          },
          users: getContentfulReminderUsersContent(),
        });

        mockEmptyDiscussionGraphqlResponse();

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);
        expect(result.items[0]!.data).toEqual(
          expect.objectContaining({
            teams: 'Team Alessi and Team De Camilli',
          }),
        );
      });

      test('returns the correct team names when there are multiple teams', async () => {
        const userId = 'first-author-user';
        const fetchRemindersOptions: FetchRemindersOptions = {
          userId,
          timezone,
        };

        const manuscript = getContentfulReminderManuscriptCollectionItem();
        manuscript!.teamsCollection = {
          items: [
            {
              sys: {
                id: 'team-alessi',
              },
              displayName: 'Alessi',
            },
            {
              sys: {
                id: 'team-de-camilli',
              },
              displayName: 'De Camilli',
            },
            {
              sys: {
                id: 'team-rio',
              },
              displayName: 'Rio',
            },
            {
              sys: {
                id: 'team-edwards',
              },
              displayName: 'Edwards',
            },
          ],
        };

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          manuscriptsCollection: {
            items: [manuscript],
          },
          users: getContentfulReminderUsersContent(),
        });

        mockEmptyDiscussionGraphqlResponse();

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);
        expect(result.items[0]!.data).toEqual(
          expect.objectContaining({
            teams: 'Team Alessi, Team De Camilli, Team Rio and Team Edwards',
          }),
        );
      });
    });
    describe('Multiple manuscript reminders', () => {
      test('returns multiple manuscript reminders showing the most recent first', async () => {
        const userId = 'first-author-user';
        const fetchRemindersOptions: FetchRemindersOptions = {
          userId,
          timezone,
        };
        const manuscriptCreated =
          getContentfulReminderManuscriptCollectionItem();
        manuscriptCreated!.sys.firstPublishedAt = '2025-01-05T08:00:00.000Z';

        const manuscriptResubmitted =
          getContentfulReminderManuscriptCollectionItem();
        manuscriptResubmitted!.sys.firstPublishedAt =
          '2024-12-01T10:00:00.000Z';
        manuscriptResubmitted!.sys.publishedAt = '2025-01-06T17:00:00.000Z';
        manuscriptResubmitted!.status = 'Manuscript Resubmitted';
        manuscriptResubmitted!.versionsCollection = {
          total: 2,
          items: [
            {
              count: 1,
              additionalAuthorsCollection: {
                items: [],
              },
              correspondingAuthorCollection: {
                items: [],
              },
              firstAuthorsCollection: {
                items: [
                  {
                    __typename: 'Users',
                    sys: {
                      id: 'first-author-user',
                    },
                  },
                ],
              },
              createdBy: {
                sys: {
                  id: 'user-who-created-manuscript',
                },
                firstName: 'Jane',
                lastName: 'Doe',
              },
            },
            {
              count: 2,
              correspondingAuthorCollection: {
                items: [],
              },
              firstAuthorsCollection: {
                items: [
                  {
                    __typename: 'Users',
                    sys: {
                      id: 'first-author-user',
                    },
                  },
                ],
              },
              additionalAuthorsCollection: {
                items: [
                  {
                    __typename: 'Users',
                    sys: {
                      id: 'additional-author-user',
                    },
                  },
                ],
              },
              createdBy: {
                sys: {
                  id: 'user-who-resubmitted-manuscript',
                },
                firstName: 'John',
                lastName: 'Doe',
              },
            },
          ],
        };

        const manuscriptStatusUpdated =
          getContentfulReminderManuscriptCollectionItem();
        manuscriptStatusUpdated!.sys.firstPublishedAt =
          '2024-12-01T10:00:00.000Z';
        manuscriptStatusUpdated!.sys.publishedAt = '2024-12-01T10:00:00.000Z';
        manuscriptStatusUpdated!.previousStatus = 'Waiting for Report';
        manuscriptStatusUpdated!.status = 'Review Compliance Report';
        manuscriptStatusUpdated!.statusUpdatedAt = '2025-01-02T10:00:00.000Z';
        manuscriptStatusUpdated!.statusUpdatedBy = {
          firstName: 'Jannet',
          lastName: 'Doe',
          sys: {
            id: 'user-who-updated-manuscript-status',
          },
        };
        manuscriptStatusUpdated!.teamsCollection!.items[0]!.displayName =
          'ASAP';

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          manuscriptsCollection: {
            items: [
              manuscriptResubmitted,
              manuscriptCreated,
              manuscriptStatusUpdated,
            ],
          },
          users: getContentfulReminderUsersContent(),
        });

        mockEmptyDiscussionGraphqlResponse();

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);
        expect(result.items).toEqual([
          {
            id: 'manuscript-resubmitted-manuscript-id-1',
            entity: 'Manuscript',
            type: 'Manuscript Resubmitted',
            data: {
              manuscriptId: 'manuscript-id-1',
              resubmittedBy: 'John Doe',
              resubmittedAt: '2025-01-06T17:00:00.000Z',
              teams: 'Team Reminder',
              title: 'Contextual AI models for single-cell protein biology',
            },
          } as ManuscriptResubmittedReminder,
          {
            id: 'manuscript-created-manuscript-id-1',
            entity: 'Manuscript',
            type: 'Manuscript Created',
            data: {
              manuscriptId: 'manuscript-id-1',
              createdBy: 'Jane Doe',
              publishedAt: '2025-01-05T08:00:00.000Z',
              teams: 'Team Reminder',
              title: 'Contextual AI models for single-cell protein biology',
            },
          } as ManuscriptCreatedReminder,
          {
            id: 'manuscript-status-updated-manuscript-id-1',
            entity: 'Manuscript',
            type: 'Manuscript Status Updated',
            data: {
              manuscriptId: 'manuscript-id-1',
              updatedBy: 'Jannet Doe',
              updatedAt: '2025-01-02T10:00:00.000Z',
              previousStatus: 'Waiting for Report',
              status: 'Review Compliance Report',
              title: 'Contextual AI models for single-cell protein biology',
              teams: 'Team ASAP',
            },
          } as ManuscriptStatusUpdatedReminder,
        ]);
      });
    });
  });
});
