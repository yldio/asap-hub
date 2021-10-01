import { render } from '@testing-library/react';
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
  const { getByRole, getByText } = render(
    <ResultList {...props} numberOfItems={numberOfItems}>
      cards
    </ResultList>,
  );
  expect(getByRole('banner')).toContainElement(getByText(text));
});

it('renders the children', () => {
  const { getByRole, getByText } = render(
    <ResultList {...props}>cards</ResultList>,
  );
  expect(getByRole('main')).toContainElement(getByText('cards'));
});

it('renders no results found', () => {
  const { getByText, queryByText, queryByRole } = render(
    <ResultList
      {...props}
      numberOfItems={0}
      numberOfPages={1}
      currentPageIndex={0}
    >
      cards
    </ResultList>,
  );
  expect(queryByText(/cards/i)).not.toBeInTheDocument();
  expect(queryByText(/\d+ result/i)).not.toBeInTheDocument();
  expect(queryByRole('navigation')).not.toBeInTheDocument();
  expect(getByText(/no matches/i)).toBeVisible();
});

it('renders page controls', () => {
  const { getByRole, getByTitle } = render(
    <ResultList {...props} numberOfPages={2}>
      cards
    </ResultList>,
  );
  expect(getByRole('navigation')).toContainElement(getByTitle(/next page/i));
});

it('renders export link', () => {
  const { queryByText, getByText, rerender } = render(
    <ResultList {...props} exportResults={undefined}>
      cards
    </ResultList>,
  );
  expect(queryByText(/export/i)).toBeNull();
  const mockExport = jest.fn(() => Promise.resolve());
  rerender(
    <ResultList {...props} exportResults={mockExport}>
      cards
    </ResultList>,
  );
  userEvent.click(getByText(/export/i));
  expect(mockExport).toHaveBeenCalled();
});

it('triggers an error toast when export fails', async () => {
  const mockToast = jest.fn();
  const mockExport = jest.fn(() => Promise.reject());
  const { getByText } = render(
    <ToastContext.Provider value={mockToast}>
      <ResultList {...props} exportResults={mockExport}>
        cards
      </ResultList>
    </ToastContext.Provider>,
  );
  userEvent.click(getByText(/export/i));
  expect(mockExport).toHaveBeenCalled();
  await waitFor(() =>
    expect(mockToast).toHaveBeenCalledWith(
      expect.stringMatching(/issue exporting/i),
    ),
  );
});
