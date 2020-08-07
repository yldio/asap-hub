import React from 'react';
import { render } from '@testing-library/react';

import TabNav from '../TabNav';

it('renders the children in a list', () => {
  const { getAllByRole } = render(
    <TabNav>
      <a href="/tab1">Tab 1</a>
      <a href="/tab2">Tab 2</a>
    </TabNav>,
  );
  expect(
    getAllByRole('listitem').map(({ textContent }) => textContent),
  ).toEqual(['Tab 1', 'Tab 2']);
});

it('renders a single child in a list', () => {
  const { getByRole } = render(
    <TabNav>
      <a href="/tab1">Tab 1</a>
    </TabNav>,
  );
  expect(getByRole('listitem')).toHaveTextContent('Tab 1');
});

it('renders the children with spacing in between', () => {
  const { getAllByRole } = render(
    <TabNav>
      <a href="/tab1">Tab 1</a>
      <a href="/tab2">Tab 2</a>
    </TabNav>,
  );
  const [spaceBetween, spaceAfter] = getAllByRole('listitem').map(
    (item) => getComputedStyle(item).paddingRight,
  );
  expect(Number(spaceBetween.replace(/em$/, ''))).toBeGreaterThan(0);
  expect(Number(spaceAfter.replace(/em$/, ''))).toBe(0);
});
