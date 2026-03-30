import { ArticleItem } from '@asap-hub/model';
import { AimsMilestonesDataProvider } from '../data-providers/types';

export default class AimController {
  constructor(private aimsMilestonesDataProvider: AimsMilestonesDataProvider) {}

  async fetchArticles(aimId: string): Promise<ReadonlyArray<ArticleItem>> {
    return this.aimsMilestonesDataProvider.fetchArticlesForAim(aimId);
  }
}
