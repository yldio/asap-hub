import {
  Milestone,
  MilestoneStatus,
  ListProjectMilestonesResponse,
} from '@asap-hub/model';

type FixtureOptions = {
  key: string | number;
  articleCount?: number;
  status?: MilestoneStatus;
};

export const createProjectMilestoneResponse = ({
  key,
  articleCount = 0,
  status = 'In Progress',
}: FixtureOptions): Milestone => ({
  id: `uuid-${key}`,
  articleCount,
  description: `${key} description`,
  status,
  aims: '1',
});

export const createListProjectMilestoneResponse = (
  items = 10,
  total = 10,
): ListProjectMilestonesResponse => ({
  total,
  items: Array.from({ length: items }, (_, idx) => ({
    ...createProjectMilestoneResponse({ key: idx + 1 }),
  })),
});

export default createProjectMilestoneResponse;
