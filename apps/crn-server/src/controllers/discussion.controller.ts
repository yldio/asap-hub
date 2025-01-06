import { NotFoundError } from '@asap-hub/errors';
import { DiscussionResponse, MessageCreateDataObject } from '@asap-hub/model';

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
    reply: MessageCreateDataObject,
  ): Promise<DiscussionResponse> {
    await this.discussionDataProvider.update(id, { reply });

    return this.fetchById(id);
  }

  async endDiscussion(
    id: string,
    endedBy: string,
  ): Promise<DiscussionResponse> {
    await this.discussionDataProvider.update(id, { endedBy });

    return this.fetchById(id);
  }

  async create(message: MessageCreateDataObject): Promise<DiscussionResponse> {
    const id = await this.discussionDataProvider.create(message);

    return this.fetchById(id);
  }
}
