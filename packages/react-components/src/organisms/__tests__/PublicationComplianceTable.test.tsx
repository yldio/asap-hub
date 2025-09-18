/* eslint-disable jest/no-commented-out-tests */
import { PublicationComplianceResponse } from '@asap-hub/model';
import { render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';
import PublicationComplianceTable from '../PublicationComplianceTable';

describe('PublicationComplianceTable', () => {
  const pageControlsProps = {
    numberOfPages: 1,
    currentPageIndex: 0,
    renderPageHref: () => '',
  };

  const publicationComplianceData: PublicationComplianceResponse = {
    teamId: 'team-id-1',
    teamName: 'Test Team',
    isTeamInactive: false,
    publications: 85,
    datasets: 70,
    protocols: 60,
    code: 45,
    labMaterials: 30,
  };

  const defaultProps: ComponentProps<typeof PublicationComplianceTable> = {
    ...pageControlsProps,
    data: [publicationComplianceData],
    // sort: 'team_asc' as SortPublicationCompliance,
    // setSort: jest.fn(),
    // sortingDirection: 'asc' as PublicationComplianceSortingDirection,
    // setSortingDirection: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders data', () => {
    render(<PublicationComplianceTable {...defaultProps} />);
    expect(screen.getByText('Test Team')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('70%')).toBeInTheDocument();
    expect(screen.getByText('60%')).toBeInTheDocument();
    expect(screen.getByText('45%')).toBeInTheDocument();
    expect(screen.getByText('30%')).toBeInTheDocument();
  });

  it('renders inactive badge', () => {
    const data = [
      {
        ...publicationComplianceData,
        isTeamInactive: true,
      },
    ];
    render(<PublicationComplianceTable {...defaultProps} data={data} />);
    expect(screen.getByTitle('Inactive Team')).toBeInTheDocument();
  });

  it('renders table headers', () => {
    render(<PublicationComplianceTable {...defaultProps} />);
    expect(
      screen.getByRole('columnheader', { name: /Team/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: /Publications/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: /Datasets/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: /Protocols/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: /Code/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: /Lab Materials/ }),
    ).toBeInTheDocument();
  });

  // TODO: add these back post MVP

  // it('handles sorting when header is clicked', () => {
  //   const mockSetSort = jest.fn();
  //   const mockSetSortingDirection = jest.fn();

  //   render(
  //     <PublicationComplianceTable
  //       {...defaultProps}
  //       setSort={mockSetSort}
  //       setSortingDirection={mockSetSortingDirection}
  //     />,
  //   );

  //   // Find the clickable span inside the team header
  //   const teamHeader = screen.getByRole('columnheader', { name: /Team/ });
  //   const clickableSpan = teamHeader.querySelector('span');
  //   clickableSpan?.click();

  //   expect(mockSetSort).toHaveBeenCalledWith('team_asc');
  //   expect(mockSetSortingDirection).toHaveBeenCalledWith('desc');
  // });

  // it('toggles sorting direction when same header is clicked twice', () => {
  //   const mockSetSort = jest.fn();
  //   const mockSetSortingDirection = jest.fn();

  //   render(
  //     <PublicationComplianceTable
  //       {...defaultProps}
  //       sort="team_asc"
  //       sortingDirection="asc"
  //       setSort={mockSetSort}
  //       setSortingDirection={mockSetSortingDirection}
  //     />,
  //   );

  //   // Find the clickable span inside the team header
  //   const teamHeader = screen.getByRole('columnheader', { name: /Team/ });
  //   const clickableSpan = teamHeader.querySelector('span');
  //   clickableSpan?.click();

  //   expect(mockSetSort).toHaveBeenCalledWith('team_asc');
  //   expect(mockSetSortingDirection).toHaveBeenCalledWith('desc');
  // });

  // it('handles sorting for different columns', () => {
  //   const mockSetSort = jest.fn();
  //   const mockSetSortingDirection = jest.fn();

  //   render(
  //     <PublicationComplianceTable
  //       {...defaultProps}
  //       setSort={mockSetSort}
  //       setSortingDirection={mockSetSortingDirection}
  //     />,
  //   );

  //   // Test publications column sorting
  //   const publicationsHeader = screen.getByRole('columnheader', {
  //     name: /Publications/,
  //   });
  //   const publicationsSpan = publicationsHeader.querySelector('span');
  //   publicationsSpan?.click();
  //   expect(mockSetSort).toHaveBeenCalledWith('publications_asc');

  //   // Test datasets column sorting
  //   const datasetsHeader = screen.getByRole('columnheader', {
  //     name: /Datasets/,
  //   });
  //   const datasetsSpan = datasetsHeader.querySelector('span');
  //   datasetsSpan?.click();
  //   expect(mockSetSort).toHaveBeenCalledWith('datasets_asc');

  //   // Test protocols column sorting
  //   const protocolsHeader = screen.getByRole('columnheader', {
  //     name: /Protocols/,
  //   });
  //   const protocolsSpan = protocolsHeader.querySelector('span');
  //   protocolsSpan?.click();
  //   expect(mockSetSort).toHaveBeenCalledWith('protocols_asc');

  //   // Test code column sorting
  //   const codeHeader = screen.getByRole('columnheader', { name: /Code/ });
  //   const codeSpan = codeHeader.querySelector('span');
  //   codeSpan?.click();
  //   expect(mockSetSort).toHaveBeenCalledWith('code_asc');

  //   // Test lab materials column sorting
  //   const labMaterialsHeader = screen.getByRole('columnheader', {
  //     name: /Lab Materials/,
  //   });
  //   const labMaterialsSpan = labMaterialsHeader.querySelector('span');
  //   labMaterialsSpan?.click();
  //   expect(mockSetSort).toHaveBeenCalledWith('lab_materials_asc');
  // });

  it('renders performance icons correctly', () => {
    const data = [
      {
        ...publicationComplianceData,
        publications: 95, // Should show happy face
        datasets: 85, // Should show neutral face
        protocols: 50, // Should show sad face
        code: 0, // Should show info icon
        labMaterials: 100, // Should show happy face
      },
    ];

    const { container } = render(
      <PublicationComplianceTable {...defaultProps} data={data} />,
    );

    // Check that all performance icons are rendered (they are SVG elements)
    const performanceIcons = container.querySelectorAll('svg');
    expect(performanceIcons.length).toBeGreaterThan(0);
  });

  it('renders team links correctly', () => {
    render(<PublicationComplianceTable {...defaultProps} />);

    const teamLink = screen.getByRole('link', { name: 'Test Team' });
    expect(teamLink).toBeInTheDocument();
    expect(teamLink).toHaveAttribute('href', '/network/teams/team-id-1');
  });

  it('renders multiple rows correctly', () => {
    const data = [
      publicationComplianceData,
      {
        ...publicationComplianceData,
        teamId: 'team-id-2',
        teamName: 'Test Team 2',
        publications: 90,
        datasets: 80,
        protocols: 70,
        code: 60,
        labMaterials: 50,
      },
    ];

    render(<PublicationComplianceTable {...defaultProps} data={data} />);

    expect(screen.getByText('Test Team')).toBeInTheDocument();
    expect(screen.getByText('Test Team 2')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('90%')).toBeInTheDocument();
    expect(screen.getAllByText('70%')).toHaveLength(2); // One from legend, one from data
    expect(screen.getByText('80%')).toBeInTheDocument();
  });

  it('renders page controls', () => {
    render(<PublicationComplianceTable {...defaultProps} />);

    // PageControls component should be rendered
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders static performance card', () => {
    render(<PublicationComplianceTable {...defaultProps} />);

    expect(
      screen.getByText(
        /Percentage is calculated as total research outputs shared across all publications divided by total research outputs identified across all publications/,
      ),
    ).toBeInTheDocument();
  });

  it('handles empty data array', () => {
    render(<PublicationComplianceTable {...defaultProps} data={[]} />);

    // Headers should still be present
    expect(
      screen.getByRole('columnheader', { name: /Team/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: /Publications/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: /Datasets/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: /Protocols/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: /Code/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: /Lab Materials/ }),
    ).toBeInTheDocument();

    // But no data rows
    expect(screen.queryByText('Test Team')).not.toBeInTheDocument();
  });

  it('displays percentage values correctly', () => {
    const data = [
      {
        ...publicationComplianceData,
        publications: 100,
        datasets: 0,
        protocols: 50,
        code: 25,
        labMaterials: 75,
      },
    ];

    render(<PublicationComplianceTable {...defaultProps} data={data} />);

    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText('25%')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
  });
});
