import {
  complianceInitialSortingDirection,
  PartialManuscriptResponse,
} from '@asap-hub/model';
import { render } from '@testing-library/react';
import { ComponentProps } from 'react';
import ComplianceTable from '../ComplianceTable';

describe('ComplianceTable', () => {
  const pageControlsProps = {
    numberOfPages: 1,
    currentPageIndex: 0,
    renderPageHref: () => '',
    onUpdateManuscript: jest.fn(),
  };

  const complianceData: PartialManuscriptResponse = {
    id: 'DA1-000463-002-org-G-1',
    lastUpdated: '2023-01-01T08:00:00Z',
    status: 'Addendum Required',
    team: { id: 'team-id', displayName: 'Test Team' },
    requestingApcCoverage: 'Yes',
    manuscriptId: 'manuscript-id-1',
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
});
