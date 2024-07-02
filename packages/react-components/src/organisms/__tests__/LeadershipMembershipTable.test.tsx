import { initialSortingDirection } from '@asap-hub/model';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import LeadershipMembershipTable from '../LeadershipMembershipTable';

type DataItem = ComponentProps<
  typeof LeadershipMembershipTable
>['data'][number];

const dataItem: DataItem = {
  name: 'Test Team',
  id: '1',
  leadershipRoleCount: 1,
  previousLeadershipRoleCount: 2,
  memberCount: 3,
  previousMemberCount: 4,
};
const data: DataItem[] = [dataItem];

describe('LeadershipMembershipTable', () => {
  it('renders data', () => {
    const { getByText } = render(
      <LeadershipMembershipTable
        data={data}
        metric={'working-group'}
        sort="team_asc"
        setSort={jest.fn()}
        sortingDirection={initialSortingDirection}
        setSortingDirection={jest.fn()}
      />,
    );
    expect(getByText('Test Team')).toBeInTheDocument();
  });

  it('renders team inactive badge', () => {
    const { getByTitle, queryByTitle, rerender } = render(
      <LeadershipMembershipTable
        data={[{ ...dataItem, inactiveSince: '2022-09-30T09:00:00Z' }]}
        metric={'working-group'}
        sort="team_asc"
        setSort={jest.fn()}
        sortingDirection={initialSortingDirection}
        setSortingDirection={jest.fn()}
      />,
    );

    expect(getByTitle('Inactive Team')).toBeInTheDocument();

    rerender(
      <LeadershipMembershipTable
        data={[{ ...dataItem, inactiveSince: undefined }]}
        metric={'working-group'}
        sort="team_asc"
        setSort={jest.fn()}
        sortingDirection={initialSortingDirection}
        setSortingDirection={jest.fn()}
      />,
    );

    expect(queryByTitle('Inactive Team')).not.toBeInTheDocument();
  });

  it.each`
    metric              | sort                             | sortingDirection                                              | iconTitle                                                                       | newSort                          | newSortingDirection
    ${'working-group'}  | ${'team_asc'}                    | ${{ ...initialSortingDirection, team: 'asc' }}                | ${'Active Alphabetical Ascending Sort Icon'}                                    | ${'team_desc'}                   | ${{ ...initialSortingDirection, team: 'desc' }}
    ${'working-group'}  | ${'team_desc'}                   | ${{ ...initialSortingDirection, team: 'desc' }}               | ${'Active Alphabetical Descending Sort Icon'}                                   | ${'team_asc'}                    | ${{ ...initialSortingDirection, team: 'asc' }}
    ${'working-group'}  | ${'wg_current_leadership_asc'}   | ${{ ...initialSortingDirection, currentLeadership: 'asc' }}   | ${'Inactive Alphabetical Ascending Sort Icon'}                                  | ${'team_asc'}                    | ${{ ...initialSortingDirection, team: 'asc' }}
    ${'working-group'}  | ${'team_desc'}                   | ${{ ...initialSortingDirection, currentLeadership: 'desc' }}  | ${'Working Group Current Leadership Inactive Numerical Descending Sort Icon'}   | ${'wg_current_leadership_desc'}  | ${{ ...initialSortingDirection, currentLeadership: 'desc' }}
    ${'working-group'}  | ${'wg_current_leadership_asc'}   | ${{ ...initialSortingDirection, currentLeadership: 'asc' }}   | ${'Working Group Current Leadership Active Numerical Ascending Sort Icon'}      | ${'wg_current_leadership_desc'}  | ${{ ...initialSortingDirection, currentLeadership: 'desc' }}
    ${'working-group'}  | ${'wg_current_leadership_desc'}  | ${{ ...initialSortingDirection, currentLeadership: 'desc' }}  | ${'Working Group Current Leadership Active Numerical Descending Sort Icon'}     | ${'wg_current_leadership_asc'}   | ${{ ...initialSortingDirection, currentLeadership: 'asc' }}
    ${'working-group'}  | ${'team_desc'}                   | ${{ ...initialSortingDirection, previousLeadership: 'desc' }} | ${'Working Group Previous Leadership Inactive Numerical Descending Sort Icon'}  | ${'wg_previous_leadership_desc'} | ${{ ...initialSortingDirection, previousLeadership: 'desc' }}
    ${'working-group'}  | ${'wg_previous_leadership_asc'}  | ${{ ...initialSortingDirection, previousLeadership: 'asc' }}  | ${'Working Group Previous Leadership Active Numerical Ascending Sort Icon'}     | ${'wg_previous_leadership_desc'} | ${{ ...initialSortingDirection, previousLeadership: 'desc' }}
    ${'working-group'}  | ${'wg_previous_leadership_desc'} | ${{ ...initialSortingDirection, previousLeadership: 'desc' }} | ${'Working Group Previous Leadership Active Numerical Descending Sort Icon'}    | ${'wg_previous_leadership_asc'}  | ${{ ...initialSortingDirection, previousLeadership: 'asc' }}
    ${'working-group'}  | ${'team_desc'}                   | ${{ ...initialSortingDirection, currentMembership: 'desc' }}  | ${'Working Group Current Membership Inactive Numerical Descending Sort Icon'}   | ${'wg_current_membership_desc'}  | ${{ ...initialSortingDirection, currentMembership: 'desc' }}
    ${'working-group'}  | ${'wg_current_membership_asc'}   | ${{ ...initialSortingDirection, currentMembership: 'asc' }}   | ${'Working Group Current Membership Active Numerical Ascending Sort Icon'}      | ${'wg_current_membership_desc'}  | ${{ ...initialSortingDirection, currentMembership: 'desc' }}
    ${'working-group'}  | ${'wg_current_membership_desc'}  | ${{ ...initialSortingDirection, currentMembership: 'desc' }}  | ${'Working Group Current Membership Active Numerical Descending Sort Icon'}     | ${'wg_current_membership_asc'}   | ${{ ...initialSortingDirection, currentMembership: 'asc' }}
    ${'working-group'}  | ${'team_desc'}                   | ${{ ...initialSortingDirection, previousMembership: 'desc' }} | ${'Working Group Previous Membership Inactive Numerical Descending Sort Icon'}  | ${'wg_previous_membership_desc'} | ${{ ...initialSortingDirection, previousMembership: 'desc' }}
    ${'working-group'}  | ${'wg_previous_membership_asc'}  | ${{ ...initialSortingDirection, previousMembership: 'asc' }}  | ${'Working Group Previous Membership Active Numerical Ascending Sort Icon'}     | ${'wg_previous_membership_desc'} | ${{ ...initialSortingDirection, previousMembership: 'desc' }}
    ${'working-group'}  | ${'wg_previous_membership_desc'} | ${{ ...initialSortingDirection, previousMembership: 'desc' }} | ${'Working Group Previous Membership Active Numerical Descending Sort Icon'}    | ${'wg_previous_membership_asc'}  | ${{ ...initialSortingDirection, previousMembership: 'asc' }}
    ${'interest-group'} | ${'team_asc'}                    | ${{ ...initialSortingDirection, team: 'asc' }}                | ${'Active Alphabetical Ascending Sort Icon'}                                    | ${'team_desc'}                   | ${{ ...initialSortingDirection, team: 'desc' }}
    ${'interest-group'} | ${'team_desc'}                   | ${{ ...initialSortingDirection, team: 'desc' }}               | ${'Active Alphabetical Descending Sort Icon'}                                   | ${'team_asc'}                    | ${{ ...initialSortingDirection, team: 'asc' }}
    ${'interest-group'} | ${'ig_current_leadership_asc'}   | ${{ ...initialSortingDirection, currentLeadership: 'asc' }}   | ${'Inactive Alphabetical Ascending Sort Icon'}                                  | ${'team_asc'}                    | ${{ ...initialSortingDirection, team: 'asc' }}
    ${'interest-group'} | ${'team_desc'}                   | ${{ ...initialSortingDirection, currentLeadership: 'desc' }}  | ${'Interest Group Current Leadership Inactive Numerical Descending Sort Icon'}  | ${'ig_current_leadership_desc'}  | ${{ ...initialSortingDirection, currentLeadership: 'desc' }}
    ${'interest-group'} | ${'ig_current_leadership_asc'}   | ${{ ...initialSortingDirection, currentLeadership: 'asc' }}   | ${'Interest Group Current Leadership Active Numerical Ascending Sort Icon'}     | ${'ig_current_leadership_desc'}  | ${{ ...initialSortingDirection, currentLeadership: 'desc' }}
    ${'interest-group'} | ${'ig_current_leadership_desc'}  | ${{ ...initialSortingDirection, currentLeadership: 'desc' }}  | ${'Interest Group Current Leadership Active Numerical Descending Sort Icon'}    | ${'ig_current_leadership_asc'}   | ${{ ...initialSortingDirection, currentLeadership: 'asc' }}
    ${'interest-group'} | ${'team_desc'}                   | ${{ ...initialSortingDirection, previousLeadership: 'desc' }} | ${'Interest Group Previous Leadership Inactive Numerical Descending Sort Icon'} | ${'ig_previous_leadership_desc'} | ${{ ...initialSortingDirection, previousLeadership: 'desc' }}
    ${'interest-group'} | ${'ig_previous_leadership_asc'}  | ${{ ...initialSortingDirection, previousLeadership: 'asc' }}  | ${'Interest Group Previous Leadership Active Numerical Ascending Sort Icon'}    | ${'ig_previous_leadership_desc'} | ${{ ...initialSortingDirection, previousLeadership: 'desc' }}
    ${'interest-group'} | ${'ig_previous_leadership_desc'} | ${{ ...initialSortingDirection, previousLeadership: 'desc' }} | ${'Interest Group Previous Leadership Active Numerical Descending Sort Icon'}   | ${'ig_previous_leadership_asc'}  | ${{ ...initialSortingDirection, previousLeadership: 'asc' }}
    ${'interest-group'} | ${'team_desc'}                   | ${{ ...initialSortingDirection, currentMembership: 'desc' }}  | ${'Interest Group Current Membership Inactive Numerical Descending Sort Icon'}  | ${'ig_current_membership_desc'}  | ${{ ...initialSortingDirection, currentMembership: 'desc' }}
    ${'interest-group'} | ${'ig_current_membership_asc'}   | ${{ ...initialSortingDirection, currentMembership: 'asc' }}   | ${'Interest Group Current Membership Active Numerical Ascending Sort Icon'}     | ${'ig_current_membership_desc'}  | ${{ ...initialSortingDirection, currentMembership: 'desc' }}
    ${'interest-group'} | ${'ig_current_membership_desc'}  | ${{ ...initialSortingDirection, currentMembership: 'desc' }}  | ${'Interest Group Current Membership Active Numerical Descending Sort Icon'}    | ${'ig_current_membership_asc'}   | ${{ ...initialSortingDirection, currentMembership: 'asc' }}
    ${'interest-group'} | ${'team_desc'}                   | ${{ ...initialSortingDirection, previousMembership: 'desc' }} | ${'Interest Group Previous Membership Inactive Numerical Descending Sort Icon'} | ${'ig_previous_membership_desc'} | ${{ ...initialSortingDirection, previousMembership: 'desc' }}
    ${'interest-group'} | ${'ig_previous_membership_asc'}  | ${{ ...initialSortingDirection, previousMembership: 'asc' }}  | ${'Interest Group Previous Membership Active Numerical Ascending Sort Icon'}    | ${'ig_previous_membership_desc'} | ${{ ...initialSortingDirection, previousMembership: 'desc' }}
    ${'interest-group'} | ${'ig_previous_membership_desc'} | ${{ ...initialSortingDirection, previousMembership: 'desc' }} | ${'Interest Group Previous Membership Active Numerical Descending Sort Icon'}   | ${'ig_previous_membership_asc'}  | ${{ ...initialSortingDirection, previousMembership: 'asc' }}
  `(
    'when metric is $metric, sort is $sort and user clicks on $iconTitle, the new sort becomes $newSort and the sorting direction $newSortingDirection',
    ({
      metric,
      sort,
      sortingDirection,
      iconTitle,
      newSort,
      newSortingDirection,
    }) => {
      const setSort = jest.fn();
      const setSortingDirection = jest.fn();
      const { getByTitle } = render(
        <LeadershipMembershipTable
          data={data}
          metric={metric}
          sort={sort}
          setSort={setSort}
          sortingDirection={sortingDirection}
          setSortingDirection={setSortingDirection}
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
