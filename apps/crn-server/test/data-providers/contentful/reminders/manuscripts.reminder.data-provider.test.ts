import {
  FetchRemindersOptions,
  ManuscriptCreatedReminder,
  ManuscriptResubmittedReminder,
  ManuscriptStatusUpdatedReminder,
} from '@asap-hub/model';
import { DateTime } from 'luxon';

import { ReminderContentfulDataProvider } from '../../../../src/data-providers/contentful/reminder.data-provider';
import { getContentfulGraphqlClientMock } from '../../../mocks/contentful-graphql-client.mock';
import {
  getContentfulReminderUsersContent,
  getContentfulReminderManuscriptCollectionItem,
  getManuscriptResubmittedReminder,
  getManuscriptCreatedReminder,
  getManuscriptStatusUpdatedReminder,
} from '../../../fixtures/reminders.fixtures';

describe('Reminders data provider', () => {
  const contentfulGraphqlClientMock = getContentfulGraphqlClientMock();

  const remindersDataProvider = new ReminderContentfulDataProvider(
    contentfulGraphqlClientMock,
  );

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

    describe('Missing Data', () => {
      test('does not return the reminder if returned manuscript is null', async () => {
        const userId = 'first-author-user';
        const fetchRemindersOptions: FetchRemindersOptions = {
          userId,
          timezone,
        };

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          manuscriptsCollection: {
            items: [null],
          },
          users: getContentfulReminderUsersContent(),
        });

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);
        expect(result.items).toEqual([]);
      });

      test('does not return the reminder if manuscript team name is null', async () => {
        const userId = 'first-author-user';
        const fetchRemindersOptions: FetchRemindersOptions = {
          userId,
          timezone,
        };

        const manuscript = getContentfulReminderManuscriptCollectionItem();
        manuscript!.teamsCollection!.items[0]!.displayName = null;

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          manuscriptsCollection: {
            items: [manuscript],
          },
          users: getContentfulReminderUsersContent(),
        });

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);
        expect(result.items).toEqual([]);
      });

      test('does not return the reminder if manuscript first version is null', async () => {
        const userId = 'first-author-user';
        const fetchRemindersOptions: FetchRemindersOptions = {
          userId,
          timezone,
        };

        const manuscript = getContentfulReminderManuscriptCollectionItem();
        manuscript!.versionsCollection!.items[0] = null;

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          manuscriptsCollection: {
            items: [manuscript],
          },
          users: getContentfulReminderUsersContent(),
        });

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);
        expect(result.items).toEqual([]);
      });

      test('does not return the reminder if manuscript created by is null', async () => {
        const userId = 'first-author-user';
        const fetchRemindersOptions: FetchRemindersOptions = {
          userId,
          timezone,
        };

        const manuscript = getContentfulReminderManuscriptCollectionItem();
        manuscript!.versionsCollection!.items[0]!.createdBy = null;

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          manuscriptsCollection: {
            items: [manuscript],
          },
          users: getContentfulReminderUsersContent(),
        });

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);
        expect(result.items).toEqual([]);
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

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          manuscriptsCollection: {
            items: [getContentfulReminderManuscriptCollectionItem()],
          },
          users: getContentfulReminderUsersContent(),
        });

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);
        expect(result.items).toEqual([]);
      });

      test.each`
        userId                    | role
        ${'project-manager-user'} | ${'Project Manager'}
        ${'lead-pi-user'}         | ${'Lead PI (Core Leadership)'}
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
                team: {
                  sys: {
                    id: 'reminder-team',
                  },
                },
              },
            ],
          };

          contentfulGraphqlClientMock.request.mockResolvedValueOnce({
            manuscriptsCollection: {
              items: [getContentfulReminderManuscriptCollectionItem()],
            },
            users: user,
          });

          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );
          expect(result.items).toEqual([expectedReminder]);
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
                team: {
                  sys: {
                    id: 'reminder-team',
                  },
                },
              },
            ],
          };

          contentfulGraphqlClientMock.request.mockResolvedValueOnce({
            manuscriptsCollection: {
              items: [getContentfulReminderManuscriptCollectionItem()],
            },
            users: user,
          });

          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );
          expect(result.items).toEqual([]);
        },
      );

      test('the open science team member should see manuscript created reminders', async () => {
        const userId = 'open-science-team-member-user';
        const fetchRemindersOptions: FetchRemindersOptions = {
          userId,
          timezone,
        };

        const user = getContentfulReminderUsersContent();
        user!.role = 'Staff';
        user!.openScienceTeamMember = true;

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          manuscriptsCollection: {
            items: [getContentfulReminderManuscriptCollectionItem()],
          },
          users: user,
        });

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);
        expect(result.items).toEqual([expectedReminder]);
      });

      test('first author of the manuscript should see manuscript created reminders', async () => {
        const userId = 'first-author-user';
        const fetchRemindersOptions: FetchRemindersOptions = {
          userId,
          timezone,
        };

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          manuscriptsCollection: {
            items: [getContentfulReminderManuscriptCollectionItem()],
          },
          users: getContentfulReminderUsersContent(),
        });

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);
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

      const expectedReminder: ManuscriptResubmittedReminder =
        getManuscriptResubmittedReminder();

      test('the person who resubmitted the manuscript should not see manuscript created reminders', async () => {
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
                team: {
                  sys: {
                    id: 'reminder-team',
                  },
                },
              },
            ],
          };

          contentfulGraphqlClientMock.request.mockResolvedValueOnce({
            manuscriptsCollection: {
              items: [manuscriptResubmitted],
            },
            users: user,
          });

          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );
          expect(result.items).toEqual([expectedReminder]);
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
                team: {
                  sys: {
                    id: 'reminder-team',
                  },
                },
              },
            ],
          };

          contentfulGraphqlClientMock.request.mockResolvedValueOnce({
            manuscriptsCollection: {
              items: [manuscriptResubmitted],
            },
            users: user,
          });

          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );
          expect(result.items).toEqual([]);
        },
      );

      test('the open science team member should see manuscript resubmitted reminder', async () => {
        const userId = 'open-science-team-member-user';
        const fetchRemindersOptions: FetchRemindersOptions = {
          userId,
          timezone,
        };

        const user = getContentfulReminderUsersContent();
        user!.role = 'Staff';
        user!.openScienceTeamMember = true;

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          manuscriptsCollection: {
            items: [manuscriptResubmitted],
          },
          users: user,
        });

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);
        expect(result.items).toEqual([expectedReminder]);
      });

      test('first author of the manuscript should see manuscript resubmitted reminder', async () => {
        const userId = 'first-author-user';
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

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);
        expect(result.items).toEqual([expectedReminder]);
      });

      test('the additional author of the manuscript should see manuscript resubmitted reminder', async () => {
        const userId = 'additional-author-user';
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

      const expectedReminder: ManuscriptStatusUpdatedReminder =
        getManuscriptStatusUpdatedReminder();

      test('the person who changed the manuscript status should not see manuscript created reminders', async () => {
        const userId = 'user-who-updated-manuscript-status';
        const fetchRemindersOptions: FetchRemindersOptions = {
          userId,
          timezone,
        };

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          manuscriptsCollection: {
            items: [manuscriptStatusUpdated],
          },
          users: getContentfulReminderUsersContent(),
        });

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
                team: {
                  sys: {
                    id: 'reminder-team',
                  },
                },
              },
            ],
          };

          contentfulGraphqlClientMock.request.mockResolvedValueOnce({
            manuscriptsCollection: {
              items: [manuscriptStatusUpdated],
            },
            users: user,
          });

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
                team: {
                  sys: {
                    id: 'reminder-team',
                  },
                },
              },
            ],
          };

          contentfulGraphqlClientMock.request.mockResolvedValueOnce({
            manuscriptsCollection: {
              items: [manuscriptStatusUpdated],
            },
            users: user,
          });

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

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          manuscriptsCollection: {
            items: [manuscriptStatusUpdated],
          },
          users: getContentfulReminderUsersContent(),
        });

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

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          manuscriptsCollection: {
            items: [manuscriptStatusUpdated],
          },
          users: getContentfulReminderUsersContent(),
        });

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
              status: 'Waiting for Report',
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
            },
          } as ManuscriptStatusUpdatedReminder,
        ]);
      });
    });
  });
});
