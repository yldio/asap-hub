import { render } from '@testing-library/react';
import UserProductivityTable from '../UserProductivityTable';

describe('UserProductivityTable', () => {
  const user = {
    id: '1',
    name: 'Test User',
    alumni: false,
    teams: [{ name: 'Team A', active: true }],
    roles: ['Role A'],
    asapOutput: 1,
    asapPublicOutput: 2,
    ratio: 1,
  };

  it('renders data', () => {
    const data = [user];
    const { getByText } = render(<UserProductivityTable data={data} />);
    expect(getByText('Test User')).toBeInTheDocument();
  });

  it('displays alumni badge', () => {
    const data = [
      {
        ...user,
        alumni: true,
      },
    ];
    const { getByTitle } = render(<UserProductivityTable data={data} />);
    expect(getByTitle('Alumni Badge')).toBeInTheDocument();
  });

  it('displays inactive badge', () => {
    const data = [
      {
        ...user,
        teams: [{ name: 'Team A', active: false }],
      },
    ];
    const { getByTitle } = render(<UserProductivityTable data={data} />);
    expect(getByTitle('Inactive')).toBeInTheDocument();
  });

  it('handles multiple teams', () => {
    const data = [
      {
        ...user,
        teams: [
          { name: 'Team A', active: true },
          { name: 'Team B', active: true },
        ],
      },
    ];
    const { getByText } = render(<UserProductivityTable data={data} />);
    expect(getByText('Multiple teams')).toBeInTheDocument();
  });

  it('handles multiple roles', () => {
    const data = [
      {
        ...user,
        roles: ['Role A', 'Role B'],
      },
    ];
    const { getByText } = render(<UserProductivityTable data={data} />);
    expect(getByText('Multiple roles')).toBeInTheDocument();
  });

  it('display no team', () => {
    const data = [
      {
        ...user,
        teams: [],
      },
    ];
    const { getByText } = render(<UserProductivityTable data={data} />);
    expect(getByText('No team')).toBeInTheDocument();
  });

  it('display no role', () => {
    const data = [
      {
        ...user,
        roles: [],
      },
    ];
    const { getByText } = render(<UserProductivityTable data={data} />);
    expect(getByText('No role')).toBeInTheDocument();
  });
});
