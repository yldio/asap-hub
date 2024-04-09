import { TeamRole, UserProductivityResponse } from '@asap-hub/model';
import { render } from '@testing-library/react';
import UserProductivityTable from '../UserProductivityTable';

describe('UserProductivityTable', () => {
  const pageControlsProps = {
    numberOfPages: 1,
    currentPageIndex: 0,
    renderPageHref: () => '',
  };

  const userTeam: UserProductivityResponse['teams'][number] = {
    team: 'Team A',
    isTeamInactive: false,
    isUserInactiveOnTeam: false,
    role: 'Collaborating PI',
  };
  const user: UserProductivityResponse = {
    id: '1',
    name: 'Test User',
    isAlumni: false,
    teams: [userTeam],
    asapOutput: 1,
    asapPublicOutput: 2,
    ratio: '0.50',
  };

  it('renders data', () => {
    const data = [user];
    const { getByText } = render(
      <UserProductivityTable data={data} {...pageControlsProps} />,
    );
    expect(getByText('Test User')).toBeInTheDocument();
  });

  it('displays alumni badge', () => {
    const data = [
      {
        ...user,
        isAlumni: true,
      },
    ];
    const { getByTitle } = render(
      <UserProductivityTable data={data} {...pageControlsProps} />,
    );
    expect(getByTitle('Alumni Member')).toBeInTheDocument();
  });

  it('displays inactive badge', () => {
    const data: UserProductivityResponse[] = [
      {
        ...user,
        teams: [{ ...userTeam, team: 'Team A', isTeamInactive: true }],
      },
    ];
    const { getByTitle } = render(
      <UserProductivityTable data={data} {...pageControlsProps} />,
    );
    expect(getByTitle('Inactive Team')).toBeInTheDocument();
  });

  it('handles multiple teams', () => {
    const data: UserProductivityResponse[] = [
      {
        ...user,
        teams: [
          { ...userTeam, team: 'Team A' },
          { ...userTeam, team: 'Team B' },
        ],
      },
    ];
    const { getByText } = render(
      <UserProductivityTable data={data} {...pageControlsProps} />,
    );
    expect(getByText('Multiple teams')).toBeInTheDocument();
  });

  it('handles multiple roles', () => {
    const data: UserProductivityResponse[] = [
      {
        ...user,
        teams: [
          { ...userTeam, team: 'Team A', role: 'Co-PI (Core Leadership)' },
          { ...userTeam, team: 'Team B', role: 'Key Personnel' },
        ],
      },
    ];
    const { getByText } = render(
      <UserProductivityTable data={data} {...pageControlsProps} />,
    );
    expect(getByText('Multiple roles')).toBeInTheDocument();
  });

  it('display no team', () => {
    const data: UserProductivityResponse[] = [
      {
        ...user,
        teams: [],
      },
    ];
    const { getByText } = render(
      <UserProductivityTable data={data} {...pageControlsProps} />,
    );
    expect(getByText('No team')).toBeInTheDocument();
  });

  it('display no role', () => {
    const data: UserProductivityResponse[] = [
      {
        ...user,
        teams: [{ ...userTeam, role: null as unknown as TeamRole }],
      },
    ];
    const { getByText } = render(
      <UserProductivityTable data={data} {...pageControlsProps} />,
    );
    expect(getByText('No role')).toBeInTheDocument();
  });
});
