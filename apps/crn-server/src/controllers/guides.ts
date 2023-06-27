import { GuideResponse } from '@asap-hub/model';
import { GuideDataProvider } from '../data-providers/types';

export default class Guide implements GuideController {
  constructor(private guideDataProvider: GuideDataProvider) {}

  async fetch(): Promise<GuideResponse> {
    return this.guideDataProvider.fetch();
  }
}

export interface GuideController {
  fetch: () => Promise<GuideResponse>;
}
