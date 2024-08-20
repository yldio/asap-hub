import { engagementInitialSortingDirection } from '@asap-hub/model';
import { render } from '@testing-library/react';
import { ComponentProps } from 'react';
import { AnalyticsEngagementPageBody } from '..';

describe('AnalyticsEngagementPageBody', () => {
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
    sort: 'team_asc',
    setSort: jest.fn(),
    sortingDirection: engagementInitialSortingDirection,
    setSortingDirection: jest.fn(),
    setTags: jest.fn(),
    tags: [],
  };
  it('renders the page title', () => {
    const { getByText } = render(<AnalyticsEngagementPageBody {...props} />);

    expect(getByText('Representation of Presenters')).toBeInTheDocument();
  });
});
