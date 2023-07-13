import { gp2 as gp2Model } from '@asap-hub/model';
import { GraphQLProject } from '../project.data-provider';
import { GraphQLWorkingGroup } from '../working-group.data-provider';

type MilestonesItem =
  | GraphQLWorkingGroup['milestonesCollection']
  | GraphQLProject['milestonesCollection'];

type MilestoneItem = NonNullable<NonNullable<MilestonesItem>['items'][number]>;
export const parseMilestones = (milestones: MilestonesItem) =>
  milestones?.items
    .filter((milestone): milestone is MilestoneItem => milestone !== null)
    .map((milestone: MilestoneItem) => ({
      title: milestone.title ?? '',
      status: milestone.status as gp2Model.MilestoneStatus,
      link: milestone.externalLink ?? undefined,
      description: milestone.description ?? undefined,
    })) || [];
