import React from 'react';
import { render } from '@testing-library/react';

import MainNavigation from '../MainNavigation';

it('renders the navigation items', () => {
  const { getAllByRole } = render(
    <MainNavigation
      networkHref="/network"
      libraryHref="/library"
      newsAndEventsHref="/news-and-events"
    />,
  );
  expect(
    getAllByRole('listitem').map(({ textContent }) => textContent),
  ).toEqual([
    expect.stringMatching(/network/i),
    expect.stringMatching(/library/i),
    expect.stringMatching(/news/i),
  ]);
});

it('applies the passed hrefs', () => {
  const { getAllByRole } = render(
    <MainNavigation
      networkHref="/network"
      libraryHref="/library"
      newsAndEventsHref="/news-and-events"
    />,
  );
  expect(
    getAllByRole('link').find(({ textContent }) =>
      /network/i.test(textContent ?? ''),
    ),
  ).toHaveAttribute('href', '/network');
});
