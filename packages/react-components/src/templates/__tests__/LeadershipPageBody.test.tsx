import { initialSortingDirection } from '@asap-hub/model';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AnalyticsLeadershipPageBody from '../AnalyticsLeadershipPageBody';

const pageControlProps = {
  numberOfPages: 1,
  numberOfItems: 3,
  currentPageIndex: 0,
  renderPageHref: () => '',
};

const renderComponent = (props = {}) => {
  return render(
    <AnalyticsLeadershipPageBody
      tags={[]}
      setTags={jest.fn()}
      exportResults={() => Promise.resolve()}
      metric={'interest-group'}
      data={[]}
      setMetric={() => {}}
      sort="team_asc"
      setSort={jest.fn()}
      sortingDirection={initialSortingDirection}
      setSortingDirection={jest.fn()}
      {...props}
      {...pageControlProps}
    />,
  );
};
it('renders the selected metric', () => {
  renderComponent();
  expect(
    screen.getByText(/Interest Group Leadership & Membership/, {
      selector: 'h3',
    }),
  ).toBeVisible();
});

describe('search', () => {
  const getSearchBox = () => {
    const searchContainer = screen.getByRole('search') as HTMLElement;
    return within(searchContainer).getByRole('textbox') as HTMLInputElement;
  };

  it('displays supplied tag', () => {
    renderComponent({ tags: ['key'] });
    expect(screen.getByText('key')).toBeVisible();
  });

  it('renders no option message', async () => {
    const loadTags = jest.fn();
    loadTags.mockResolvedValue([]);
    renderComponent({
      loadTags,
    });

    userEvent.type(getSearchBox(), 'foo');
    expect(loadTags).toHaveBeenCalled();
    await waitFor(() =>
      expect(screen.getByText('No results found')).toBeVisible(),
    );
  });
  it('will call set tags when a tag has been selected', async () => {
    const loadTags = jest
      .fn()
      .mockResolvedValue([{ label: 'foo', value: 'foo' }]);
    const setTags = jest.fn();
    renderComponent({
      loadTags,
      setTags,
    });

    userEvent.type(getSearchBox(), 'does not matter');
    await waitFor(() => expect(screen.getByText('foo')).toBeVisible());
    userEvent.click(screen.getByText('foo'));
    expect(setTags).toHaveBeenCalledWith(['foo']);
  });
});
