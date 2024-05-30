import { userProductivityPerformance } from '@asap-hub/fixtures';
import { TeamRole, UserProductivityResponse } from '@asap-hub/model';
import { render } from '@testing-library/react';
import { ComponentProps } from 'react';
import UserProductivityTable from '../UserProductivityTable';

describe('UserProductivityTable', () => {
  const pageControlsProps = {
    numberOfPages: 1,
    currentPageIndex: 0,
    renderPageHref: () => '',
  };

  const defaultProps: ComponentProps<typeof UserProductivityTable> = {
    ...pageControlsProps,
    performance: userProductivityPerformance,
    data: [],
  };

  const userTeam: UserProductivityResponse['teams'][number] = {
    team: 'Team A',
    id: '1',
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
    ratio: '0.10',
  };

  it('renders data', () => {
    const data = [user];
    const { getByText } = render(
      <UserProductivityTable {...defaultProps} data={data} />,
    );
    expect(getByText('Test User')).toBeInTheDocument();
  });

  it('displays the caption and icon in row values', () => {
    const data = [user];
    const { getByText, getAllByTitle } = render(
      <UserProductivityTable {...defaultProps} data={data} />,
    );
    expect(getByText('ASAP Output:')).toBeVisible();
    expect(getByText('ASAP Public Output:')).toBeVisible();
    expect(getByText('Ratio:')).toBeVisible();
    expect(getAllByTitle('Below Average').length).toEqual(5);
    expect(getAllByTitle('Average').length).toEqual(4);
    expect(getAllByTitle('Above Average').length).toEqual(3);
  });

  it('displays alumni badge', () => {
    const data = [
      {
        ...user,
        isAlumni: true,
      },
    ];
    const { getByTitle } = render(
      <UserProductivityTable {...defaultProps} data={data} />,
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
      <UserProductivityTable {...defaultProps} data={data} />,
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
      <UserProductivityTable {...defaultProps} data={data} />,
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
      <UserProductivityTable {...defaultProps} data={data} />,
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
      <UserProductivityTable {...defaultProps} data={data} />,
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
      <UserProductivityTable {...defaultProps} data={data} />,
    );
    expect(getByText('No role')).toBeInTheDocument();
  });
});
