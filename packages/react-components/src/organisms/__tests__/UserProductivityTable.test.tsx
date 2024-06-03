import { userProductivityPerformance } from '@asap-hub/fixtures';
import {
  SortUserProductivity,
  TeamRole,
  userProductivityInitialSortingDirection,
  UserProductivityResponse,
} from '@asap-hub/model';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
    sort: 'user_asc' as SortUserProductivity,
    setSort: jest.fn(),
    sortingDirection: userProductivityInitialSortingDirection,
    setSortingDirection: jest.fn(),
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

  it('displays links', () => {
    const data: UserProductivityResponse[] = [
      {
        ...user,
        name: 'User A',
        teams: [{ ...userTeam, team: 'Team A', id: 'team-id' }],
      },
    ];
    const { getByRole } = render(
      <UserProductivityTable {...defaultProps} data={data} />,
    );
    expect(getByRole('link', { name: 'User A' })).toBeInTheDocument();
    expect(getByRole('link', { name: 'Team A' })).toBeInTheDocument();
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

  it('displays no team', () => {
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

  it('displays no role', () => {
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

  it.each`
    sort                         | sortingDirection                                                            | iconTitle                                                       | newSort                      | newSortingDirection
    ${'user_asc'}                | ${{ ...userProductivityInitialSortingDirection, user: 'asc' }}              | ${'User Active Alphabetical Ascending Sort Icon'}               | ${'user_desc'}               | ${{ ...userProductivityInitialSortingDirection, user: 'desc' }}
    ${'user_desc'}               | ${{ ...userProductivityInitialSortingDirection, user: 'desc' }}             | ${'User Active Alphabetical Descending Sort Icon'}              | ${'user_asc'}                | ${{ ...userProductivityInitialSortingDirection, user: 'asc' }}
    ${'role_asc'}                | ${{ ...userProductivityInitialSortingDirection, role: 'asc' }}              | ${'User Inactive Alphabetical Ascending Sort Icon'}             | ${'user_asc'}                | ${{ ...userProductivityInitialSortingDirection, user: 'asc' }}
    ${'user_desc'}               | ${{ ...userProductivityInitialSortingDirection, role: 'asc' }}              | ${'Role Inactive Alphabetical Ascending Sort Icon'}             | ${'role_asc'}                | ${{ ...userProductivityInitialSortingDirection, role: 'asc' }}
    ${'role_asc'}                | ${{ ...userProductivityInitialSortingDirection, role: 'asc' }}              | ${'Role Active Alphabetical Ascending Sort Icon'}               | ${'role_desc'}               | ${{ ...userProductivityInitialSortingDirection, role: 'desc' }}
    ${'role_desc'}               | ${{ ...userProductivityInitialSortingDirection, role: 'desc' }}             | ${'Role Active Alphabetical Descending Sort Icon'}              | ${'role_asc'}                | ${{ ...userProductivityInitialSortingDirection, role: 'asc' }}
    ${'user_desc'}               | ${{ ...userProductivityInitialSortingDirection, team: 'asc' }}              | ${'Team Inactive Alphabetical Ascending Sort Icon'}             | ${'team_asc'}                | ${{ ...userProductivityInitialSortingDirection, team: 'asc' }}
    ${'team_asc'}                | ${{ ...userProductivityInitialSortingDirection, team: 'asc' }}              | ${'Team Active Alphabetical Ascending Sort Icon'}               | ${'team_desc'}               | ${{ ...userProductivityInitialSortingDirection, team: 'desc' }}
    ${'team_desc'}               | ${{ ...userProductivityInitialSortingDirection, team: 'desc' }}             | ${'Team Active Alphabetical Descending Sort Icon'}              | ${'team_asc'}                | ${{ ...userProductivityInitialSortingDirection, team: 'asc' }}
    ${'user_desc'}               | ${{ ...userProductivityInitialSortingDirection, asapOutput: 'desc' }}       | ${'ASAP Output Inactive Numerical Descending Sort Icon'}        | ${'asap_output_desc'}        | ${{ ...userProductivityInitialSortingDirection, asapOutput: 'desc' }}
    ${'asap_output_asc'}         | ${{ ...userProductivityInitialSortingDirection, asapOutput: 'asc' }}        | ${'ASAP Output Active Numerical Ascending Sort Icon'}           | ${'asap_output_desc'}        | ${{ ...userProductivityInitialSortingDirection, asapOutput: 'desc' }}
    ${'asap_output_desc'}        | ${{ ...userProductivityInitialSortingDirection, asapOutput: 'desc' }}       | ${'ASAP Output Active Numerical Descending Sort Icon'}          | ${'asap_output_asc'}         | ${{ ...userProductivityInitialSortingDirection, asapOutput: 'asc' }}
    ${'user_desc'}               | ${{ ...userProductivityInitialSortingDirection, asapPublicOutput: 'desc' }} | ${'ASAP Public Output Inactive Numerical Descending Sort Icon'} | ${'asap_public_output_desc'} | ${{ ...userProductivityInitialSortingDirection, asapPublicOutput: 'desc' }}
    ${'asap_public_output_asc'}  | ${{ ...userProductivityInitialSortingDirection, asapPublicOutput: 'asc' }}  | ${'ASAP Public Output Active Numerical Ascending Sort Icon'}    | ${'asap_public_output_desc'} | ${{ ...userProductivityInitialSortingDirection, asapPublicOutput: 'desc' }}
    ${'asap_public_output_desc'} | ${{ ...userProductivityInitialSortingDirection, asapPublicOutput: 'desc' }} | ${'ASAP Public Output Active Numerical Descending Sort Icon'}   | ${'asap_public_output_asc'}  | ${{ ...userProductivityInitialSortingDirection, asapPublicOutput: 'asc' }}
    ${'user_desc'}               | ${{ ...userProductivityInitialSortingDirection, ratio: 'desc' }}            | ${'Ratio Inactive Numerical Descending Sort Icon'}              | ${'ratio_desc'}              | ${{ ...userProductivityInitialSortingDirection, ratio: 'desc' }}
    ${'ratio_asc'}               | ${{ ...userProductivityInitialSortingDirection, ratio: 'asc' }}             | ${'Ratio Active Numerical Ascending Sort Icon'}                 | ${'ratio_desc'}              | ${{ ...userProductivityInitialSortingDirection, ratio: 'desc' }}
    ${'ratio_desc'}              | ${{ ...userProductivityInitialSortingDirection, ratio: 'desc' }}            | ${'Ratio Active Numerical Descending Sort Icon'}                | ${'ratio_asc'}               | ${{ ...userProductivityInitialSortingDirection, ratio: 'asc' }}
  `(
    'when sort is $sort and user clicks on $iconTitle, the new sort becomes $newSort and the sorting direction $newSortingDirection',
    ({ sort, sortingDirection, iconTitle, newSort, newSortingDirection }) => {
      const setSort = jest.fn();
      const setSortingDirection = jest.fn();
      const { getByTitle } = render(
        <UserProductivityTable
          data={[user]}
          performance={userProductivityPerformance}
          sort={sort}
          setSort={setSort}
          sortingDirection={sortingDirection}
          setSortingDirection={setSortingDirection}
          {...pageControlsProps}
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
