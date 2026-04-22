import { ArticleItem } from '@asap-hub/model';
import { NotFoundError } from '@asap-hub/errors';
import { AimsMilestonesDataProvider } from '../data-providers/types';

export default class MilestoneController {
  constructor(private aimsMilestonesDataProvider: AimsMilestonesDataProvider) {}

  async fetchById(milestoneId: string): Promise<{ projectId: string }> {
    const aimIds =
      await this.aimsMilestonesDataProvider.fetchAimIdsLinkedToMilestone(
        milestoneId,
      );

    for (const aimId of aimIds) {
      const project =
        await this.aimsMilestonesDataProvider.fetchProjectWithAimsDetailByAimId(
          aimId,
        );
      if (project) {
        return { projectId: project.sys.id };
      }
    }

    throw new NotFoundError(
      undefined,
      `Project for milestone ${milestoneId} not found`,
    );
  }

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
