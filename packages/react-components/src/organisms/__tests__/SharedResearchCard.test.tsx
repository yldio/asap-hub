import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import SharedResearchCard from '../SharedResearchCard';

const libraryCardProps: ComponentProps<typeof SharedResearchCard> = {
  title: 'Output 1',
  type: 'Proposal',
  href: '#',
  publishDate: new Date().toISOString(),
  created: new Date().toISOString(),
};

it('renders the title', () => {
  const { getByRole } = render(
    <SharedResearchCard {...libraryCardProps} title="test123" />,
  );
  expect(getByRole('heading').textContent).toEqual('test123');
  expect(getByRole('heading').tagName).toEqual('H2');
});

it('displays published date is undefined', () => {
  const { getByText } = render(
    <SharedResearchCard
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
    <SharedResearchCard
      {...libraryCardProps}
      publishDate={undefined}
      created={new Date(2020, 6, 12, 14, 32).toISOString()}
    />,
  );
  expect(getByText(/Originally Published/i).textContent).toMatchInlineSnapshot(
    `"Originally Published: 7th July 2020"`,
  );
});

it('displays team information when present', () => {
  const { getByText } = render(
    <SharedResearchCard
      {...libraryCardProps}
      team={{
        id: '123',
        displayName: 'A',
        href: '/network/teams/123',
      }}
    />,
  );
  const link = getByText('Team A', { selector: 'a' }) as HTMLAnchorElement;
  expect(link.href).toEqual('http://localhost/network/teams/123');
});
