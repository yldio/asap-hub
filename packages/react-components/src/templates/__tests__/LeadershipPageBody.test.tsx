import { initialSortingDirection } from '@asap-hub/model';
import { render, screen } from '@testing-library/react';

import AnalyticsLeadershipPageBody from '../AnalyticsLeadershipPageBody';

const pageControlProps = {
  numberOfPages: 1,
  numberOfItems: 3,
  currentPageIndex: 0,
  renderPageHref: () => '',
};
it('renders the selected metric', () => {
  render(
    <AnalyticsLeadershipPageBody
      searchQuery=""
      onChangeSearch={jest.fn()}
      exportResults={() => Promise.resolve()}
      metric={'interest-group'}
      data={[]}
      setMetric={() => {}}
      sort="team_asc"
      setSort={jest.fn()}
      sortingDirection={initialSortingDirection}
      setSortingDirection={jest.fn()}
      {...pageControlProps}
    />,
  );
  expect(
    screen.getByText(/Interest Group Leadership & Membership/, {
      selector: 'h3',
    }),
  ).toBeVisible();
});
