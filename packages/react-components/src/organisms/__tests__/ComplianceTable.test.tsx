import {
  complianceInitialSortingDirection,
  PartialManuscriptResponse,
} from '@asap-hub/model';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import ComplianceTable from '../ComplianceTable';

describe('ComplianceTable', () => {
  const pageControlsProps = {
    numberOfPages: 1,
    currentPageIndex: 0,
    renderPageHref: () => '',
  };

  const complianceData: PartialManuscriptResponse = {
    id: '1',
    lastUpdated: '',
    status: 'Addendum Required',
    team: { id: 'team-id', displayName: 'Test Team' },
    requestingApcCoverage: 'Yes',
    assignedUsers: [
      {
        id: 'user-id',
        firstName: 'Test',
        lastName: 'User',
        avatarUrl: 'https://example.com',
      },
    ],
  };

  const defaultProps: ComponentProps<typeof ComplianceTable> = {
    ...pageControlsProps,
    data: [complianceData],
    sort: 'team_asc',
    setSort: jest.fn(),
    sortingDirection: complianceInitialSortingDirection,
    setSortingDirection: jest.fn(),
  };

  it('renders data', () => {
    const { getByText } = render(<ComplianceTable {...defaultProps} />);
    expect(getByText('Test Team')).toBeInTheDocument();
  });

  it.each`
    sort                   | sortingDirection                                                 | iconTitle                                                   | newSort                | newSortingDirection
    ${'team_asc'}          | ${{ ...complianceInitialSortingDirection, team: 'asc' }}         | ${'Team Active Alphabetical Ascending Sort Icon'}           | ${'team_desc'}         | ${{ ...complianceInitialSortingDirection, team: 'desc' }}
    ${'team_desc'}         | ${{ ...complianceInitialSortingDirection, team: 'desc' }}        | ${'Team Active Alphabetical Descending Sort Icon'}          | ${'team_asc'}          | ${{ ...complianceInitialSortingDirection, team: 'asc' }}
    ${'id_asc'}            | ${{ ...complianceInitialSortingDirection, id: 'asc' }}           | ${'Team Inactive Alphabetical Ascending Sort Icon'}         | ${'team_asc'}          | ${{ ...complianceInitialSortingDirection, team: 'asc' }}
    ${'team_desc'}         | ${{ ...complianceInitialSortingDirection, id: 'desc' }}          | ${'ID Inactive Numerical Descending Sort Icon'}             | ${'id_desc'}           | ${{ ...complianceInitialSortingDirection, id: 'desc' }}
    ${'id_asc'}            | ${{ ...complianceInitialSortingDirection, id: 'asc' }}           | ${'ID Active Numerical Ascending Sort Icon'}                | ${'id_desc'}           | ${{ ...complianceInitialSortingDirection, id: 'desc' }}
    ${'id_desc'}           | ${{ ...complianceInitialSortingDirection, id: 'desc' }}          | ${'ID Active Numerical Descending Sort Icon'}               | ${'id_asc'}            | ${{ ...complianceInitialSortingDirection, id: 'asc' }}
    ${'team_desc'}         | ${{ ...complianceInitialSortingDirection, lastUpdated: 'desc' }} | ${'Last Updated Inactive Numerical Descending Sort Icon'}   | ${'last_updated_desc'} | ${{ ...complianceInitialSortingDirection, lastUpdated: 'desc' }}
    ${'last_updated_asc'}  | ${{ ...complianceInitialSortingDirection, lastUpdated: 'asc' }}  | ${'Last Updated Active Numerical Ascending Sort Icon'}      | ${'last_updated_desc'} | ${{ ...complianceInitialSortingDirection, lastUpdated: 'desc' }}
    ${'last_updated_desc'} | ${{ ...complianceInitialSortingDirection, lastUpdated: 'desc' }} | ${'Last Updated Active Numerical Descending Sort Icon'}     | ${'last_updated_asc'}  | ${{ ...complianceInitialSortingDirection, lastUpdated: 'asc' }}
    ${'team_desc'}         | ${{ ...complianceInitialSortingDirection, status: 'asc' }}       | ${'Status Inactive Alphabetical Ascending Sort Icon'}       | ${'status_asc'}        | ${{ ...complianceInitialSortingDirection, status: 'asc' }}
    ${'status'}            | ${{ ...complianceInitialSortingDirection, status: 'asc' }}       | ${'Status Active Alphabetical Ascending Sort Icon'}         | ${'status_desc'}       | ${{ ...complianceInitialSortingDirection, status: 'desc' }}
    ${'status'}            | ${{ ...complianceInitialSortingDirection, status: 'desc' }}      | ${'Status Active Alphabetical Descending Sort Icon'}        | ${'status_asc'}        | ${{ ...complianceInitialSortingDirection, status: 'asc' }}
    ${'team_desc'}         | ${{ ...complianceInitialSortingDirection, apcCoverage: 'asc' }}  | ${'APC Coverage Inactive Alphabetical Ascending Sort Icon'} | ${'apc_coverage_asc'}  | ${{ ...complianceInitialSortingDirection, apcCoverage: 'asc' }}
    ${'apc_coverage_asc'}  | ${{ ...complianceInitialSortingDirection, apcCoverage: 'asc' }}  | ${'APC Coverage Active Alphabetical Ascending Sort Icon'}   | ${'apc_coverage_desc'} | ${{ ...complianceInitialSortingDirection, apcCoverage: 'desc' }}
    ${'apc_coverage_desc'} | ${{ ...complianceInitialSortingDirection, apcCoverage: 'desc' }} | ${'APC Coverage Active Alphabetical Descending Sort Icon'}  | ${'apc_coverage_asc'}  | ${{ ...complianceInitialSortingDirection, apcCoverage: 'asc' }}
  `(
    'when sort is $sort and user clicks on $iconTitle, the new sort becomes $newSort and the sorting direction $newSortingDirection',
    ({ sort, sortingDirection, iconTitle, newSort, newSortingDirection }) => {
      const setSort = jest.fn();
      const setSortingDirection = jest.fn();
      const { getByTitle } = render(
        <ComplianceTable
          {...defaultProps}
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
