import { render } from '@testing-library/react';
import { ComponentProps } from 'react';
import {
  sharingPrelimFindingsInitialSortingDirection,
  SharingPrelimFindingsResponse,
  SortSharingPrelimFindings,
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
  };

  const defaultProps: ComponentProps<typeof SharingPrelimFindingsTable> = {
    ...pageControlsProps,
    data: [teamSharingPrelimFindingsData],
    sort: 'team_asc' as SortSharingPrelimFindings,
    setSort: jest.fn(),
    sortingDirection: sharingPrelimFindingsInitialSortingDirection,
    setSortingDirection: jest.fn(),
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
});
