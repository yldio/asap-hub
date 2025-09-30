/* eslint-disable jest/no-commented-out-tests */
import {
  PreprintComplianceResponse,
  // SortPreprintCompliance,
} from '@asap-hub/model';
import { render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';
import PreprintComplianceTable from '../PreprintComplianceTable';

describe('PreprintComplianceTable', () => {
  const pageControlsProps = {
    numberOfPages: 1,
    currentPageIndex: 0,
    renderPageHref: () => '',
  };

  const preprintComplianceData: PreprintComplianceResponse = {
    teamId: 'team-id-1',
    teamName: 'Test Team',
    isTeamInactive: false,
    numberOfPreprints: 5,
    postedPriorPercentage: 80,
    numberOfPublications: 0,
    ranking: 'ADEQUATE',
    timeRange: 'all',
  };

  const defaultProps: ComponentProps<typeof PreprintComplianceTable> = {
    ...pageControlsProps,
    data: [preprintComplianceData],
    // sort: 'team_asc' as SortPreprintCompliance,
    // setSort: jest.fn(),
    // sortingDirection: 'asc' as PreprintComplianceSortingDirection,
    // setSortingDirection: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders data', () => {
    render(<PreprintComplianceTable {...defaultProps} />);
    expect(screen.getByText('Test Team')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
  });

  it('renders inactive badge', () => {
    const data = [
      {
        ...preprintComplianceData,
        isTeamInactive: true,
      },
    ];
    render(<PreprintComplianceTable {...defaultProps} data={data} />);
    expect(screen.getByTitle('Inactive Team')).toBeInTheDocument();
  });

  it('renders table headers', () => {
    render(<PreprintComplianceTable {...defaultProps} />);
    expect(
      screen.getByRole('columnheader', { name: /Team/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: /Number of Preprints/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', {
        name: /Posted Prior to Journal Submission/,
      }),
    ).toBeInTheDocument();
  });

  // TODO: add these back post MVP

  //   it('handles sorting when header is clicked', () => { // TODO: add these back post MVP
  //     const mockSetSort = jest.fn();
  //     const mockSetSortingDirection = jest.fn();

  //     render(
  //       <PreprintComplianceTable
  //         {...defaultProps}
  //         setSort={mockSetSort}
  //         setSortingDirection={mockSetSortingDirection}
  //       />,
  //     );

  //     // Find the clickable span inside the team header
  //     const teamHeader = screen.getByRole('columnheader', { name: /Team/ });
  //     const clickableSpan = teamHeader.querySelector('span');
  //     clickableSpan?.click();

  //     expect(mockSetSort).toHaveBeenCalledWith('team_asc');
  //     expect(mockSetSortingDirection).toHaveBeenCalledWith('desc');
  //   });

  //   it('toggles sorting direction when same header is clicked twice', () => {
  //     const mockSetSort = jest.fn();
  //     const mockSetSortingDirection = jest.fn();

  //     render(
  //       <PreprintComplianceTable
  //         {...defaultProps}
  //         sort="team_asc"
  //         sortingDirection="asc"
  //         setSort={mockSetSort}
  //         setSortingDirection={mockSetSortingDirection}
  //       />,
  //     );

  //     // Find the clickable span inside the team header
  //     const teamHeader = screen.getByRole('columnheader', { name: /Team/ });
  //     const clickableSpan = teamHeader.querySelector('span');
  //     clickableSpan?.click();

  //     expect(mockSetSort).toHaveBeenCalledWith('team_asc');
  //     expect(mockSetSortingDirection).toHaveBeenCalledWith('desc');
  //   });

  //   it('handles sorting for different columns', () => {
  //     const mockSetSort = jest.fn();
  //     const mockSetSortingDirection = jest.fn();

  //     render(
  //       <PreprintComplianceTable
  //         {...defaultProps}
  //         setSort={mockSetSort}
  //         setSortingDirection={mockSetSortingDirection}
  //       />,
  //     );

  //     // Test number of preprints column sorting
  //     const preprintsHeader = screen.getByRole('columnheader', {
  //       name: /Number of Preprints/,
  //     });
  //     const preprintsSpan = preprintsHeader.querySelector('span');
  //     preprintsSpan?.click();
  //     expect(mockSetSort).toHaveBeenCalledWith('preprints_asc');

  //     // Test posted prior to journal submission column sorting
  //     const postedPriorHeader = screen.getByRole('columnheader', {
  //       name: /Posted Prior to Journal Submission/,
  //     });
  //     const postedPriorSpan = postedPriorHeader.querySelector('span');
  //     postedPriorSpan?.click();
  //     expect(mockSetSort).toHaveBeenCalledWith('posted_prior_asc');
  //   });

  it('renders performance icons correctly', () => {
    const data = [
      {
        ...preprintComplianceData,
        postedPriorPercentage: 95, // Should show happy face
      },
      {
        ...preprintComplianceData,
        teamId: 'team-id-2',
        teamName: 'Test Team 2',
        postedPriorPercentage: 85, // Should show neutral face
      },
      {
        ...preprintComplianceData,
        teamId: 'team-id-3',
        teamName: 'Test Team 3',
        postedPriorPercentage: 50, // Should show sad face
      },
      {
        ...preprintComplianceData,
        teamId: 'team-id-4',
        teamName: 'Test Team 4',
        postedPriorPercentage: 0, // Should show info icon
      },
    ];

    const { container } = render(
      <PreprintComplianceTable {...defaultProps} data={data} />,
    );

    // Check that all performance icons are rendered (they are SVG elements)
    const performanceIcons = container.querySelectorAll('svg');
    expect(performanceIcons.length).toBeGreaterThan(0);
  });

  it('renders team links correctly', () => {
    render(<PreprintComplianceTable {...defaultProps} />);

    const teamLink = screen.getByRole('link', { name: 'Test Team' });
    expect(teamLink).toBeInTheDocument();
    expect(teamLink).toHaveAttribute('href', '/network/teams/team-id-1');
  });

  it('renders multiple rows correctly', () => {
    const data = [
      preprintComplianceData,
      {
        ...preprintComplianceData,
        teamId: 'team-id-2',
        teamName: 'Test Team 2',
        numberOfPreprints: 3,
        postedPriorToJournalSubmission: 2,
        postedPriorPercentage: 67,
      },
    ];

    render(<PreprintComplianceTable {...defaultProps} data={data} />);

    expect(screen.getByText('Test Team')).toBeInTheDocument();
    expect(screen.getByText('Test Team 2')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
    expect(screen.getByText('67%')).toBeInTheDocument();
  });

  it('renders page controls', () => {
    render(<PreprintComplianceTable {...defaultProps} />);

    // PageControls component should be rendered
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('handles empty data array', () => {
    render(<PreprintComplianceTable {...defaultProps} data={[]} />);

    // Headers should still be present
    expect(
      screen.getByRole('columnheader', { name: /Team/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: /Number of Preprints/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', {
        name: /Posted Prior to Journal Submission/,
      }),
    ).toBeInTheDocument();

    expect(screen.queryByText('Test Team')).not.toBeInTheDocument();
  });

  it('handles missing teamId with fallback key', () => {
    const dataWithMissingTeamId = [
      {
        ...preprintComplianceData,
        teamId: '', // Empty teamId to trigger fallback
        teamName: 'Team Without ID',
      },
    ];

    render(
      <PreprintComplianceTable
        {...defaultProps}
        data={dataWithMissingTeamId}
      />,
    );

    // Should still render the team name
    expect(screen.getByText('Team Without ID')).toBeInTheDocument();
  });

  it('handles null postedPriorPercentage', () => {
    const dataWithNullPercentage = [
      {
        ...preprintComplianceData,
        postedPriorPercentage: null,
      },
    ];

    render(
      <PreprintComplianceTable
        {...defaultProps}
        data={dataWithNullPercentage}
      />,
    );

    // Should display 'N/A' instead of percentage
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });
});
