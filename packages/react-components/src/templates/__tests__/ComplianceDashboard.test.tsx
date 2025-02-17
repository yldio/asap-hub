import { complianceInitialSortingDirection } from '@asap-hub/model';
import { render } from '@testing-library/react';
import { ComponentProps } from 'react';
import { ComplianceDashboard } from '..';

describe('ComplianceDashboard', () => {
  const props: ComponentProps<typeof ComplianceDashboard> = {
    selectedStatuses: [],
    onSelectStatus: jest.fn(),
    completedStatus: 'show',
    requestedAPCCoverage: 'all',
    isComplianceReviewer: true,
    getAssignedUsersSuggestions: jest.fn(),
    data: [
      {
        id: 'DA1-000463-002-org-G-1',
        lastUpdated: '2023-01-01T08:00:00Z',
        requestingApcCoverage: 'Yes',
        status: 'Compliant',
        team: { id: 'team-1', displayName: 'Test Team' },
        assignedUsers: [],
        manuscriptId: '1',
        title: 'Manuscript 1',
        teams: 'Test Team',
      },
    ],
    numberOfPages: 1,
    currentPageIndex: 0,
    renderPageHref: () => '',
    sort: 'team_asc',
    setSort: jest.fn(),
    sortingDirection: complianceInitialSortingDirection,
    setSortingDirection: jest.fn(),
    onUpdateManuscript: jest.fn(),
  };

  it('renders the manuscript status card', () => {
    const { getByText } = render(<ComplianceDashboard {...props} data={[]} />);

    expect(getByText('Manuscripts by status:')).toBeInTheDocument();
    expect(getByText('Waiting for Report')).toBeInTheDocument();
  });

  it('renders the empty manuscript view when there are no manuscripts', () => {
    const { getByText } = render(<ComplianceDashboard {...props} data={[]} />);

    expect(getByText('No manuscripts available.')).toBeInTheDocument();
  });

  it('renders compliance table when there are manuscripts', () => {
    const { getByText } = render(<ComplianceDashboard {...props} />);

    expect(getByText('Test Team')).toBeInTheDocument();
  });
});
