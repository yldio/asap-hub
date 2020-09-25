import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import LibraryCard from '../LibraryCard';

const libraryCardProps: ComponentProps<typeof LibraryCard> = {
  title: 'Output 1',
  type: 'proposal',
  href: '#',
  teamHref: '#',
  publishDate: new Date().toISOString(),
  created: new Date().toISOString(),
};

it('renders the title', () => {
  const { getByRole } = render(
    <LibraryCard {...libraryCardProps} title="test123" />,
  );
  expect(getByRole('heading').textContent).toEqual('test123');
  expect(getByRole('heading').tagName).toEqual('H2');
});

it('displays published date is undefined', () => {
  const { getByText } = render(
    <LibraryCard
      {...libraryCardProps}
      publishDate={new Date(2019, 3, 3, 14, 32).toISOString()}
      created={new Date(2020, 6, 12, 14, 32).toISOString()}
    />,
  );
  expect(getByText(/Originally Published/i).textContent).toMatchInlineSnapshot(
    `"Originally Published: 4th April 2019"`,
  );
});

it('displays created date when published date is undefined', () => {
  const { getByText } = render(
    <LibraryCard
      {...libraryCardProps}
      publishDate={undefined}
      created={new Date(2020, 6, 12, 14, 32).toISOString()}
    />,
  );
  expect(getByText(/Originally Published/i).textContent).toMatchInlineSnapshot(
    `"Originally Published: 7th July 2020"`,
  );
});
