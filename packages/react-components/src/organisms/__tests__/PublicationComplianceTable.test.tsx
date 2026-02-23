import {
  PublicationComplianceResponse,
  SortPublicationCompliance,
  publicationComplianceInitialSortingDirection,
} from '@asap-hub/model';
import { render, screen } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
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
    datasetsPercentage: 70,
    protocolsPercentage: 60,
    codePercentage: 45,
    labMaterialsPercentage: 30,
    overallCompliance: 50,
    datasetsRanking: 'NEEDS IMPROVEMENT',
    protocolsRanking: 'NEEDS IMPROVEMENT',
    codeRanking: 'NEEDS IMPROVEMENT',
    labMaterialsRanking: 'NEEDS IMPROVEMENT',
  };

  const defaultProps: ComponentProps<typeof PublicationComplianceTable> = {
    ...pageControlsProps,
    data: [publicationComplianceData],
    sort: 'team_asc' as SortPublicationCompliance,
    setSort: jest.fn(),
    sortingDirection: publicationComplianceInitialSortingDirection,
    setSortingDirection: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders data', () => {
    render(<PublicationComplianceTable {...defaultProps} />);
    expect(screen.getByText('Test Team')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText('70%')).toBeInTheDocument();
    expect(screen.getByText('60%')).toBeInTheDocument();
    expect(screen.getByText('45%')).toBeInTheDocument();
    expect(screen.getByText('30%')).toBeInTheDocument();
  });

  it('renders sort icons in headers', () => {
    render(<PublicationComplianceTable {...defaultProps} />);
    const headers = screen.getAllByRole('columnheader');
    headers.forEach((header) => {
      const button = header.querySelector('button');
      expect(button).toBeInTheDocument();
    });
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

  it('handles sorting when team header button is clicked', () => {
    const mockSetSort = jest.fn();
    const mockSetSortingDirection = jest.fn();

    render(
      <PublicationComplianceTable
        {...defaultProps}
        setSort={mockSetSort}
        setSortingDirection={mockSetSortingDirection}
      />,
    );

    const teamHeader = screen.getByRole('columnheader', { name: /Team/ });
    const sortButton = teamHeader.querySelector('button');
    fireEvent.click(sortButton!);

    expect(mockSetSort).toHaveBeenCalledWith('team_desc');
    expect(mockSetSortingDirection).toHaveBeenCalledWith({
      ...publicationComplianceInitialSortingDirection,
      team: 'desc',
    });
  });

  it('toggles sorting direction when same header is clicked twice', () => {
    const mockSetSort = jest.fn();
    const mockSetSortingDirection = jest.fn();

    render(
      <PublicationComplianceTable
        {...defaultProps}
        sort="team_asc"
        sortingDirection={{
          ...publicationComplianceInitialSortingDirection,
          team: 'asc',
        }}
        setSort={mockSetSort}
        setSortingDirection={mockSetSortingDirection}
      />,
    );

    const teamHeader = screen.getByRole('columnheader', { name: /Team/ });
    const sortButton = teamHeader.querySelector('button');
    fireEvent.click(sortButton!);

    expect(mockSetSort).toHaveBeenCalledWith('team_desc');
    expect(mockSetSortingDirection).toHaveBeenCalledWith({
      ...publicationComplianceInitialSortingDirection,
      team: 'desc',
    });
  });

  it('handles sorting for publications column', () => {
    const mockSetSort = jest.fn();
    const mockSetSortingDirection = jest.fn();

    render(
      <PublicationComplianceTable
        {...defaultProps}
        setSort={mockSetSort}
        setSortingDirection={mockSetSortingDirection}
      />,
    );

    const publicationsHeader = screen.getByRole('columnheader', {
      name: /Publications/,
    });
    const sortButton = publicationsHeader.querySelector('button');
    fireEvent.click(sortButton!);

    expect(mockSetSort).toHaveBeenCalledWith('publications_desc');
    expect(mockSetSortingDirection).toHaveBeenCalledWith({
      ...publicationComplianceInitialSortingDirection,
      publications: 'desc',
    });
  });

  it('handles sorting for datasets column', () => {
    const mockSetSort = jest.fn();
    const mockSetSortingDirection = jest.fn();

    render(
      <PublicationComplianceTable
        {...defaultProps}
        setSort={mockSetSort}
        setSortingDirection={mockSetSortingDirection}
      />,
    );

    const datasetsHeader = screen.getByRole('columnheader', {
      name: /Datasets/,
    });
    const sortButton = datasetsHeader.querySelector('button');
    fireEvent.click(sortButton!);

    expect(mockSetSort).toHaveBeenCalledWith('datasets_desc');
    expect(mockSetSortingDirection).toHaveBeenCalledWith({
      ...publicationComplianceInitialSortingDirection,
      datasets: 'desc',
    });
  });

  it('handles sorting for protocols column', () => {
    const mockSetSort = jest.fn();
    const mockSetSortingDirection = jest.fn();

    render(
      <PublicationComplianceTable
        {...defaultProps}
        setSort={mockSetSort}
        setSortingDirection={mockSetSortingDirection}
      />,
    );

    const protocolsHeader = screen.getByRole('columnheader', {
      name: /Protocols/,
    });
    const sortButton = protocolsHeader.querySelector('button');
    fireEvent.click(sortButton!);

    expect(mockSetSort).toHaveBeenCalledWith('protocols_desc');
    expect(mockSetSortingDirection).toHaveBeenCalledWith({
      ...publicationComplianceInitialSortingDirection,
      protocols: 'desc',
    });
  });

  it('handles sorting for code column', () => {
    const mockSetSort = jest.fn();
    const mockSetSortingDirection = jest.fn();

    render(
      <PublicationComplianceTable
        {...defaultProps}
        setSort={mockSetSort}
        setSortingDirection={mockSetSortingDirection}
      />,
    );

    const codeHeader = screen.getByRole('columnheader', { name: /Code/ });
    const sortButton = codeHeader.querySelector('button');
    fireEvent.click(sortButton!);

    expect(mockSetSort).toHaveBeenCalledWith('code_desc');
    expect(mockSetSortingDirection).toHaveBeenCalledWith({
      ...publicationComplianceInitialSortingDirection,
      code: 'desc',
    });
  });

  it('handles sorting for lab materials column', () => {
    const mockSetSort = jest.fn();
    const mockSetSortingDirection = jest.fn();

    render(
      <PublicationComplianceTable
        {...defaultProps}
        setSort={mockSetSort}
        setSortingDirection={mockSetSortingDirection}
      />,
    );

    const labMaterialsHeader = screen.getByRole('columnheader', {
      name: /Lab Materials/,
    });
    const sortButton = labMaterialsHeader.querySelector('button');
    fireEvent.click(sortButton!);

    expect(mockSetSort).toHaveBeenCalledWith('lab_materials_desc');
    expect(mockSetSortingDirection).toHaveBeenCalledWith({
      ...publicationComplianceInitialSortingDirection,
      labMaterials: 'desc',
    });
  });

  it('renders performance icons correctly', () => {
    const data = [
      {
        ...publicationComplianceData,
        numberOfPublications: 95, // Should show happy face
        datasetsPercentage: 85, // Should show neutral face
        protocolsPercentage: 50, // Should show sad face
        codePercentage: 0, // Should show info icon
        labMaterialsPercentage: 100, // Should show happy face
      },
    ];

    const { container } = render(
      <PublicationComplianceTable {...defaultProps} data={data} />,
    );

    // Check that all performance icons are rendered (they are SVG elements)
    const performanceIcons = container.querySelectorAll('svg');
    expect(performanceIcons.length).toBeGreaterThan(0);
  });

  it('renders N/A for undefined values', async () => {
    const { getAllByText } = render(
      <PublicationComplianceTable
        {...defaultProps}
        data={[
          {
            ...publicationComplianceData,
            numberOfPublications: null,
            datasetsPercentage: null,
            protocolsPercentage: null,
            codePercentage: null,
            labMaterialsPercentage: null,
            overallCompliance: null,
          },
        ]}
      />,
    );
    expect(getAllByText('N/A')).toHaveLength(5);
  });

  it('renders N/A for limited data', () => {
    const data = [
      {
        ...publicationComplianceData,
        datasetsRanking: 'LIMITED DATA',
        protocolsRanking: 'LIMITED DATA',
        codeRanking: 'LIMITED DATA',
        labMaterialsRanking: 'LIMITED DATA',
        overallCompliance: null,
      },
    ];
    render(<PublicationComplianceTable {...defaultProps} data={data} />);
    expect(screen.getAllByText('N/A')).toHaveLength(5);
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
        overallCompliance: 55,
        datasetsPercentage: 85,
        protocolsPercentage: 70,
        codePercentage: 65,
        labMaterialsPercentage: 53,
        datasetsRanking: 'ADEQUATE',
        protocolsRanking: 'NEEDS IMPROVEMENT',
        codeRanking: 'NEEDS IMPROVEMENT',
        labMaterialsRanking: 'NEEDS IMPROVEMENT',
      },
    ];

    render(<PublicationComplianceTable {...defaultProps} data={data} />);

    expect(screen.getByText('Test Team')).toBeInTheDocument();
    expect(screen.getByText('Test Team 2')).toBeInTheDocument();
    expect(screen.getByText('55%')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getAllByText('70%')).toHaveLength(2);
    expect(screen.getByText('65%')).toBeInTheDocument();
    expect(screen.getByText('53%')).toBeInTheDocument();
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
});
