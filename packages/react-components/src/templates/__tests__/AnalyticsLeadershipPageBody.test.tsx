import { initialSortingDirection } from '@asap-hub/model';
import { render } from '@testing-library/react';
import { ComponentProps } from 'react';
import { AnalyticsLeadershipPageBody } from '..';

describe('AnalyticsLeadershipPageBody', () => {
  const props: ComponentProps<typeof AnalyticsLeadershipPageBody> = {
    numberOfPages: 1,
    currentPageIndex: 0,
    renderPageHref: () => '',
    setMetric: () => {},
    exportResults: () => Promise.resolve(),
    data: [],
    metric: 'interest-group',
    sort: 'team_asc',
    setSort: jest.fn(),
    sortingDirection: initialSortingDirection,
    setSortingDirection: jest.fn(),
    searchQuery: '',
    onChangeSearch: jest.fn(),
  };
  it('renders interest group tab', () => {
    const { getAllByText } = render(
      <AnalyticsLeadershipPageBody {...props} metric="interest-group" />,
    );

    expect(getAllByText('Interest Group Leadership & Membership').length).toBe(
      2,
    );
  });

  it('renders working group tab', () => {
    const { getAllByText } = render(
      <AnalyticsLeadershipPageBody {...props} metric="working-group" />,
    );

    expect(getAllByText('Working Group Leadership & Membership').length).toBe(
      2,
    );
  });
});
