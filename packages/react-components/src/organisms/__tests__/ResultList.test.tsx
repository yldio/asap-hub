import { render } from '@testing-library/react';

import ResultList from '../ResultList';

it.each([
  [1, /(^|\D)1 result($|\W)/i],
  [5, /(^|\D)5 results($|\W)/i],
])('shows the number of items', (numberOfItems, text) => {
  const { getByRole, getByText } = render(
    <ResultList
      numberOfItems={numberOfItems}
      numberOfPages={1}
      currentPageIndex={0}
      renderPageHref={() => ''}
    >
      cards
    </ResultList>,
  );
  expect(getByRole('banner')).toContainElement(getByText(text));
});

it('renders the children', () => {
  const { getByRole, getByText } = render(
    <ResultList
      numberOfItems={3}
      numberOfPages={1}
      currentPageIndex={0}
      renderPageHref={() => ''}
    >
      cards
    </ResultList>,
  );
  expect(getByRole('main')).toContainElement(getByText('cards'));
});

it('renders no results found', () => {
  const { getByText, queryByText, queryByRole } = render(
    <ResultList
      numberOfItems={0}
      numberOfPages={1}
      currentPageIndex={0}
      renderPageHref={() => ''}
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
    <ResultList
      numberOfItems={1}
      numberOfPages={2}
      currentPageIndex={0}
      renderPageHref={() => ''}
    >
      cards
    </ResultList>,
  );
  expect(getByRole('navigation')).toContainElement(getByTitle(/next page/i));
});
