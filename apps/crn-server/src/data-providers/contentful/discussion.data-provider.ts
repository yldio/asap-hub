import {
  addLocaleToFields,
  Environment,
  FetchDiscussionByIdQuery,
  FetchDiscussionByIdQueryVariables,
  FETCH_DISCUSSION_BY_ID,
  getLinkEntity,
  GraphQLClient,
  patchAndPublish,
  pollContentfulGql,
} from '@asap-hub/contentful';
import {
  DiscussionDataObject,
  DiscussionUpdateDataObject,
  MessageCreateDataObject,
  ListResponse,
  Message,
} from '@asap-hub/model';
import { parseUserDisplayName } from '@asap-hub/server-common';
import { DiscussionDataProvider } from '../types';

export type Discussion = NonNullable<FetchDiscussionByIdQuery['discussions']>;
type MessageItem = Discussion['message'];

export class DiscussionContentfulDataProvider
  implements DiscussionDataProvider
{
  constructor(
    private contentfulClient: GraphQLClient,
    private getRestClient: () => Promise<Environment>,
  ) {}

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

  async create(input: MessageCreateDataObject): Promise<string> {
    const environment = await this.getRestClient();
    const { text, userId, complianceReportId, type } = input;

    const messageId = await createAndPublishMessage(environment, {
      text,
      userId,
    });

    const discussionEntry = await environment.createEntry('discussions', {
      fields: addLocaleToFields({
        message: getLinkEntity(messageId),
      }),
    });

    await discussionEntry.publish();

    if (complianceReportId && type === 'compliance-report') {
      const complianceReport = await environment.getEntry(complianceReportId);

      await patchAndPublish(complianceReport, {
        discussion: getLinkEntity(discussionEntry.sys.id),
      });
    }
    return discussionEntry.sys.id;
  }

  async update(id: string, update: DiscussionUpdateDataObject): Promise<void> {
    const environment = await this.getRestClient();
    const discussion = await environment.getEntry(id);

    if (discussion.fields.endedAt) {
      throw new Error('Cannot update a discussion that has ended.');
    }

    if (update.reply) {
      const publishedReplyId = await createAndPublishMessage(
        environment,
        update.reply,
      );

      const previousReplies = discussion.fields.replies
        ? discussion.fields.replies['en-US']
        : [];

      const newReply = getLinkEntity(publishedReplyId);

      await patchAndPublish(discussion, {
        replies: [...previousReplies, newReply],
      });
      return;
    }

    if (update.endedBy) {
      const endedBy = getLinkEntity(update.endedBy);

      const published = await patchAndPublish(discussion, {
        endedAt: new Date().toISOString(),
        endedBy,
      });

      const fetchDiscussionById = async () =>
        await this.contentfulClient.request<
          FetchDiscussionByIdQuery,
          FetchDiscussionByIdQueryVariables
        >(FETCH_DISCUSSION_BY_ID, { id });

      await pollContentfulGql<FetchDiscussionByIdQuery>(
        published.sys.publishedVersion || Infinity,
        fetchDiscussionById,
        'discussions',
      );
    }
  }
}

const createAndPublishMessage = async (
  environment: Environment,
  message: MessageCreateDataObject,
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
