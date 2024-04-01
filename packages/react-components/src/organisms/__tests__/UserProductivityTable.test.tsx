import { render } from '@testing-library/react';
import UserProductivityTable from '../UserProductivityTable';

describe('UserProductivityTable', () => {
  it('renders data', () => {
    const data = [
      {
        id: '1',
        name: 'Test User',
        teams: ['Team A'],
        roles: ['Role A'],
        asapOutput: 1,
        asapPublicOutput: 2,
        ratio: 1,
      },
    ];
    const { getByText } = render(<UserProductivityTable data={data} />);
    expect(getByText('Test User')).toBeInTheDocument();
  });

  it('handles multiple teams', () => {
    const data = [
      {
        id: '1',
        name: 'Test User',
        teams: ['Team A', 'Team B'],
        roles: ['Role A'],
        asapOutput: 1,
        asapPublicOutput: 2,
        ratio: 1,
      },
    ];
    const { getByText } = render(<UserProductivityTable data={data} />);
    expect(getByText('Multiple teams')).toBeInTheDocument();
  });

  it('handles multiple roles', () => {
    const data = [
      {
        id: '1',
        name: 'Test User',
        teams: ['Team A'],
        roles: ['Role A', 'Role B'],
        asapOutput: 1,
        asapPublicOutput: 2,
        ratio: 1,
      },
    ];
    const { getByText } = render(<UserProductivityTable data={data} />);
    expect(getByText('Multiple roles')).toBeInTheDocument();
  });
});
