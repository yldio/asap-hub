import { engagementInitialSortingDirection } from '@asap-hub/model';
import { render } from '@testing-library/react';
import { ComponentProps } from 'react';
import { AnalyticsEngagementPageBody } from '..';

describe('AnalyticsEngagementPageBody', () => {
  const metric = {
    belowAverageMin: 1,
    belowAverageMax: 1,
    averageMin: 1,
    averageMax: 1,
    aboveAverageMin: 1,
    aboveAverageMax: 1,
  };

  const props: ComponentProps<typeof AnalyticsEngagementPageBody> = {
    data: [
      {
        id: '1',
        name: 'Test Team',
        inactiveSince: null,
        memberCount: 1,
        eventCount: 2,
        totalSpeakerCount: 3,
        uniqueAllRolesCount: 3,
        uniqueAllRolesCountPercentage: 100,
        uniqueKeyPersonnelCount: 2,
        uniqueKeyPersonnelCountPercentage: 67,
      },
    ],
    numberOfPages: 1,
    currentPageIndex: 0,
    renderPageHref: () => '',
    exportResults: () => Promise.resolve(),
    sort: 'team_asc',
    setSort: jest.fn(),
    sortingDirection: engagementInitialSortingDirection,
    setSortingDirection: jest.fn(),
    setTags: jest.fn(),
    tags: [],
    performance: {
      events: metric,
      totalSpeakers: metric,
      uniqueAllRoles: metric,
      uniqueKeyPersonnel: metric,
    },
  };
  it('renders the page title', () => {
    const { getByText } = render(<AnalyticsEngagementPageBody {...props} />);

    expect(getByText('Representation of Presenters')).toBeInTheDocument();
  });
});
