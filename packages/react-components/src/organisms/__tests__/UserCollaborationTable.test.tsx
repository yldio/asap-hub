import {
  SortUserCollaboration,
  TeamRole,
  userCollaborationInitialSortingDirection,
} from '@asap-hub/model';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  it.each`
    collaborationType | sort                                | sortingDirection                                                              | iconTitle                                                        | newSort                             | newSortingDirection
    ${'within-team'}  | ${'user_asc'}                       | ${{ ...userCollaborationInitialSortingDirection, user: 'asc' }}               | ${'User Active Alphabetical Ascending Sort Icon'}                | ${'user_desc'}                      | ${{ ...userCollaborationInitialSortingDirection, user: 'desc' }}
    ${'within-team'}  | ${'user_desc'}                      | ${{ ...userCollaborationInitialSortingDirection, user: 'desc' }}              | ${'User Active Alphabetical Descending Sort Icon'}               | ${'user_asc'}                       | ${{ ...userCollaborationInitialSortingDirection, user: 'asc' }}
    ${'within-team'}  | ${'role_asc'}                       | ${{ ...userCollaborationInitialSortingDirection, role: 'asc' }}               | ${'User Inactive Alphabetical Ascending Sort Icon'}              | ${'user_asc'}                       | ${{ ...userCollaborationInitialSortingDirection, user: 'asc' }}
    ${'within-team'}  | ${'user_desc'}                      | ${{ ...userCollaborationInitialSortingDirection, role: 'asc' }}               | ${'Role Inactive Alphabetical Ascending Sort Icon'}              | ${'role_asc'}                       | ${{ ...userCollaborationInitialSortingDirection, role: 'asc' }}
    ${'within-team'}  | ${'role_asc'}                       | ${{ ...userCollaborationInitialSortingDirection, role: 'asc' }}               | ${'Role Active Alphabetical Ascending Sort Icon'}                | ${'role_desc'}                      | ${{ ...userCollaborationInitialSortingDirection, role: 'desc' }}
    ${'within-team'}  | ${'role_desc'}                      | ${{ ...userCollaborationInitialSortingDirection, role: 'desc' }}              | ${'Role Active Alphabetical Descending Sort Icon'}               | ${'role_asc'}                       | ${{ ...userCollaborationInitialSortingDirection, role: 'asc' }}
    ${'within-team'}  | ${'user_desc'}                      | ${{ ...userCollaborationInitialSortingDirection, team: 'asc' }}               | ${'Team Inactive Alphabetical Ascending Sort Icon'}              | ${'team_asc'}                       | ${{ ...userCollaborationInitialSortingDirection, team: 'asc' }}
    ${'within-team'}  | ${'team_asc'}                       | ${{ ...userCollaborationInitialSortingDirection, team: 'asc' }}               | ${'Team Active Alphabetical Ascending Sort Icon'}                | ${'team_desc'}                      | ${{ ...userCollaborationInitialSortingDirection, team: 'desc' }}
    ${'within-team'}  | ${'team_desc'}                      | ${{ ...userCollaborationInitialSortingDirection, team: 'desc' }}              | ${'Team Active Alphabetical Descending Sort Icon'}               | ${'team_asc'}                       | ${{ ...userCollaborationInitialSortingDirection, team: 'asc' }}
    ${'within-team'}  | ${'user_desc'}                      | ${{ ...userCollaborationInitialSortingDirection, outputsCoAuthored: 'desc' }} | ${'Outputs Co-Authored Inactive Numerical Descending Sort Icon'} | ${'outputs_coauthored_within_desc'} | ${{ ...userCollaborationInitialSortingDirection, outputsCoAuthored: 'desc' }}
    ${'within-team'}  | ${'outputs_coauthored_within_asc'}  | ${{ ...userCollaborationInitialSortingDirection, outputsCoAuthored: 'asc' }}  | ${'Outputs Co-Authored Active Numerical Ascending Sort Icon'}    | ${'outputs_coauthored_within_desc'} | ${{ ...userCollaborationInitialSortingDirection, outputsCoAuthored: 'desc' }}
    ${'within-team'}  | ${'outputs_coauthored_within_desc'} | ${{ ...userCollaborationInitialSortingDirection, outputsCoAuthored: 'desc' }} | ${'Outputs Co-Authored Active Numerical Descending Sort Icon'}   | ${'outputs_coauthored_within_asc'}  | ${{ ...userCollaborationInitialSortingDirection, outputsCoAuthored: 'asc' }}
    ${'across-teams'} | ${'user_desc'}                      | ${{ ...userCollaborationInitialSortingDirection, outputsCoAuthored: 'desc' }} | ${'Outputs Co-Authored Inactive Numerical Descending Sort Icon'} | ${'outputs_coauthored_across_desc'} | ${{ ...userCollaborationInitialSortingDirection, outputsCoAuthored: 'desc' }}
    ${'across-teams'} | ${'outputs_coauthored_within_asc'}  | ${{ ...userCollaborationInitialSortingDirection, outputsCoAuthored: 'asc' }}  | ${'Outputs Co-Authored Active Numerical Ascending Sort Icon'}    | ${'outputs_coauthored_across_desc'} | ${{ ...userCollaborationInitialSortingDirection, outputsCoAuthored: 'desc' }}
    ${'across-teams'} | ${'outputs_coauthored_within_desc'} | ${{ ...userCollaborationInitialSortingDirection, outputsCoAuthored: 'desc' }} | ${'Outputs Co-Authored Active Numerical Descending Sort Icon'}   | ${'outputs_coauthored_across_asc'}  | ${{ ...userCollaborationInitialSortingDirection, outputsCoAuthored: 'asc' }}
  `(
    'when sort is $sort and user clicks on $iconTitle, the new sort becomes $newSort and the sorting direction $newSortingDirection',
    ({
      collaborationType,
      sort,
      sortingDirection,
      iconTitle,
      newSort,
      newSortingDirection,
    }) => {
      const setSort = jest.fn();
      const setSortingDirection = jest.fn();
      const { getByTitle } = render(
        <UserCollaborationTable
          {...defaultProps}
          sort={sort}
          setSort={setSort}
          sortingDirection={sortingDirection}
          setSortingDirection={setSortingDirection}
          type={collaborationType}
        />,
      );

      const sortIcon = getByTitle(iconTitle);
      expect(sortIcon).toBeInTheDocument();

      userEvent.click(sortIcon);
      expect(setSort).toHaveBeenCalledWith(newSort);
      expect(setSortingDirection).toHaveBeenCalledWith(newSortingDirection);
    },
  );
});
