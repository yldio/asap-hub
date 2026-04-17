import { ArticleItem } from '@asap-hub/model';
import { AimsMilestonesDataProvider } from '../data-providers/types';

export default class MilestoneController {
  constructor(private aimsMilestonesDataProvider: AimsMilestonesDataProvider) {}

  async fetchArticles(
    milestoneId: string,
  ): Promise<ReadonlyArray<ArticleItem>> {
    return this.aimsMilestonesDataProvider.fetchArticlesForMilestone(
      milestoneId,
    );
  }

  async updateArticles(
    milestoneId: string,
    articleIds: string[],
  ): Promise<void> {
    return this.aimsMilestonesDataProvider.updateArticlesForMilestone(
      milestoneId,
      articleIds,
    );
  }
}
