import { teamProductivityPerformance } from '@asap-hub/fixtures';
import {
  SortTeamProductivity,
  teamProductivityInitialSortingDirection,
  TeamProductivityResponse,
} from '@asap-hub/model';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import TeamProductivityTable from '../TeamProductivityTable';

describe('TeamProductivityTable', () => {
  const pageControlsProps = {
    numberOfPages: 1,
    currentPageIndex: 0,
    renderPageHref: () => '',
  };

  const defaultProps: ComponentProps<typeof TeamProductivityTable> = {
    ...pageControlsProps,
    performance: teamProductivityPerformance,
    data: [],
    sort: 'team_asc' as SortTeamProductivity,
    setSort: jest.fn(),
    sortingDirection: teamProductivityInitialSortingDirection,
    setSortingDirection: jest.fn(),
  };

  const teamProductivity: TeamProductivityResponse = {
    id: '1',
    name: 'Test Team',
    isInactive: false,
    Article: 9,
    Bioinformatics: 7,
    Dataset: 5,
    'Lab Resource': 1,
    Protocol: 3,
  };

  it('renders data', () => {
    const data = [teamProductivity];
    const { getByText } = render(
      <TeamProductivityTable {...defaultProps} data={data} />,
    );
    expect(getByText('Test Team')).toBeInTheDocument();
  });

  it('displays the caption and icon in row values', () => {
    const data = [teamProductivity];
    const { getByText, getAllByTitle } = render(
      <TeamProductivityTable {...defaultProps} data={data} />,
    );
    expect(getByText('Article:')).toBeVisible();
    expect(getByText('Bioinformatics:')).toBeVisible();
    expect(getByText('Datasets:')).toBeVisible();
    expect(getByText('Lab Resources:')).toBeVisible();
    expect(getByText('Protocols:')).toBeVisible();
    expect(getAllByTitle('Below Average').length).toEqual(6);
    expect(getAllByTitle('Average').length).toEqual(8);
    expect(getAllByTitle('Above Average').length).toEqual(6);
  });

  it('renders inactive badge', () => {
    const data = [
      {
        ...teamProductivity,
        isInactive: true,
      },
    ];
    const { getByTitle } = render(
      <TeamProductivityTable {...defaultProps} data={data} />,
    );
    expect(getByTitle('Inactive Team')).toBeInTheDocument();
  });

  it.each`
    sort                     | sortingDirection                                                          | iconTitle                                                   | newSort                  | newSortingDirection
    ${'team_asc'}            | ${{ ...teamProductivityInitialSortingDirection, team: 'asc' }}            | ${'Active Alphabetical Ascending Sort Icon'}                | ${'team_desc'}           | ${{ ...teamProductivityInitialSortingDirection, team: 'desc' }}
    ${'team_desc'}           | ${{ ...teamProductivityInitialSortingDirection, team: 'desc' }}           | ${'Active Alphabetical Descending Sort Icon'}               | ${'team_asc'}            | ${{ ...teamProductivityInitialSortingDirection, team: 'asc' }}
    ${'article_asc'}         | ${{ ...teamProductivityInitialSortingDirection, article: 'asc' }}         | ${'Inactive Alphabetical Ascending Sort Icon'}              | ${'team_asc'}            | ${{ ...teamProductivityInitialSortingDirection, team: 'asc' }}
    ${'team_desc'}           | ${{ ...teamProductivityInitialSortingDirection, article: 'desc' }}        | ${'Article Inactive Numerical Descending Sort Icon'}        | ${'article_desc'}        | ${{ ...teamProductivityInitialSortingDirection, article: 'desc' }}
    ${'article_asc'}         | ${{ ...teamProductivityInitialSortingDirection, article: 'asc' }}         | ${'Article Active Numerical Ascending Sort Icon'}           | ${'article_desc'}        | ${{ ...teamProductivityInitialSortingDirection, article: 'desc' }}
    ${'article_desc'}        | ${{ ...teamProductivityInitialSortingDirection, article: 'desc' }}        | ${'Article Active Numerical Descending Sort Icon'}          | ${'article_asc'}         | ${{ ...teamProductivityInitialSortingDirection, article: 'asc' }}
    ${'team_desc'}           | ${{ ...teamProductivityInitialSortingDirection, bioinformatics: 'desc' }} | ${'Bioinformatics Inactive Numerical Descending Sort Icon'} | ${'bioinformatics_desc'} | ${{ ...teamProductivityInitialSortingDirection, bioinformatics: 'desc' }}
    ${'bioinformatics_asc'}  | ${{ ...teamProductivityInitialSortingDirection, bioinformatics: 'asc' }}  | ${'Bioinformatics Active Numerical Ascending Sort Icon'}    | ${'bioinformatics_desc'} | ${{ ...teamProductivityInitialSortingDirection, bioinformatics: 'desc' }}
    ${'bioinformatics_desc'} | ${{ ...teamProductivityInitialSortingDirection, bioinformatics: 'desc' }} | ${'Bioinformatics Active Numerical Descending Sort Icon'}   | ${'bioinformatics_asc'}  | ${{ ...teamProductivityInitialSortingDirection, bioinformatics: 'asc' }}
    ${'team_desc'}           | ${{ ...teamProductivityInitialSortingDirection, dataset: 'desc' }}        | ${'Dataset Inactive Numerical Descending Sort Icon'}        | ${'dataset_desc'}        | ${{ ...teamProductivityInitialSortingDirection, dataset: 'desc' }}
    ${'dataset_asc'}         | ${{ ...teamProductivityInitialSortingDirection, dataset: 'asc' }}         | ${'Dataset Active Numerical Ascending Sort Icon'}           | ${'dataset_desc'}        | ${{ ...teamProductivityInitialSortingDirection, dataset: 'desc' }}
    ${'dataset_desc'}        | ${{ ...teamProductivityInitialSortingDirection, dataset: 'desc' }}        | ${'Dataset Active Numerical Descending Sort Icon'}          | ${'dataset_asc'}         | ${{ ...teamProductivityInitialSortingDirection, dataset: 'asc' }}
    ${'team_desc'}           | ${{ ...teamProductivityInitialSortingDirection, labResource: 'desc' }}    | ${'Lab Resource Inactive Numerical Descending Sort Icon'}   | ${'lab_resource_desc'}   | ${{ ...teamProductivityInitialSortingDirection, labResource: 'desc' }}
    ${'lab_resource_asc'}    | ${{ ...teamProductivityInitialSortingDirection, labResource: 'asc' }}     | ${'Lab Resource Active Numerical Ascending Sort Icon'}      | ${'lab_resource_desc'}   | ${{ ...teamProductivityInitialSortingDirection, labResource: 'desc' }}
    ${'lab_resource_desc'}   | ${{ ...teamProductivityInitialSortingDirection, labResource: 'desc' }}    | ${'Lab Resource Active Numerical Descending Sort Icon'}     | ${'lab_resource_asc'}    | ${{ ...teamProductivityInitialSortingDirection, labResource: 'asc' }}
    ${'team_desc'}           | ${{ ...teamProductivityInitialSortingDirection, protocol: 'desc' }}       | ${'Protocol Inactive Numerical Descending Sort Icon'}       | ${'protocol_desc'}       | ${{ ...teamProductivityInitialSortingDirection, protocol: 'desc' }}
    ${'protocol_asc'}        | ${{ ...teamProductivityInitialSortingDirection, protocol: 'asc' }}        | ${'Protocol Active Numerical Ascending Sort Icon'}          | ${'protocol_desc'}       | ${{ ...teamProductivityInitialSortingDirection, protocol: 'desc' }}
    ${'protocol_desc'}       | ${{ ...teamProductivityInitialSortingDirection, protocol: 'desc' }}       | ${'Protocol Active Numerical Descending Sort Icon'}         | ${'protocol_asc'}        | ${{ ...teamProductivityInitialSortingDirection, protocol: 'asc' }}
  `(
    'when sort is $sort and user clicks on $iconTitle, the new sort becomes $newSort and the sorting direction $newSortingDirection',
    ({ sort, sortingDirection, iconTitle, newSort, newSortingDirection }) => {
      const setSort = jest.fn();

      const setSortingDirection = jest.fn();
      const { getByTitle } = render(
        <TeamProductivityTable
          data={[teamProductivity]}
          performance={teamProductivityPerformance}
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
