import React from 'react';
import { render } from '@testing-library/react';

import ResultList from '../ResultList';

it.each([
  [0, /(^|\D)0 results($|\W)/i],
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
it('omits the main section if there are no items', () => {
  const { queryByRole } = render(
    <ResultList
      numberOfItems={0}
      numberOfPages={1}
      currentPageIndex={0}
      renderPageHref={() => ''}
    >
      cards
    </ResultList>,
  );
  expect(queryByRole('main')).not.toBeInTheDocument();
});

it('renders page controls', () => {
  const { getByRole, getByTitle } = render(
    <ResultList
      numberOfItems={0}
      numberOfPages={2}
      currentPageIndex={0}
      renderPageHref={() => ''}
    >
      cards
    </ResultList>,
  );
  expect(getByRole('navigation')).toContainElement(getByTitle(/next page/i));
});
