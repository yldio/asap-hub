import { ListGuideResponse } from '@asap-hub/model';
import { GuideDataProvider } from '../data-providers/types';

export default class Guide implements GuideController {
  constructor(private guideDataProvider: GuideDataProvider) {}

  async fetchByCollectionTitle(title: string): Promise<ListGuideResponse> {
    return this.guideDataProvider.fetchByCollectionTitle(title);
  }
}

export interface GuideController {
  fetchByCollectionTitle: (title: string) => Promise<ListGuideResponse>;
}
