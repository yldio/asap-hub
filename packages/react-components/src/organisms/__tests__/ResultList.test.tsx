import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { ToastContext } from '@asap-hub/react-context';
import { waitFor } from '@testing-library/dom';

import ResultList from '../ResultList';

const props: Omit<ComponentProps<typeof ResultList>, 'children'> = {
  numberOfPages: 1,
  numberOfItems: 3,
  currentPageIndex: 0,
  renderPageHref: () => '',
};

it.each([
  [1, /(^|\D)1 result($|\W)/i],
  [5, /(^|\D)5 results($|\W)/i],
])('shows the number of items', (numberOfItems, text) => {
  render(
    <ResultList {...props} numberOfItems={numberOfItems}>
      cards
    </ResultList>,
  );
  expect(screen.getByRole('banner')).toContainElement(screen.getByText(text));
});

it('renders the children', () => {
  render(<ResultList {...props}>cards</ResultList>);
  expect(screen.getByRole('main')).toContainElement(screen.getByText('cards'));
});

it('renders no results found', () => {
  render(
    <ResultList
      {...props}
      numberOfItems={0}
      numberOfPages={1}
      currentPageIndex={0}
    >
      cards
    </ResultList>,
  );
  expect(screen.queryByText(/cards/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/\d+ result/i)).not.toBeInTheDocument();
  expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  expect(screen.getByText(/no matches/i)).toBeVisible();
});

it('renders page controls', () => {
  render(
    <ResultList {...props} numberOfPages={2}>
      cards
    </ResultList>,
  );
  expect(screen.getByRole('navigation')).toContainElement(
    screen.getByTitle(/next page/i),
  );
});

it('renders export link', () => {
  const { rerender } = render(
    <ResultList {...props} exportResults={undefined}>
      cards
    </ResultList>,
  );
  expect(screen.queryByText(/export/i)).toBeNull();
  const mockExport = jest.fn(() => Promise.resolve());
  rerender(
    <ResultList {...props} exportResults={mockExport}>
      cards
    </ResultList>,
  );
  userEvent.click(screen.getByText(/export/i));
  expect(mockExport).toHaveBeenCalled();
});

it('triggers an error toast when export fails', async () => {
  const mockToast = jest.fn();
  const mockExport = jest.fn(() => Promise.reject());
  render(
    <ToastContext.Provider value={mockToast}>
      <ResultList {...props} exportResults={mockExport}>
        cards
      </ResultList>
    </ToastContext.Provider>,
  );
  userEvent.click(screen.getByText(/export/i));
  expect(mockExport).toHaveBeenCalled();
  await waitFor(() =>
    expect(mockToast).toHaveBeenCalledWith(
      expect.stringMatching(/issue exporting/i),
    ),
  );
});

it('renders custom component when no results found', () => {
  const noEventsComponent = <>Custom No Events Component</>;

  render(
    <ResultList
      {...props}
      numberOfItems={0}
      numberOfPages={1}
      currentPageIndex={0}
      noEventsComponent={noEventsComponent}
    >
      cards
    </ResultList>,
  );
  expect(screen.queryByText(/Custom No Events Component/i)).toBeInTheDocument();
});
