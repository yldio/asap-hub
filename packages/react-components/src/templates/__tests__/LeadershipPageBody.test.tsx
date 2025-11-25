import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AnalyticsLeadershipPageBody from '../AnalyticsLeadershipPageBody';

const pageControlProps = {
  numberOfPages: 1,
  numberOfItems: 3,
  currentPageIndex: 0,
  renderPageHref: () => '',
};

const renderComponent = (props = {}) =>
  render(
    <AnalyticsLeadershipPageBody
      isOSChampionEnabled={true}
      tags={[]}
      setTags={jest.fn()}
      exportResults={() => Promise.resolve()}
      metric={'interest-group'}
      setMetric={() => {}}
      children={<></>}
      {...props}
      {...pageControlProps}
    />,
  );

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

    await userEvent.type(getSearchBox(), 'foo');

    await waitFor(() => {
      expect(loadTags).toHaveBeenCalled();
      expect(screen.getByText('No results found')).toBeVisible();
    });
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

    await userEvent.type(getSearchBox(), 'does not matter');
    await waitFor(() => expect(screen.getByText('foo')).toBeVisible());
    await userEvent.click(screen.getByText('foo'));
    expect(setTags).toHaveBeenCalledWith(['foo']);
  });
});
