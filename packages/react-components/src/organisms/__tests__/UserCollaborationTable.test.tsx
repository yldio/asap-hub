import {
  SortUserCollaboration,
  TeamRole,
  userCollaborationInitialSortingDirection,
} from '@asap-hub/model';
import { render } from '@testing-library/react';
import { ComponentProps } from 'react';
import UserCollaborationTable, {
  UserCollaborationMetric,
} from '../UserCollaborationTable';

describe('UserCollaborationTable', () => {
  const pageControlsProps = {
    numberOfPages: 1,
    currentPageIndex: 0,
    renderPageHref: () => '',
  };

  const userTeam: UserCollaborationMetric['teams'][number] = {
    id: '1',
    team: 'Team A',
    isTeamInactive: false,
    role: 'Collaborating PI',
    outputsCoAuthored: 2,
  };
  const user: UserCollaborationMetric = {
    id: '1',
    name: 'Test User',
    isAlumni: false,
    teams: [userTeam],
  };

  const performance = {
    belowAverageMin: 1,
    belowAverageMax: 1,
    averageMin: 1,
    averageMax: 1,
    aboveAverageMin: 1,
    aboveAverageMax: 1,
  };

  const defaultProps: ComponentProps<typeof UserCollaborationTable> = {
    ...pageControlsProps,
    performance,
    data: [user],
    type: 'within-team',
    sort: 'user_asc' as SortUserCollaboration,
    setSort: jest.fn(),
    sortingDirection: userCollaborationInitialSortingDirection,
    setSortingDirection: jest.fn(),
  };

  it('renders data', () => {
    const { getByText } = render(<UserCollaborationTable {...defaultProps} />);
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
      <UserCollaborationTable {...defaultProps} data={data} />,
    );
    expect(getByTitle('Alumni Member')).toBeInTheDocument();
  });

  it('displays inactive badge', () => {
    const data: UserCollaborationMetric[] = [
      {
        ...user,
        teams: [{ ...userTeam, team: 'Team A', isTeamInactive: true }],
      },
    ];
    const { getByTitle } = render(
      <UserCollaborationTable {...defaultProps} data={data} />,
    );
    expect(getByTitle('Inactive Team')).toBeInTheDocument();
  });

  it('displays links', () => {
    const data: UserCollaborationMetric[] = [
      {
        ...user,
        name: 'User A',
        teams: [{ ...userTeam, team: 'Team A', id: 'team-id' }],
      },
    ];
    const { getByRole } = render(
      <UserCollaborationTable {...defaultProps} data={data} />,
    );
    expect(getByRole('link', { name: 'User A' })).toBeInTheDocument();
    expect(getByRole('link', { name: 'Team A' })).toBeInTheDocument();
  });

  it('handles multiple teams', () => {
    const data: UserCollaborationMetric[] = [
      {
        ...user,
        teams: [
          { ...userTeam, team: 'Team A' },
          { ...userTeam, team: 'Team B' },
        ],
      },
    ];
    const { getByText } = render(
      <UserCollaborationTable {...defaultProps} data={data} />,
    );
    expect(getByText('Multiple teams')).toBeInTheDocument();
  });

  it('handles multiple roles', () => {
    const data: UserCollaborationMetric[] = [
      {
        ...user,
        teams: [
          { ...userTeam, team: 'Team A', role: 'Co-PI (Core Leadership)' },
          { ...userTeam, team: 'Team B', role: 'Key Personnel' },
        ],
      },
    ];
    const { getByText } = render(
      <UserCollaborationTable {...defaultProps} data={data} />,
    );
    expect(getByText('Multiple roles')).toBeInTheDocument();
  });

  it('handles multiple values', () => {
    const data: UserCollaborationMetric[] = [
      {
        ...user,
        teams: [
          { ...userTeam, team: 'Team A', outputsCoAuthored: 4 },
          { ...userTeam, team: 'Team B', outputsCoAuthored: 2 },
        ],
      },
    ];
    const { getByText } = render(
      <UserCollaborationTable {...defaultProps} data={data} />,
    );
    expect(getByText('Multiple values')).toBeInTheDocument();
  });

  it('displays no team', () => {
    const data: UserCollaborationMetric[] = [
      {
        ...user,
        teams: [],
      },
    ];
    const { getByText } = render(
      <UserCollaborationTable {...defaultProps} data={data} />,
    );
    expect(getByText('No team')).toBeInTheDocument();
  });

  it('displays no role', () => {
    const data: UserCollaborationMetric[] = [
      {
        ...user,
        teams: [{ ...userTeam, role: null as unknown as TeamRole }],
      },
    ];
    const { getByText } = render(
      <UserCollaborationTable {...defaultProps} data={data} />,
    );
    expect(getByText('No role')).toBeInTheDocument();
  });

  it('displays 0 in outputs co-authored column if there are no teams for user', () => {
    const data: UserCollaborationMetric[] = [
      {
        ...user,
        teams: [],
      },
    ];
    const { getByText } = render(
      <UserCollaborationTable {...defaultProps} data={data} />,
    );
    expect(getByText('0')).toBeVisible();
  });
});
