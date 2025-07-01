import { Entry, Environment } from '@asap-hub/contentful';

import { when } from 'jest-when';
import {
  DiscussionContentfulDataProvider,
  parseGraphQLDiscussion,
} from '../../../src/data-providers/contentful/discussion.data-provider';

import { getEntry } from '../../fixtures/contentful.fixtures';
import {
  getContentfulGraphqlDiscussion,
  getDiscussionDataObject,
  getDiscussionCreateRequestObject,
} from '../../fixtures/discussions.fixtures';
import { getContentfulGraphqlClientMock } from '../../mocks/contentful-graphql-client.mock';
import { getContentfulEnvironmentMock } from '../../mocks/contentful-rest-client.mock';

jest.mock('@asap-hub/contentful', () => ({
  ...jest.requireActual('@asap-hub/contentful'),
  pollContentfulGql: jest
    .fn()
    .mockImplementation(async (_version, fetchData, _entity) => {
      await fetchData();
      return Promise.resolve();
    }),
}));

jest.mock('../../../src/data-providers/email-notification-service', () => ({
  EmailNotificationService: jest.fn().mockImplementation(() => ({
    sendEmailNotification: jest.fn().mockResolvedValue(Promise.resolve()),
  })),
}));

describe('Discussions Contentful Data Provider', () => {
  const contentfulGraphqlClientMock = getContentfulGraphqlClientMock();
  const environmentMock = getContentfulEnvironmentMock();
  const contentfulRestClientMock: () => Promise<Environment> = () =>
    Promise.resolve(environmentMock);

  const discussionDataProviderMock = new DiscussionContentfulDataProvider(
    contentfulGraphqlClientMock,
    contentfulRestClientMock,
  );
  const userMockEntry = {
    fields: {
      firstName: {
        'en-US': 'Jane',
      },
      lastName: {
        'en-US': 'Doe',
      },
    },
  } as unknown as Entry;

  const discussionId = 'discussion-id-1';
  const messageId = 'message-id-1';
  const userId = 'user-id-1';

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Create', () => {
    const emailNotificationServiceMock = jest.mocked(
      discussionDataProviderMock['emailNotificationService'],
      { shallow: true },
    );

    const discussionRequestObject = getDiscussionCreateRequestObject();

    const getManuscriptMock = (
      manuscriptDiscussions: any,
      useOSUser: boolean = false,
      publishFunction?: jest.Mock,
    ) => {
      const publish = publishFunction || jest.fn();
      const patch = jest.fn().mockResolvedValue({
        publish,
      });

      const manuscriptMockEntry = {
        sys: { id: discussionRequestObject.manuscriptId },
        fields: {
          discussions: manuscriptDiscussions,
        },
        publish,
        patch,
      } as unknown as Entry;

      const osMemberMockEntry = {
        fields: {
          firstName: {
            'en-US': 'Jane',
          },
          lastName: {
            'en-US': 'Doe',
          },
          openScienceTeamMember: {
            'en-US': true,
          },
        },
      } as unknown as Entry;

      when(environmentMock.createEntry)
        .calledWith('messages', expect.anything())
        .mockResolvedValue({
          sys: { id: messageId },
          publish,
        } as unknown as Entry);
      when(environmentMock.createEntry)
        .calledWith('discussions', expect.anything())
        .mockResolvedValue({
          sys: { id: discussionId },
          publish,
        } as unknown as Entry);

      when(environmentMock.getEntry)
        .calledWith(discussionRequestObject.manuscriptId)
        .mockResolvedValue(manuscriptMockEntry);
      when(environmentMock.getEntry)
        .calledWith(discussionRequestObject.userId)
        .mockResolvedValue(useOSUser ? osMemberMockEntry : userMockEntry);

      return manuscriptMockEntry;
    };
    test('can create a discussion and links it to the manuscript with previous discussions', async () => {
      const publish = jest.fn();
      const discussions = {
        'en-US': [
          {
            sys: {
              id: 'previous-discussion',
              linkType: 'Entry',
              type: 'Link',
            },
          },
        ],
      };
      const manuscriptMockEntry = getManuscriptMock(
        discussions,
        false,
        publish,
      );

      const result = await discussionDataProviderMock.create(
        discussionRequestObject,
      );

      expect(environmentMock.createEntry).toHaveBeenNthCalledWith(
        1,
        'messages',
        {
          fields: {
            createdBy: {
              'en-US': {
                sys: {
                  id: discussionRequestObject.userId,
                  linkType: 'Entry',
                  type: 'Link',
                },
              },
            },
            text: {
              'en-US': discussionRequestObject.text,
            },
          },
        },
      );
      expect(environmentMock.createEntry).toHaveBeenNthCalledWith(
        2,
        'discussions',
        {
          fields: {
            title: {
              'en-US': discussionRequestObject.title,
            },
            message: {
              'en-US': {
                sys: {
                  id: messageId,
                  linkType: 'Entry',
                  type: 'Link',
                },
              },
            },
            readBy: {
              'en-US': [
                {
                  sys: {
                    id: discussionRequestObject.userId,
                    linkType: 'Entry',
                    type: 'Link',
                  },
                },
              ],
            },
          },
        },
      );
      expect(manuscriptMockEntry.patch).toHaveBeenCalledWith([
        {
          op: 'replace',
          path: '/fields/discussions',
          value: {
            'en-US': [
              {
                sys: {
                  id: 'previous-discussion',
                  linkType: 'Entry',
                  type: 'Link',
                },
              },
              {
                sys: {
                  id: discussionId,
                  linkType: 'Entry',
                  type: 'Link',
                },
              },
            ],
          },
        },
      ]);
      expect(publish).toHaveBeenCalledTimes(3);
      expect(result).toEqual(discussionId);
    });

    test('can create a discussion and links it to the manuscript when there are no previous discussions', async () => {
      const manuscriptMockEntry = getManuscriptMock({
        'en-US': [],
      });

      await discussionDataProviderMock.create(discussionRequestObject);

      expect(manuscriptMockEntry.patch).toHaveBeenCalledWith([
        {
          op: 'replace',
          path: '/fields/discussions',
          value: {
            'en-US': [
              {
                sys: {
                  id: discussionId,
                  linkType: 'Entry',
                  type: 'Link',
                },
              },
            ],
          },
        },
      ]);
    });

    test('Should send email notification when a discussion is created by a grantee', async () => {
      getManuscriptMock({
        'en-US': [],
      });

      await discussionDataProviderMock.create({
        ...discussionRequestObject,
        notificationList: '',
      });

      expect(
        emailNotificationServiceMock.sendEmailNotification,
      ).toHaveBeenCalledWith(
        'discussion_created_by_grantee',
        discussionRequestObject.manuscriptId,
        '',
        { id: discussionId, userName: 'Jane Doe' },
      );
    });

    test('Should send email notification when a discussion is created by an os member', async () => {
      getManuscriptMock(
        {
          'en-US': [],
        },
        true,
      );

      await discussionDataProviderMock.create({
        ...discussionRequestObject,
        notificationList: '',
      });

      expect(
        emailNotificationServiceMock.sendEmailNotification,
      ).toHaveBeenCalledWith(
        'discussion_created_by_os_member',
        discussionRequestObject.manuscriptId,
        '',
        { id: discussionId, userName: 'Jane Doe' },
      );
    });
  });

  describe('Fetch', () => {
    test('should throw an error', async () => {
      await expect(discussionDataProviderMock.fetch()).rejects.toThrow(
        'Method not implemented.',
      );
    });
  });

  describe('Fetch by ID', () => {
    test('returns null if query does not return a result', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValue({
        discussions: null,
      });

      const result = await discussionDataProviderMock.fetchById('1');
      expect(result).toBeNull();
    });

    test('Should fetch the discussion from Contentful GraphQl', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        discussions: getContentfulGraphqlDiscussion(),
      });

      const result = await discussionDataProviderMock.fetchById(discussionId);

      expect(result).toMatchObject(getDiscussionDataObject());
    });
  });

  describe('Update', () => {
    const getDiscussionMocks = (
      replyMock: Entry,
      discussionMock: Entry,
    ): Entry => {
      environmentMock.createEntry.mockResolvedValueOnce(replyMock);
      replyMock.publish = jest.fn().mockResolvedValueOnce(replyMock);

      when(environmentMock.getEntry)
        .calledWith(discussionId)
        .mockResolvedValue(discussionMock);
      when(environmentMock.getEntry)
        .calledWith(userId)
        .mockResolvedValue(userMockEntry);
      const discussionMockUpdated = getEntry({});
      discussionMock.patch = jest
        .fn()
        .mockResolvedValueOnce(discussionMockUpdated);

      return discussionMockUpdated;
    };
    test('Should update a discussion without existing replies and make readBy to be a list with only the user who is replying', async () => {
      const reply = {
        text: 'test reply',
        userId: userId,
        isOpenScienceMember: true,
      };

      const replyMock = getEntry({});
      const discussionMock = getEntry({});
      const discussionMockUpdated = getDiscussionMocks(
        replyMock,
        discussionMock,
      );

      await discussionDataProviderMock.update(discussionId, {
        userId,
        reply,
        manuscriptId: 'manuscript-id-1',
        notificationList: '',
      });

      expect(environmentMock.getEntry).toHaveBeenCalledWith(discussionId);
      expect(environmentMock.createEntry).toHaveBeenCalledWith('messages', {
        fields: {
          text: { 'en-US': reply.text },
          createdBy: {
            'en-US': {
              sys: {
                id: userId,
                linkType: 'Entry',
                type: 'Link',
              },
            },
          },
        },
      });
      expect(discussionMock.patch).toHaveBeenCalledWith([
        {
          op: 'add',
          path: '/fields/replies',
          value: {
            'en-US': [
              {
                sys: {
                  id: 'entry-id',
                  linkType: 'Entry',
                  type: 'Link',
                },
              },
            ],
          },
        },
        {
          op: 'add',
          path: '/fields/readBy',
          value: {
            'en-US': [
              {
                sys: {
                  id: 'user-id-1',
                  linkType: 'Entry',
                  type: 'Link',
                },
              },
            ],
          },
        },
      ]);

      expect(discussionMockUpdated.publish).toHaveBeenCalled();
    });

    test('Should update a discussion with existing replies and make readBy to be a list with only the user who is replying', async () => {
      const reply = {
        text: 'test reply',
        userId: userId,
        isOpenScienceMember: true,
      };

      const replyMock = getEntry({});
      replyMock.sys.id = 'new-reply';

      const discussionMock = getEntry({
        replies: {
          'en-US': [
            {
              sys: {
                id: 'old-reply-1',
                linkType: 'Entry',
                type: 'Link',
              },
            },
            {
              sys: {
                id: 'old-reply-2',
                linkType: 'Entry',
                type: 'Link',
              },
            },
          ],
        },
      });
      const discussionMockUpdated = getDiscussionMocks(
        replyMock,
        discussionMock,
      );

      await discussionDataProviderMock.update(discussionId, {
        userId,
        reply,
        manuscriptId: 'manuscript-id-1',
        notificationList: '',
      });

      expect(environmentMock.getEntry).toHaveBeenCalledWith(discussionId);
      expect(environmentMock.createEntry).toHaveBeenCalledWith('messages', {
        fields: {
          text: { 'en-US': reply.text },
          createdBy: {
            'en-US': {
              sys: {
                id: userId,
                linkType: 'Entry',
                type: 'Link',
              },
            },
          },
        },
      });
      expect(discussionMock.patch).toHaveBeenCalledWith([
        {
          op: 'replace',
          path: '/fields/replies',
          value: {
            'en-US': [
              {
                sys: {
                  id: 'old-reply-1',
                  linkType: 'Entry',
                  type: 'Link',
                },
              },
              {
                sys: {
                  id: 'old-reply-2',
                  linkType: 'Entry',
                  type: 'Link',
                },
              },
              {
                sys: {
                  id: 'new-reply',
                  linkType: 'Entry',
                  type: 'Link',
                },
              },
            ],
          },
        },
        {
          op: 'add',
          path: '/fields/readBy',
          value: {
            'en-US': [
              {
                sys: {
                  id: 'user-id-1',
                  linkType: 'Entry',
                  type: 'Link',
                },
              },
            ],
          },
        },
      ]);

      expect(discussionMockUpdated.publish).toHaveBeenCalled();
    });

    test('Should update a discussion with existing readBy', async () => {
      const discussionMock = getEntry({
        readBy: {
          'en-US': [
            {
              sys: {
                id: 'john-doe',
                linkType: 'Entry',
                type: 'Link',
              },
            },
            {
              sys: {
                id: 'jane-smith',
                linkType: 'Entry',
                type: 'Link',
              },
            },
          ],
        },
      });

      const discussionMockUpdated = getDiscussionMocks(
        getEntry({}),
        discussionMock,
      );
      await discussionDataProviderMock.update(discussionId, { userId });

      expect(environmentMock.getEntry).toHaveBeenCalledWith(discussionId);
      expect(discussionMock.patch).toHaveBeenCalledWith([
        {
          op: 'replace',
          path: '/fields/readBy',
          value: {
            'en-US': [
              {
                sys: {
                  id: 'john-doe',
                  linkType: 'Entry',
                  type: 'Link',
                },
              },
              {
                sys: {
                  id: 'jane-smith',
                  linkType: 'Entry',
                  type: 'Link',
                },
              },
              {
                sys: {
                  id: 'user-id-1',
                  linkType: 'Entry',
                  type: 'Link',
                },
              },
            ],
          },
        },
      ]);

      expect(discussionMockUpdated.publish).toHaveBeenCalled();
    });

    test('Should not add a user to readBy if they are already in the list', async () => {
      const discussionMock = getEntry({
        readBy: {
          'en-US': [
            {
              sys: {
                id: userId,
                linkType: 'Entry',
                type: 'Link',
              },
            },
          ],
        },
      });
      const discussionMockUpdated = getDiscussionMocks(
        getEntry({}),
        discussionMock,
      );

      await discussionDataProviderMock.update(discussionId, { userId });

      expect(environmentMock.getEntry).toHaveBeenCalledWith(discussionId);
      expect(discussionMock.patch).not.toHaveBeenCalled();
      expect(discussionMockUpdated.publish).not.toHaveBeenCalled();
    });

    test('Should add a user to readBy if the list is empty', async () => {
      const discussionMock = getEntry({
        readBy: undefined,
      });
      const discussionMockUpdated = getDiscussionMocks(
        getEntry({}),
        discussionMock,
      );
      await discussionDataProviderMock.update(discussionId, { userId });

      expect(environmentMock.getEntry).toHaveBeenCalledWith(discussionId);
      expect(discussionMock.patch).toHaveBeenCalledWith([
        {
          op: 'replace',
          path: '/fields/readBy',
          value: {
            'en-US': [{ sys: { id: userId, linkType: 'Entry', type: 'Link' } }],
          },
        },
      ]);
      expect(discussionMockUpdated.publish).toHaveBeenCalled();
    });

    describe('email notifications', () => {
      beforeEach(() => {
        const discussionMock = getEntry({
          replies: {
            'en-US': [],
          },
        });
        when(environmentMock.getEntry)
          .calledWith(discussionId)
          .mockResolvedValue(discussionMock);

        when(environmentMock.getEntry)
          .calledWith(userId)
          .mockResolvedValue(userMockEntry);
        const discussionMockUpdated = getEntry({});
        discussionMock.patch = jest
          .fn()
          .mockResolvedValueOnce(discussionMockUpdated);
      });

      test('Should send email notification when an Open Science member replies', async () => {
        const reply = {
          text: 'test reply',
          userId: userId,
          isOpenScienceMember: true,
        };

        const replyMock = getEntry({});
        replyMock.sys.id = 'new-reply';
        environmentMock.createEntry.mockResolvedValueOnce(replyMock);
        replyMock.publish = jest.fn().mockResolvedValueOnce(replyMock);

        await discussionDataProviderMock.update(discussionId, {
          userId,
          reply,
          manuscriptId: 'manuscript-id-1',
          notificationList: '',
        });

        const emailNotificationServiceMock = jest.mocked(
          discussionDataProviderMock['emailNotificationService'],
          { shallow: true },
        );

        expect(
          emailNotificationServiceMock.sendEmailNotification,
        ).toHaveBeenCalledWith(
          'os_member_replied_to_discussion',
          'manuscript-id-1',
          '',
          {
            id: discussionId,
            userName: 'Jane Doe',
          },
        );
      });

      test('Should send email notification when a non-Open Science member replies', async () => {
        const reply = {
          text: 'test reply',
          userId: userId,
          isOpenScienceMember: false,
        };

        const replyMock = getEntry({});
        replyMock.sys.id = 'new-reply';
        environmentMock.createEntry.mockResolvedValueOnce(replyMock);
        replyMock.publish = jest.fn().mockResolvedValueOnce(replyMock);

        await discussionDataProviderMock.update(discussionId, {
          userId,
          reply,
          manuscriptId: 'manuscript-id-1',
          notificationList: '',
        });

        const emailNotificationServiceMock = jest.mocked(
          discussionDataProviderMock['emailNotificationService'],
        );

        expect(
          emailNotificationServiceMock.sendEmailNotification,
        ).toHaveBeenCalledWith(
          'grantee_replied_to_discussion',
          'manuscript-id-1',
          '',
          {
            id: discussionId,
            userName: 'Jane Doe',
          },
        );
      });
    });
  });

  describe('parseGraphqlDiscussion', () => {
    test('Should parse graphql discussion', async () => {
      const graphqlDiscussion = getContentfulGraphqlDiscussion();
      graphqlDiscussion!.message!.createdBy!.teamsCollection = null;

      const parsedDiscussion = parseGraphQLDiscussion(graphqlDiscussion!);

      expect(parsedDiscussion.id).toBe(graphqlDiscussion?.sys.id);
      expect(parsedDiscussion.message.text).toBe(
        graphqlDiscussion?.message?.text,
      );
      expect(parsedDiscussion.message.createdBy.firstName).toBe(
        graphqlDiscussion?.message?.createdBy?.firstName,
      );
    });
  });
});
