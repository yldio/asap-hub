import {
  DiscussionCreatedReminder,
  DiscussionEndedReminder,
  DiscussionRepliedToReminder,
  FetchRemindersOptions,
} from '@asap-hub/model';
import { DateTime } from 'luxon';

import {
  ReminderContentfulDataProvider,
  DiscussionItem,
  MessageItem,
  getTeamNames,
} from '../../../../src/data-providers/contentful/reminder.data-provider';
import { getContentfulGraphqlClientMock } from '../../../mocks/contentful-graphql-client.mock';
import {
  getContentfulReminderUsersContent,
  getContentfulReminderDiscussionCollectionItem,
  getDiscussionStartedByGranteeReminder,
  getDiscussionEndedReminder,
  getContentfulReminderMessageCollectionItem,
  getDiscussionRepliedToByGranteeReminder,
  getDiscussionStartedByOpenScienceMemberReminder,
  getDiscussionRepliedToByOpenScienceMemberReminder,
} from '../../../fixtures/reminders.fixtures';
import { FetchRemindersQuery } from '@asap-hub/contentful';

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
        getContentfulReminderDiscussionCollectionItem()!.sys.firstPublishedAt,
      )
        .plus({ days: 1 })
        .toJSDate(),
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Fetch discussion reminders', () => {
    const timezone = 'Europe/London';

    describe('Missing Data', () => {
      const userId = 'first-author-user';
      const fetchRemindersOptions: FetchRemindersOptions = {
        userId,
        timezone,
      };

      const mockContentfulGraphqlResponse = (
        discussion: DiscussionItem | null,
        message: MessageItem | null,
      ) => {
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          users: getContentfulReminderUsersContent(),
        });

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          discussionsCollection: {
            items: [discussion],
          },
          messagesCollection: {
            items: [message],
          },
        });
      };

      const expectEmptyResult = async () => {
        const result = await remindersDataProvider.fetch(fetchRemindersOptions);
        expect(result.items).toEqual([]);
      };

      test('does not return the reminder if discussion is null', async () => {
        mockContentfulGraphqlResponse(null, null);
        await expectEmptyResult();
      });

      test('does not return the reminder if discussion has no message', async () => {
        const discussion = getContentfulReminderDiscussionCollectionItem();
        discussion!.message = null;

        mockContentfulGraphqlResponse(discussion, null);
        await expectEmptyResult();
      });

      test('does not return the reminder if discussion message createdBy is null', async () => {
        const discussion = getContentfulReminderDiscussionCollectionItem();
        discussion!.message!.createdBy = null;

        mockContentfulGraphqlResponse(discussion, null);
        await expectEmptyResult();
      });
    });

    describe('Discussion started', () => {
      const expectedReminder: DiscussionCreatedReminder =
        getDiscussionStartedByGranteeReminder();

      const mockContentfulGraphqlResponse = (
        discussion: DiscussionItem | null = getContentfulReminderDiscussionCollectionItem(),
        user: FetchRemindersQuery['users'] = getContentfulReminderUsersContent(),
      ) => {
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          users: user,
        });

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          discussionsCollection: {
            items: [discussion],
          },
          messagesCollection: {
            items: [],
          },
        });
      };

      test('the person who started the discussion should not see discussion started reminders', async () => {
        const userId = 'user-who-started-discussion';
        const fetchRemindersOptions: FetchRemindersOptions = {
          userId,
          timezone,
        };

        mockContentfulGraphqlResponse();

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);
        expect(result.items).toEqual([]);
      });

      test.each`
        userId                    | role
        ${'project-manager-user'} | ${'Project Manager'}
        ${'lead-pi-user'}         | ${'Lead PI (Core Leadership)'}
      `(
        'the team member with role $role should see discussion started reminders',
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
                    id: 'team-1',
                  },
                },
              },
            ],
          };

          mockContentfulGraphqlResponse(
            getContentfulReminderDiscussionCollectionItem(),
            user,
          );

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
        'the team member with role $role should not see discussion started reminders',
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
                    id: 'team-1',
                  },
                },
              },
            ],
          };

          mockContentfulGraphqlResponse(
            getContentfulReminderDiscussionCollectionItem(),
            user,
          );

          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );
          expect(result.items).toEqual([]);
        },
      );

      test('first author of the related manuscript should see discussion started reminders', async () => {
        const userId = 'first-author-user';
        const fetchRemindersOptions: FetchRemindersOptions = {
          userId,
          timezone,
        };

        mockContentfulGraphqlResponse();

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);
        expect(result.items).toEqual([expectedReminder]);
      });

      test('returns reminder if discussion was started by open science member', async () => {
        const discussionItem = getContentfulReminderDiscussionCollectionItem();
        const user = getContentfulReminderUsersContent();
        discussionItem!.message!.createdBy = {
          ...discussionItem!.message!.createdBy,
          openScienceTeamMember: true,
          role: 'Staff',
          sys: { id: 'user-who-started-discussion' },
        };

        const expectedReminder =
          getDiscussionStartedByOpenScienceMemberReminder();

        const userId = 'first-author-user';
        const fetchRemindersOptions: FetchRemindersOptions = {
          userId,
          timezone,
        };

        mockContentfulGraphqlResponse(discussionItem, user);

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);
        expect(result.items).toEqual([expectedReminder]);
      });
    });

    describe('Discussion Ended', () => {
      const discussionItem = getContentfulReminderDiscussionCollectionItem();
      const endDiscussionUser = {
        ...discussionItem!.message!.createdBy,
        sys: { id: 'user-who-ended-discussion' },
      };
      discussionItem!.sys.firstPublishedAt = '2024-12-08T16:21:33.824Z';

      discussionItem!.endedAt = '2025-01-08T16:21:33.824Z';
      discussionItem!.endedBy = endDiscussionUser;

      const expectedReminder: DiscussionEndedReminder =
        getDiscussionEndedReminder();

      const mockContentfulGraphqlResponse = (
        discussion: DiscussionItem | null = discussionItem,
        user: FetchRemindersQuery['users'] = getContentfulReminderUsersContent(),
      ) => {
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          users: user,
        });

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          discussionsCollection: {
            items: [discussion],
          },
          messagesCollection: {
            items: [],
          },
        });
      };

      test('the person who ended the discussion should not see discussion reminders', async () => {
        const userId = 'user-who-ended-discussion';
        const fetchRemindersOptions: FetchRemindersOptions = {
          userId,
          timezone,
        };

        mockContentfulGraphqlResponse();

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);
        expect(result.items).toEqual([]);
      });

      test.each`
        userId                    | role
        ${'project-manager-user'} | ${'Project Manager'}
        ${'lead-pi-user'}         | ${'Lead PI (Core Leadership)'}
      `(
        'the team member with role $role should see discussion ended reminders',
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
                    id: 'team-1',
                  },
                },
              },
            ],
          };

          mockContentfulGraphqlResponse(discussionItem, user);

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
        'the team member with role $role should not see the discussion ended reminders',
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
                    id: 'team-1',
                  },
                },
              },
            ],
          };

          mockContentfulGraphqlResponse(discussionItem, user);

          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );
          expect(result.items).toEqual([]);
        },
      );

      test('first author of the manuscript should see discussion ended reminder', async () => {
        const userId = 'first-author-user';
        const fetchRemindersOptions: FetchRemindersOptions = {
          userId,
          timezone,
        };

        mockContentfulGraphqlResponse();

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);
        expect(result.items).toEqual([expectedReminder]);
      });
    });

    describe('Discussion Replies Reminders', () => {
      const mockContentfulGraphqlResponse = (
        replyType: 'compliance-report' | 'quick-check' = 'compliance-report',
        replyAuthor: 'open-science-member' | 'grantee' = 'grantee',
        message: MessageItem | null = null,
        user: FetchRemindersQuery['users'] = getContentfulReminderUsersContent(),
      ): DiscussionRepliedToReminder => {
        const messageItem =
          getContentfulReminderMessageCollectionItem(replyType);

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          users: user,
        });

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          discussionsCollection: {
            items: [],
          },
          messagesCollection: {
            items: [message || messageItem],
          },
        });

        return replyAuthor === 'grantee'
          ? getDiscussionRepliedToByGranteeReminder(replyType)
          : getDiscussionRepliedToByOpenScienceMemberReminder(replyType);
      };

      describe('Discussion Replied To Compliance Report', () => {
        test('the person who replied to the discussion should not see discussion replied reminders', async () => {
          const userId = 'user-who-replied-discussion';
          const fetchRemindersOptions: FetchRemindersOptions = {
            userId,
            timezone,
          };

          mockContentfulGraphqlResponse();

          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );
          expect(result.items).toEqual([]);
        });

        test.each`
          userId                    | role
          ${'project-manager-user'} | ${'Project Manager'}
          ${'lead-pi-user'}         | ${'Lead PI (Core Leadership)'}
        `(
          'the team member with role $role should see discussion replied to reminders',
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
                      id: 'team-1',
                    },
                  },
                },
              ],
            };

            const expectedReminder = mockContentfulGraphqlResponse(
              'compliance-report',
              'grantee',
              null,
              user,
            );

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
          'the team member with role $role should not see discussion replied to reminders',
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
                      id: 'team-1',
                    },
                  },
                },
              ],
            };

            mockContentfulGraphqlResponse(
              'compliance-report',
              'grantee',
              null,
              user,
            );

            const result = await remindersDataProvider.fetch(
              fetchRemindersOptions,
            );
            expect(result.items).toEqual([]);
          },
        );

        test('first author of the manuscript should see discussion replied to reminders', async () => {
          const userId = 'first-author-user';
          const fetchRemindersOptions: FetchRemindersOptions = {
            userId,
            timezone,
          };

          const expectedReminder = mockContentfulGraphqlResponse(
            'compliance-report',
            'grantee',
            null,
          );

          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );
          expect(result.items).toEqual(
            expect.arrayContaining([expectedReminder]),
          );
        });

        test('returns reminder if discussion was replied to by open science member', async () => {
          const messageItem =
            getContentfulReminderMessageCollectionItem('compliance-report');

          messageItem!.createdBy = {
            ...messageItem!.createdBy,
            openScienceTeamMember: true,
            role: 'Staff',
            sys: { id: 'user-who-started-discussion' },
          };

          const userId = 'first-author-user';
          const fetchRemindersOptions: FetchRemindersOptions = {
            userId,
            timezone,
          };

          const expectedReminder = mockContentfulGraphqlResponse(
            'compliance-report',
            'open-science-member',
            messageItem,
          );

          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );
          expect(result.items).toEqual(
            expect.arrayContaining([expectedReminder]),
          );
        });
      });

      describe('Discussion Replied To Quick Check', () => {
        test('the person who replied to the discussion should not see discussion replied reminders', async () => {
          const userId = 'user-who-replied-discussion';
          const fetchRemindersOptions: FetchRemindersOptions = {
            userId,
            timezone,
          };

          mockContentfulGraphqlResponse();

          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );
          expect(result.items).toEqual([]);
        });

        test.each`
          userId                    | role
          ${'project-manager-user'} | ${'Project Manager'}
          ${'lead-pi-user'}         | ${'Lead PI (Core Leadership)'}
        `(
          'the team member with role $role should see discussion replied to reminders',
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
                      id: 'team-1',
                    },
                  },
                },
              ],
            };

            const expectedReminder = mockContentfulGraphqlResponse(
              'quick-check',
              'grantee',
              null,
              user,
            );

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
          'the team member with role $role should not see discussion replied to reminders',
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
                      id: 'team-1',
                    },
                  },
                },
              ],
            };

            mockContentfulGraphqlResponse('quick-check', 'grantee', null, user);

            const result = await remindersDataProvider.fetch(
              fetchRemindersOptions,
            );
            expect(result.items).toEqual([]);
          },
        );

        test('first author of the manuscript should see discussion replied to reminders', async () => {
          const userId = 'first-author-user';
          const fetchRemindersOptions: FetchRemindersOptions = {
            userId,
            timezone,
          };

          const expectedReminder = mockContentfulGraphqlResponse(
            'quick-check',
            'grantee',
            null,
          );

          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );
          expect(result.items).toEqual(
            expect.arrayContaining([expectedReminder]),
          );
        });

        test('returns reminder if discussion was replied to by open science member', async () => {
          const messageItem =
            getContentfulReminderMessageCollectionItem('quick-check');

          const user = getContentfulReminderUsersContent();
          messageItem!.createdBy = {
            ...messageItem!.createdBy,
            openScienceTeamMember: true,
            role: 'Staff',
            sys: { id: 'user-who-started-discussion' },
          };

          const userId = 'first-author-user';
          const fetchRemindersOptions: FetchRemindersOptions = {
            userId,
            timezone,
          };

          const expectedReminder = mockContentfulGraphqlResponse(
            'quick-check',
            'open-science-member',
            messageItem,
            user,
          );

          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );
          expect(result.items).toEqual(
            expect.arrayContaining([expectedReminder]),
          );
        });
      });
    });

    test('getTeamNames returns empty string when no teams provided', async () => {
      expect(getTeamNames(undefined)).toEqual('');
    });
  });
});
