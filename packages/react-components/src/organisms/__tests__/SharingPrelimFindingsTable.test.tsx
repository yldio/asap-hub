import { fireEvent, render } from '@testing-library/react';
import { ComponentProps } from 'react';
import {
  sharingPrelimFindingsInitialSortingDirection,
  SharingPrelimFindingsResponse,
} from '@asap-hub/model';
import SharingPrelimFindingsTable from '../SharingPrelimFindingsTable';

describe('SharingPrelimFindingsTable', () => {
  const pageControlsProps = {
    numberOfPages: 1,
    currentPageIndex: 0,
    renderPageHref: () => '',
  };

  const teamSharingPrelimFindingsData: SharingPrelimFindingsResponse = {
    teamId: '1',
    teamName: 'Test Team',
    isTeamInactive: false,
    teamPercentShared: 90,
    limitedData: false,
  };

  const defaultProps: ComponentProps<typeof SharingPrelimFindingsTable> = {
    ...pageControlsProps,
    data: [teamSharingPrelimFindingsData],
    sort: 'team_asc',
    setSort: jest.fn(),
    sortingDirection: sharingPrelimFindingsInitialSortingDirection,
  };

  it('renders data', () => {
    const { getByText } = render(
      <SharingPrelimFindingsTable {...defaultProps} />,
    );
    expect(getByText('Test Team')).toBeInTheDocument();
  });

  it('renders team inactive badge', () => {
    const data = [
      {
        ...teamSharingPrelimFindingsData,
        isTeamInactive: true,
      },
    ];
    const { getByTitle } = render(
      <SharingPrelimFindingsTable {...defaultProps} data={data} />,
    );
    expect(getByTitle('Inactive Team')).toBeInTheDocument();
  });
  it('renders N/A when limitedData is true', () => {
    const teamprelimFindingsData = {
      ...teamSharingPrelimFindingsData,
      teamPercentShared: null,
      limitedData: true,
    };
    const data = [teamprelimFindingsData];
    const renderer = render(
      <SharingPrelimFindingsTable {...defaultProps} data={data} />,
    );
    expect(renderer.getByText('N/A')).toBeInTheDocument();

    renderer.rerender(
      <SharingPrelimFindingsTable
        {...defaultProps}
        data={[
          {
            ...teamprelimFindingsData,
            limitedData: true,
            teamPercentShared: 0,
          },
        ]}
      />,
    );
    expect(renderer.getByText('N/A')).toBeInTheDocument();
  });

  it('toggles team sort between team_asc and team_desc', () => {
    const setSort = jest.fn();

    const { getByRole } = render(
      <SharingPrelimFindingsTable {...defaultProps} setSort={setSort} />,
    );

    const button = getByRole('button', { name: /sort by team/i });
    fireEvent.click(button);

    expect(setSort).toHaveBeenCalledTimes(1);
    expect(setSort).toHaveBeenCalledWith('team_desc');
  });

  it('toggles team sort from team_desc to team_asc', () => {
    const setSort = jest.fn();

    const { getByRole } = render(
      <SharingPrelimFindingsTable
        {...defaultProps}
        sort="team_desc"
        sortingDirection={{
          ...sharingPrelimFindingsInitialSortingDirection,
          team: 'desc',
        }}
        setSort={setSort}
      />,
    );

    const button = getByRole('button', { name: /sort by team/i });
    fireEvent.click(button);

    expect(setSort).toHaveBeenCalledTimes(1);
    expect(setSort).toHaveBeenCalledWith('team_asc');
  });

  it('activates percent shared sort and sets it to percent_shared_desc from inactive state', () => {
    const setSort = jest.fn();

    const { getByRole } = render(
      <SharingPrelimFindingsTable {...defaultProps} setSort={setSort} />,
    );

    const button = getByRole('button', { name: /sort by percent shared/i });
    fireEvent.click(button);

    expect(setSort).toHaveBeenCalledTimes(1);
    expect(setSort).toHaveBeenCalledWith('percent_shared_desc');
  });

  it('toggles percent shared sort from percent_shared_desc to percent_shared_asc', () => {
    const setSort = jest.fn();

    const { getByRole } = render(
      <SharingPrelimFindingsTable
        {...defaultProps}
        sort="percent_shared_desc"
        sortingDirection={{
          ...sharingPrelimFindingsInitialSortingDirection,
          percentShared: 'desc',
        }}
        setSort={setSort}
      />,
    );

    const button = getByRole('button', { name: /sort by percent shared/i });
    fireEvent.click(button);

    expect(setSort).toHaveBeenCalledTimes(1);
    expect(setSort).toHaveBeenCalledWith('percent_shared_asc');
  });
});
