import {
  preprintComplianceInitialSortingDirection,
  PreprintComplianceResponse,
  SortPreprintCompliance,
} from '@asap-hub/model';
import { fireEvent, render, screen } from '@testing-library/react';
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
    sort: 'team_asc' as SortPreprintCompliance,
    setSort: jest.fn(),
    sortingDirection: preprintComplianceInitialSortingDirection,
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
    render(
      <PreprintComplianceTable
        {...defaultProps}
        data={[{ ...preprintComplianceData, isTeamInactive: true }]}
      />,
    );
    expect(screen.getByTitle('Inactive Team')).toBeInTheDocument();
  });

  it('renders sort buttons in all sortable headers', () => {
    render(<PreprintComplianceTable {...defaultProps} />);
    expect(
      screen
        .getByRole('columnheader', { name: /Team/ })
        .querySelector('button'),
    ).toBeInTheDocument();
    expect(
      screen
        .getByRole('columnheader', { name: /Number of Preprints/ })
        .querySelector('button'),
    ).toBeInTheDocument();
    expect(
      screen
        .getByRole('columnheader', {
          name: /Posted Prior to Journal Submission/,
        })
        .querySelector('button'),
    ).toBeInTheDocument();
  });

  it('toggles team sort from team_asc to team_desc', () => {
    const setSort = jest.fn();
    render(<PreprintComplianceTable {...defaultProps} setSort={setSort} />);

    const teamHeader = screen.getByRole('columnheader', { name: /Team/ });
    const sortButton = teamHeader.querySelector('button');
    fireEvent.click(sortButton!);

    expect(setSort).toHaveBeenCalledWith('team_desc');
  });

  it('activates number of preprints sort as desc from inactive state', () => {
    const setSort = jest.fn();
    render(<PreprintComplianceTable {...defaultProps} setSort={setSort} />);

    const header = screen.getByRole('columnheader', {
      name: /Number of Preprints/,
    });
    const sortButton = header.querySelector('button');
    fireEvent.click(sortButton!);

    expect(setSort).toHaveBeenCalledWith('number_of_preprints_desc');
  });

  it('toggles number of preprints sort from desc to asc when active', () => {
    const setSort = jest.fn();
    render(
      <PreprintComplianceTable
        {...defaultProps}
        setSort={setSort}
        sort="number_of_preprints_desc"
        sortingDirection={{
          ...preprintComplianceInitialSortingDirection,
          numberOfPreprints: 'desc',
        }}
      />,
    );

    const header = screen.getByRole('columnheader', {
      name: /Number of Preprints/,
    });
    const sortButton = header.querySelector('button');
    fireEvent.click(sortButton!);

    expect(setSort).toHaveBeenCalledWith('number_of_preprints_asc');
  });

  it('activates posted prior sort as desc from inactive state', () => {
    const setSort = jest.fn();
    render(<PreprintComplianceTable {...defaultProps} setSort={setSort} />);

    const header = screen.getByRole('columnheader', {
      name: /Posted Prior to Journal Submission/,
    });
    const sortButton = header.querySelector('button');
    fireEvent.click(sortButton!);

    expect(setSort).toHaveBeenCalledWith('posted_prior_desc');
  });

  it('toggles posted prior sort from desc to asc when active', () => {
    const setSort = jest.fn();
    render(
      <PreprintComplianceTable
        {...defaultProps}
        setSort={setSort}
        sort="posted_prior_desc"
        sortingDirection={{
          ...preprintComplianceInitialSortingDirection,
          postedPriorPercentage: 'desc',
        }}
      />,
    );

    const header = screen.getByRole('columnheader', {
      name: /Posted Prior to Journal Submission/,
    });
    const sortButton = header.querySelector('button');
    fireEvent.click(sortButton!);

    expect(setSort).toHaveBeenCalledWith('posted_prior_asc');
  });

  it('renders N/A for null postedPriorPercentage', () => {
    render(
      <PreprintComplianceTable
        {...defaultProps}
        data={[{ ...preprintComplianceData, postedPriorPercentage: null }]}
      />,
    );
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });
});
