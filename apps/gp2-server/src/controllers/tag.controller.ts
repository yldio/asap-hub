import { gp2 } from '@asap-hub/model';
import { TagDataProvider } from '../data-providers/types';

export default class TagController {
  constructor(private tagDataProvider: TagDataProvider) {}

  async fetch(): Promise<gp2.ListTagsResponse> {
    const { total, items } = await this.tagDataProvider.fetch(null);

    return {
      total,
      items,
    };
  }
}
