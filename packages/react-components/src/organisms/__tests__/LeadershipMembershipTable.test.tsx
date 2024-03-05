import { render } from '@testing-library/react';
import LeadershipMembershipTable from '../LeadershipMembershipTable';

describe('LeadershipMembershipTable', () => {
  it('renders data', () => {
    const data = [
      {
        name: 'Test Team',
        id: '1',
        leadershipRoleCount: 1,
        previousLeadershipRoleCount: 2,
        memberCount: 3,
        previousMemberCount: 4,
      },
    ];
    const { getByText } = render(<LeadershipMembershipTable data={data} />);
    expect(getByText('Test Team')).toBeInTheDocument();
  });
});
