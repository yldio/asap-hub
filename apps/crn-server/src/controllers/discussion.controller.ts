import { NotFoundError } from '@asap-hub/errors';
import {
  DiscussionResponse,
  ManuscriptFileResponse,
  Reply,
} from '@asap-hub/model';

import { DiscussionDataProvider } from '../data-providers/types';

export default class DiscussionController {
  constructor(private discussionDataProvider: DiscussionDataProvider) {}

  async fetchById(discussionId: string): Promise<DiscussionResponse> {
    const discussion =
      await this.discussionDataProvider.fetchById(discussionId);

    if (!discussion) {
      throw new NotFoundError(
        undefined,
        `Discussion with id ${discussionId} not found`,
      );
    }

    return discussion;
  }

  async update(
    id: string,
    userId: string,
    reply?: Reply,
    manuscriptId?: string,
    notificationList?: string,
    workspaceLink?: string,
  ): Promise<DiscussionResponse> {
    await this.discussionDataProvider.update(id, {
      userId,
      reply,
      notificationList,
      manuscriptId,
      workspaceLink,
    });

    return this.fetchById(id);
  }

  async markAsRead(id: string, userId: string): Promise<DiscussionResponse> {
    await this.discussionDataProvider.update(id, { userId });

    return this.fetchById(id);
  }

  async create(
    userId: string,
    manuscriptId: string,
    title: string,
    text: string,
    files: ManuscriptFileResponse[] | undefined,
    notificationList: string,
    workspaceLink?: string,
  ): Promise<DiscussionResponse> {
    const id = await this.discussionDataProvider.create({
      userId,
      manuscriptId,
      title,
      text,
      files,
      notificationList,
      workspaceLink,
    });

    return this.fetchById(id);
  }
}
