import {
  addLocaleToFields,
  Environment,
  FetchDiscussionByIdQuery,
  FetchDiscussionByIdQueryVariables,
  FETCH_DISCUSSION_BY_ID,
  getLinkEntity,
  GraphQLClient,
  patchAndPublish,
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

type Discussion = NonNullable<FetchDiscussionByIdQuery['discussions']>;
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

    return parseGraphqlDiscussion(discussions);
  }

  async create(input: MessageCreateDataObject): Promise<string> {
    const environment = await this.getRestClient();

    const messageId = await createAndPublishMessage(environment, input);

    const discussionEntry = await environment.createEntry('discussions', {
      fields: addLocaleToFields({
        message: getLinkEntity(messageId),
      }),
    });

    await discussionEntry.publish();

    return discussionEntry.sys.id;
  }

  async update(id: string, update: DiscussionUpdateDataObject): Promise<void> {
    const environment = await this.getRestClient();

    const publishedReplyId = await createAndPublishMessage(
      environment,
      update.reply,
    );

    const discussion = await environment.getEntry(id);

    const previousReplies = discussion.fields.replies
      ? discussion.fields.replies['en-US']
      : [];

    const newReply = getLinkEntity(publishedReplyId);

    await patchAndPublish(discussion, {
      replies: [...previousReplies, newReply],
    });
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

const parseGraphqlMessage = (message: MessageItem): Message => ({
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

export const parseGraphqlDiscussion = (
  discussion: Discussion,
): DiscussionDataObject => ({
  id: discussion.sys.id,
  message: parseGraphqlMessage(discussion.message),
  replies: discussion.repliesCollection?.items.map(parseGraphqlMessage),
});
