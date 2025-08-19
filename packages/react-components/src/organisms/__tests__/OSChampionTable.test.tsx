import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import { ComponentProps } from 'react';
import {
  osChampionInitialSortingDirection,
  OSChampionResponse,
  SortOSChampion,
} from '@asap-hub/model';
import OSChampionTable from '../OSChampionTable';

describe('OSChampionTable', () => {
  const pageControlsProps = {
    numberOfPages: 1,
    currentPageIndex: 0,
    renderPageHref: () => '',
  };

  const osChampionData: OSChampionResponse = {
    teamId: 'team-id-1',
    teamName: 'Test Team',
    isTeamInactive: false,
    teamAwardsCount: 2,
    users: [
      {
        id: 'user-id-1',
        name: 'Test User',
        awardsCount: 2,
      },
    ],
  };

  const defaultProps: ComponentProps<typeof OSChampionTable> = {
    ...pageControlsProps,
    data: [osChampionData],
    sort: 'team_asc' as SortOSChampion,
    setSort: jest.fn(),
    sortingDirection: osChampionInitialSortingDirection,
    setSortingDirection: jest.fn(),
  };

  it('renders data', () => {
    const { getByText } = render(<OSChampionTable {...defaultProps} />);
    expect(getByText('Test Team')).toBeInTheDocument();
  });

  it('renders inactive badge', () => {
    const data = [
      {
        ...osChampionData,
        isTeamInactive: true,
      },
    ];
    const { getByTitle } = render(
      <OSChampionTable {...defaultProps} data={data} />,
    );
    expect(getByTitle('Inactive Team')).toBeInTheDocument();
  });

  it('allows collapsing and expanding rows', () => {
    const { getByRole, getByText, queryByText } = render(
      <OSChampionTable {...defaultProps} />,
    );
    expect(queryByText('Test User')).not.toBeInTheDocument();
    fireEvent.click(getByRole('button'));
    expect(getByText('Test User')).toBeVisible();
  });
});
