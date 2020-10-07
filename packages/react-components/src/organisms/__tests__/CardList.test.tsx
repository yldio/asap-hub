import React from 'react';
import { render } from '@testing-library/react';

import CardList from '../CardList';

it.each([
  [0, /(^|\D)0 results($|\W)/i],
  [1, /(^|\D)1 result($|\W)/i],
  [5, /(^|\D)5 results($|\W)/i],
])('shows the number of items', (numberOfItems, text) => {
  const { getByRole, getByText } = render(
    <CardList
      numberOfItems={numberOfItems}
      numberOfPages={1}
      currentPageIndex={0}
      renderPageHref={() => ''}
    >
      cards
    </CardList>,
  );
  expect(getByRole('banner')).toContainElement(getByText(text));
});

it('renders the children', () => {
  const { getByRole, getByText } = render(
    <CardList
      numberOfItems={3}
      numberOfPages={1}
      currentPageIndex={0}
      renderPageHref={() => ''}
    >
      cards
    </CardList>,
  );
  expect(getByRole('main')).toContainElement(getByText('cards'));
});
it('omits the main section if there are no items', () => {
  const { queryByRole } = render(
    <CardList
      numberOfItems={0}
      numberOfPages={1}
      currentPageIndex={0}
      renderPageHref={() => ''}
    >
      cards
    </CardList>,
  );
  expect(queryByRole('main')).not.toBeInTheDocument();
});

it('renders page controls', () => {
  const { getByRole, getByTitle } = render(
    <CardList
      numberOfItems={0}
      numberOfPages={2}
      currentPageIndex={0}
      renderPageHref={() => ''}
    >
      cards
    </CardList>,
  );
  expect(getByRole('navigation')).toContainElement(getByTitle(/next page/i));
});
