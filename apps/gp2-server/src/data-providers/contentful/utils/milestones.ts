import { gp2 as gp2Model } from '@asap-hub/model';
import { GraphQLProject } from '../project.data-provider';
import { GraphQLWorkingGroup } from '../working-group.data-provider';

export type GraphQLProjectMilestone = NonNullable<
  NonNullable<GraphQLProject['milestonesCollection']>
>['items'][number];
export type GraphQLWorkingGroupMilestone = NonNullable<
  NonNullable<GraphQLWorkingGroup['milestonesCollection']>
>['items'][number];

export const parseMilestones = (
  milestones:
    | GraphQLWorkingGroup['milestonesCollection']
    | GraphQLProject['milestonesCollection'],
) =>
  milestones?.items.reduce(
    (
      milestoneList: gp2Model.Milestone[],
      milestone: GraphQLProjectMilestone | GraphQLWorkingGroupMilestone,
    ) =>
      milestone
        ? [
            ...milestoneList,
            {
              title: milestone.title || '',
              status: milestone.status as gp2Model.MilestoneStatus,
              link: milestone.externalLink || undefined,
              description: milestone.description || undefined,
            },
          ]
        : milestoneList,
    [],
  ) || [];
