import { gp2 } from '@asap-hub/model';
import { KeywordsDataProvider } from '../data-providers/types';

export default class KeywordsController {
  constructor(private keywordsDataProvider: KeywordsDataProvider) {}

  async fetch(): Promise<gp2.ListKeywordsResponse> {
    const { total, items } = await this.keywordsDataProvider.fetch(null);

    return {
      total,
      items,
    };
  }
}
