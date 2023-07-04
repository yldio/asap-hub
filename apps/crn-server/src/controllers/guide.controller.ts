import { ListGuideResponse } from '@asap-hub/model';
import { GuideDataProvider } from '../data-providers/types';

export default class GuideController {
  constructor(private guideDataProvider: GuideDataProvider) {}

  async fetch(): Promise<ListGuideResponse> {
    return this.guideDataProvider.fetch();
  }
}
