import { gp2 } from '@asap-hub/model';
import { KeywordDataProvider } from '../data-providers/types';

export default class KeywordController {
  constructor(private keywordDataProvider: KeywordDataProvider) {}

  async fetch(): Promise<gp2.ListKeywordsResponse> {
    const { total, items } = await this.keywordDataProvider.fetch(null);

    return {
      total,
      items,
    };
  }
}
