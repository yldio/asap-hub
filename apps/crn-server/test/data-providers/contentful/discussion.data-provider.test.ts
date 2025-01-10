import {
  Entry,
  Environment,
  FETCH_DISCUSSION_BY_ID,
  pollContentfulGql,
} from '@asap-hub/contentful';
import { DiscussionType } from '@asap-hub/model';

import { when } from 'jest-when';
import {
  DiscussionContentfulDataProvider,
  parseGraphQLDiscussion,
} from '../../../src/data-providers/contentful/discussion.data-provider';

import { getEntry } from '../../fixtures/contentful.fixtures';
import {
  getContentfulGraphqlDiscussion,
  getDiscussionDataObject,
  getDiscussionRequestObject,
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

describe('Discussions Contentful Data Provider', () => {
  const contentfulGraphqlClientMock = getContentfulGraphqlClientMock();
  const environmentMock = getContentfulEnvironmentMock();
  const contentfulRestClientMock: () => Promise<Environment> = () =>
    Promise.resolve(environmentMock);

  const discussionDataProviderMock = new DiscussionContentfulDataProvider(
    contentfulGraphqlClientMock,
    contentfulRestClientMock,
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Create', () => {
    test('can create a discussion', async () => {
      const discussionId = 'discussion-id-1';
      const messageId = 'message-id-1';
      const DiscussionRequestObject = getDiscussionRequestObject();

      const publish = jest.fn();

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

      const result = await discussionDataProviderMock.create({
        ...DiscussionRequestObject,
      });

      expect(environmentMock.createEntry).toHaveBeenNthCalledWith(
        1,
        'messages',
        {
          fields: {
            createdBy: {
              'en-US': {
                sys: {
                  id: DiscussionRequestObject.userId,
                  linkType: 'Entry',
                  type: 'Link',
                },
              },
            },
            text: {
              'en-US': DiscussionRequestObject.text,
            },
          },
        },
      );
      expect(environmentMock.createEntry).toHaveBeenCalledWith('discussions', {
        fields: {
          message: {
            'en-US': {
              sys: {
                id: messageId,
                linkType: 'Entry',
                type: 'Link',
              },
            },
          },
        },
      });
      expect(publish).toHaveBeenCalled();
      expect(result).toEqual(discussionId);
    });

    test('creates a discussion and links it to a compliance report when complianceReportId is provided', async () => {
      const discussionId = 'discussion-id-1';
      const messageId = 'message-id-1';
      const complianceReportId = 'compliance-report-id-1';

      const publish = jest.fn().mockImplementation(() => Promise.resolve());
      const patch = jest
        .fn()
        .mockImplementation(() => Promise.resolve({ publish: jest.fn() }));

      const DiscussionRequestObject = {
        text: 'Test discussion message',
        userId: 'user-id-1',
        complianceReportId,
        type: 'compliance-report' as DiscussionType,
      };

      // Mock `createEntry` for messages and discussions
      when(environmentMock.createEntry)
        .calledWith('messages', expect.anything())
        .mockResolvedValue({
          sys: { id: messageId },
          publish,
          patch,
        } as unknown as Entry);

      when(environmentMock.createEntry)
        .calledWith('discussions', expect.anything())
        .mockResolvedValue({
          sys: { id: discussionId },
          publish,
          patch,
        } as unknown as Entry);

      // Mock `getEntry` for compliance reports
      when(environmentMock.getEntry)
        .calledWith(complianceReportId)
        .mockResolvedValue({
          sys: {
            id: complianceReportId,
            type: 'Entry',
            locale: 'en-US',
            version: 1,
          },
          fields: {
            discussion: {
              'en-US': {
                sys: {
                  id: discussionId,
                  linkType: 'Entry',
                  type: 'Link',
                },
              },
            },
          },
          patch,
          publish,
        } as unknown as Entry);

      const result = await discussionDataProviderMock.create(
        DiscussionRequestObject,
      );

      // Assert `createEntry` calls for `messages` and `discussions`
      expect(environmentMock.createEntry).toHaveBeenNthCalledWith(
        1,
        'messages',
        {
          fields: {
            createdBy: {
              'en-US': {
                sys: {
                  id: DiscussionRequestObject.userId,
                  linkType: 'Entry',
                  type: 'Link',
                },
              },
            },
            text: {
              'en-US': DiscussionRequestObject.text,
            },
          },
        },
      );

      expect(environmentMock.createEntry).toHaveBeenCalledWith('discussions', {
        fields: {
          message: {
            'en-US': {
              sys: {
                id: messageId,
                linkType: 'Entry',
                type: 'Link',
              },
            },
          },
        },
      });

      // Assert `getEntry` was called for compliance report
      expect(environmentMock.getEntry).toHaveBeenCalledWith(complianceReportId);

      // Assert `patch` and `publish` calls
      expect(patch).toHaveBeenCalledWith([
        {
          op: 'replace',
          path: '/fields/discussion',
          value: {
            'en-US': {
              sys: {
                id: discussionId,
                linkType: 'Entry',
                type: 'Link',
              },
            },
          },
        },
      ]);

      expect(publish).toHaveBeenCalledTimes(2); // Once for message, once for discussion

      // Assert the result is the discussion ID
      expect(result).toEqual(discussionId);
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
      const discussionId = 'discussion-id-1';
      const result = await discussionDataProviderMock.fetchById(discussionId);

      expect(result).toMatchObject(getDiscussionDataObject());
    });
  });

  describe('Update', () => {
    test('Should update a discussion without existing replies', async () => {
      const discussionId = 'discussion-id-1';
      const userId = 'user-id-1';
      const reply = {
        text: 'test reply',
        userId: userId,
      };

      const replyMock = getEntry({});
      environmentMock.createEntry.mockResolvedValueOnce(replyMock);
      replyMock.publish = jest.fn().mockResolvedValueOnce(replyMock);

      const discussionMock = getEntry({});
      environmentMock.getEntry.mockResolvedValueOnce(discussionMock);
      const discussionMockUpdated = getEntry({});
      discussionMock.patch = jest
        .fn()
        .mockResolvedValueOnce(discussionMockUpdated);

      await discussionDataProviderMock.update(discussionId, { reply });

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
      ]);

      expect(discussionMockUpdated.publish).toHaveBeenCalled();
    });

    test('Should update a discussion with existing replies', async () => {
      const discussionId = 'discussion-id-1';
      const userId = 'user-id-1';
      const reply = {
        text: 'test reply',
        userId: userId,
      };

      const replyMock = getEntry({});
      replyMock.sys.id = 'new-reply';
      environmentMock.createEntry.mockResolvedValueOnce(replyMock);
      replyMock.publish = jest.fn().mockResolvedValueOnce(replyMock);

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
      environmentMock.getEntry.mockResolvedValueOnce(discussionMock);
      const discussionMockUpdated = getEntry({});
      discussionMock.patch = jest
        .fn()
        .mockResolvedValueOnce(discussionMockUpdated);

      await discussionDataProviderMock.update(discussionId, { reply });

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
      ]);

      expect(discussionMockUpdated.publish).toHaveBeenCalled();
    });

    test('Should fail to update a discussion that already ended', async () => {
      const discussionMock = getEntry({
        endedAt: '2025-01-01T10:00:00.000Z',
      });
      environmentMock.getEntry.mockResolvedValueOnce(discussionMock);
      const discussionId = 'discussion-id-1';
      const userId = 'user-id-1';

      await expect(
        discussionDataProviderMock.update(discussionId, { endedBy: userId }),
      ).rejects.toThrow('Cannot update a discussion that has ended.');
    });

    test('Should update a discussion with endedBy and endedAt', async () => {
      const discussionId = 'discussion-id-1';
      const userId = 'user-id-1';

      const discussionMock = getEntry(
        {
          // initial fields
        },
        {
          // initial sys
          id: discussionId,
          publishedVersion: 1,
        },
      );
      environmentMock.getEntry.mockResolvedValueOnce(discussionMock);
      const discussionMockUpdated = getEntry(
        {
          // updated fields
          endedBy: {
            'en-US': {
              sys: {
                id: userId,
                linkType: 'Entry',
                type: 'Link',
              },
            },
          },
          endedAt: {
            'en-US': new Date().toISOString(),
          },
        },
        {
          // updated sys
          id: discussionId,
          publishedVersion: 2,
        },
      );

      discussionMock.patch = jest
        .fn()
        .mockResolvedValueOnce(discussionMockUpdated);
      discussionMockUpdated.publish = jest
        .fn()
        .mockReturnValue(discussionMockUpdated);

      await discussionDataProviderMock.update(discussionId, {
        endedBy: userId,
      });

      expect(environmentMock.getEntry).toHaveBeenCalledWith(discussionId);
      expect(discussionMock.patch).toHaveBeenCalledWith([
        {
          op: 'add',
          path: '/fields/endedAt',
          value: {
            'en-US': expect.any(String),
          },
        },
        {
          op: 'add',
          path: '/fields/endedBy',
          value: {
            'en-US': {
              sys: {
                id: userId,
                linkType: 'Entry',
                type: 'Link',
              },
            },
          },
        },
      ]);

      expect(discussionMockUpdated.publish).toHaveBeenCalled();

      expect(pollContentfulGql).toHaveBeenCalledWith(
        discussionMockUpdated.sys.publishedVersion || Infinity,
        expect.any(Function),
        'discussions',
      );

      expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
        FETCH_DISCUSSION_BY_ID,
        { id: discussionId },
      );
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
