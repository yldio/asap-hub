import { NotFoundError } from '@asap-hub/errors';
import {
  DiscussionResponse,
  DiscussionUpdateDataObject,
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
    reply: DiscussionUpdateDataObject,
  ): Promise<DiscussionResponse> {
    await this.discussionDataProvider.update(id, reply);

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
  ): Promise<DiscussionResponse> {
    const id = await this.discussionDataProvider.create({
      userId,
      manuscriptId,
      title,
      text,
    });

    return this.fetchById(id);
  }
}
