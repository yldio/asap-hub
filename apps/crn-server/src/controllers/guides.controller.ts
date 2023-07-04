import { ListGuideResponse } from '@asap-hub/model';
import { GuideDataProvider } from '../data-providers/types';

export default class Guide implements GuideController {
  constructor(private guideDataProvider: GuideDataProvider) {}

  async fetch(): Promise<ListGuideResponse> {
    return this.guideDataProvider.fetch();
  }
}

export interface GuideController {
  fetch: () => Promise<ListGuideResponse>;
}
