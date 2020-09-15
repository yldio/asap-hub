import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import MainNavigation from '../MainNavigation';

const props: ComponentProps<typeof MainNavigation> = {
  networkHref: '/network',
  libraryHref: '/library',
  newsAndEventsHref: '/news-and-events',
};

it('renders the navigation items', () => {
  const { getAllByRole } = render(<MainNavigation {...props} />);
  expect(
    getAllByRole('listitem').map(({ textContent }) => textContent),
  ).toEqual([
    expect.stringMatching(/network/i),
    expect.stringMatching(/library/i),
    expect.stringMatching(/news/i),
  ]);
});

it('applies the passed href', () => {
  const { getAllByRole } = render(
    <MainNavigation {...props} networkHref="/network" />,
  );
  expect(
    getAllByRole('link').find(({ textContent }) =>
      /network/i.test(textContent ?? ''),
    ),
  ).toHaveAttribute('href', '/network');
});
