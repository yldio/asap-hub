import { complianceInitialSortingDirection } from '@asap-hub/model';
import { render } from '@testing-library/react';
import { ComponentProps } from 'react';
import { ComplianceDashboard } from '..';

describe('ComplianceDashboard', () => {
  const props: ComponentProps<typeof ComplianceDashboard> = {
    data: [
      {
        id: '1',
        publishedAt: '2023-01-01T08:00:00Z',
        requestingApcCoverage: 'Yes',
        status: 'Compliant',
        team: { id: 'team-1', displayName: 'Test Team' },
        assignedUsers: [],
      },
    ],
    numberOfPages: 1,
    currentPageIndex: 0,
    renderPageHref: () => '',
    sort: 'team_asc',
    setSort: jest.fn(),
    sortingDirection: complianceInitialSortingDirection,
    setSortingDirection: jest.fn(),
  };

  it('renders the manuscript status card', () => {
    const { getByText } = render(<ComplianceDashboard {...props} />);

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
