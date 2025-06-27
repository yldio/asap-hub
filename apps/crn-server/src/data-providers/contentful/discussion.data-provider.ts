import {
  addLocaleToFields,
  Environment,
  FetchDiscussionByIdQuery,
  FetchDiscussionByIdQueryVariables,
  FETCH_DISCUSSION_BY_ID,
  getLinkEntity,
  GraphQLClient,
  Link,
  patchAndPublish,
} from '@asap-hub/contentful';
import {
  DiscussionCreateDataObject,
  DiscussionDataObject,
  DiscussionUpdateDataObject,
  ListResponse,
  Message,
} from '@asap-hub/model';
import { parseUserDisplayName } from '@asap-hub/server-common';
import { EmailNotificationService } from '../email-notification-service';
import { DiscussionDataProvider } from '../types';

export type Discussion = NonNullable<FetchDiscussionByIdQuery['discussions']>;
type MessageItem = Discussion['message'];

export class DiscussionContentfulDataProvider
  implements DiscussionDataProvider
{
  private emailNotificationService: EmailNotificationService;

  constructor(
    private contentfulClient: GraphQLClient,
    private getRestClient: () => Promise<Environment>,
  ) {
    this.emailNotificationService = new EmailNotificationService(
      this.contentfulClient,
    );
  }

  async fetch(): Promise<ListResponse<DiscussionDataObject>> {
    throw new Error('Method not implemented.');
  }

  async fetchById(id: string): Promise<DiscussionDataObject | null> {
    const { discussions } = await this.contentfulClient.request<
      FetchDiscussionByIdQuery,
      FetchDiscussionByIdQueryVariables
    >(FETCH_DISCUSSION_BY_ID, { id });

    if (!discussions) {
      return null;
    }

    return parseGraphQLDiscussion(discussions);
  }

  async create(input: DiscussionCreateDataObject): Promise<string> {
    const environment = await this.getRestClient();
    const { userId, manuscriptId, title, text, notificationList } = input;

    const messageId = await createAndPublishMessage(environment, {
      text,
      userId,
    });

    const discussionEntry = await environment.createEntry('discussions', {
      fields: addLocaleToFields({
        title,
        message: getLinkEntity(messageId),
        // The person who is creating the discussion
        // should not see the thread as unread
        // so we need to add the user to the readBy list
        readBy: [getLinkEntity(userId)],
      }),
    });

    await discussionEntry.publish();

    const manuscript = await environment.getEntry(manuscriptId);

    await patchAndPublish(manuscript, {
      discussions: [
        ...(manuscript.fields?.discussions?.['en-US'] || []),
        getLinkEntity(discussionEntry.sys.id),
      ],
    });

    const user = await environment.getEntry(userId);
    const isOpenScienceMember = !!user.fields?.openScienceTeamMember?.['en-US'];

    await this.emailNotificationService.sendEmailNotification(
      isOpenScienceMember
        ? 'discussion_created_by_os_member'
        : 'discussion_created_by_grantee',
      manuscriptId,
      notificationList || '',
      {
        id: discussionEntry.sys.id,
        userName: `${user.fields.firstName['en-US']} ${user.fields.lastName['en-US']}`,
      },
    );

    return discussionEntry.sys.id;
  }

  async update(id: string, update: DiscussionUpdateDataObject): Promise<void> {
    const environment = await this.getRestClient();
    const discussion = await environment.getEntry(id);

    const { notificationList, reply, manuscriptId, userId } = update;

    if (reply?.text) {
      const publishedReplyId = await createAndPublishMessage(environment, {
        text: reply.text,
        userId,
      });

      const previousReplies = discussion.fields.replies
        ? discussion.fields.replies['en-US']
        : [];

      const newReply = getLinkEntity(publishedReplyId);

      await patchAndPublish(discussion, {
        replies: [...previousReplies, newReply],
        // The person who is replying to the discussion
        // should not see the thread as unread
        // so we need to add the user to the readBy list
        readBy: [getLinkEntity(update.userId)],
      });

      if (manuscriptId) {
        const user = await environment.getEntry(userId);
        await this.emailNotificationService.sendEmailNotification(
          reply.isOpenScienceMember
            ? 'os_member_replied_to_discussion'
            : 'grantee_replied_to_discussion',
          manuscriptId,
          notificationList || '',
          {
            id,
            userName: `${user.fields.firstName['en-US']} ${user.fields.lastName['en-US']}`,
          },
        );
      }
    } else {
      const previousReadBy = discussion.fields.readBy
        ? discussion.fields.readBy['en-US']
        : [];

      const previousReadByIds = previousReadBy.map(
        (readBy: Link<string>) => readBy.sys.id,
      );
      if (!previousReadByIds.includes(update.userId)) {
        const newReadBy = getLinkEntity(update.userId);
        await patchAndPublish(discussion, {
          readBy: [...previousReadBy, newReadBy],
        });
      }
    }
  }
}

const createAndPublishMessage = async (
  environment: Environment,
  message: { text: string; userId: string },
) => {
  const { text, userId } = message;
  const user = getLinkEntity(userId);

  const messageEntry = await environment.createEntry('messages', {
    fields: addLocaleToFields({
      text,
      createdBy: user,
    }),
  });

  await messageEntry.publish();
  return messageEntry.sys.id;
};

const parseGraphQLMessage = (message: MessageItem): Message => ({
  text: message?.text || '',
  createdBy: {
    id: message?.createdBy?.sys.id || '',
    firstName: message?.createdBy?.firstName || '',
    lastName: message?.createdBy?.lastName || '',
    displayName: parseUserDisplayName(
      message?.createdBy?.firstName || '',
      message?.createdBy?.lastName || '',
      undefined,
      message?.createdBy?.nickname || '',
    ),
    avatarUrl: message?.createdBy?.avatar?.url || undefined,
    alumniSinceDate: message?.createdBy?.alumniSinceDate || undefined,
    teams:
      message?.createdBy?.teamsCollection?.items.map((teamItem) => ({
        id: teamItem?.team?.sys.id || '',
        name: teamItem?.team?.displayName || '',
      })) || [],
  },
  createdDate: message?.sys.publishedAt,
});

export const parseGraphQLDiscussion = (
  discussion: Discussion,
): DiscussionDataObject => ({
  id: discussion.sys.id,
  message: parseGraphQLMessage(discussion.message),
  replies: discussion.repliesCollection?.items.map(parseGraphQLMessage),
});
