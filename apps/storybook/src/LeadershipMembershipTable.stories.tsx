import { initialSortingDirection } from '@asap-hub/model';
import { LeadershipMembershipTable } from '@asap-hub/react-components';
import { ComponentProps } from 'react';

export default {
  title: 'Organisms / Analytics / LeadershipMembershipTable',
};

const props: ComponentProps<typeof LeadershipMembershipTable> = {
  metric: 'interest-group',
  sort: 'team_asc',
  setSort: () => {},
  sortingDirection: initialSortingDirection,
  setSortingDirection: () => {},
  data: [
    {
      id: '1',
      name: 'Team A',
      leadershipRoleCount: 1,
      previousLeadershipRoleCount: 2,
      memberCount: 3,
      previousMemberCount: 4,
    },
    {
      id: '1',
      name: 'Team A',
      leadershipRoleCount: 1,
      previousLeadershipRoleCount: 2,
      memberCount: 3,
      previousMemberCount: 4,
    },
    {
      id: '1',
      name: 'Team A',
      leadershipRoleCount: 1,
      previousLeadershipRoleCount: 2,
      memberCount: 3,
      previousMemberCount: 4,
    },
    {
      id: '1',
      name: 'Team A',
      leadershipRoleCount: 1,
      previousLeadershipRoleCount: 2,
      memberCount: 3,
      previousMemberCount: 4,
    },
  ],
};

export const Normal = () => <LeadershipMembershipTable {...props} />;
