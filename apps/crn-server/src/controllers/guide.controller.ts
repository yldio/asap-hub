import { ListGuideResponse } from '@asap-hub/model';
import { GuideDataProvider } from '../data-providers/types';

export default class GuideController {
  constructor(private guideDataProvider: GuideDataProvider) {}

  async fetchByCollectionTitle(title: string): Promise<ListGuideResponse> {
    return this.guideDataProvider.fetchByCollectionTitle(title);
  }
}
