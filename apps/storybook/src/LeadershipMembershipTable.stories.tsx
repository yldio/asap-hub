import { LeadershipMembershipTable } from '@asap-hub/react-components';

export default {
  title: 'Organisms / Analytics / LeadershipMembershipTable',
};

const props = {
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
