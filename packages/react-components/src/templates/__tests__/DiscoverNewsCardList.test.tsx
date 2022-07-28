import { createNewsResponse } from '@asap-hub/fixtures';
import { render, screen } from '@testing-library/react';

import DiscoverNewsCardList from '../DiscoverNewsCardList';

it('renders the provided title and subtitle', () => {
  render(
    <DiscoverNewsCardList
      title="Tutorials"
      subtitle="Explore our tutorials to understand how you can use the Hub and work with the tools."
      news={[]}
    />,
  );

  expect(screen.getByText(/tutorials/i, { selector: 'h2' })).toBeVisible();
  expect(screen.getByText(/Explore our tutorials/i)).toBeVisible();
  expect(
    screen.getByText(/Need help with a grant-related matter/i),
  ).toBeVisible();
});

it('renders news items', () => {
  render(
    <DiscoverNewsCardList
      title="Tutorials"
      subtitle="Explore our tutorials to understand how you can use the Hub and work with the tools."
      news={[
        createNewsResponse('First One', 'Tutorial'),
        createNewsResponse('Second One', 'Tutorial'),
      ]}
    />,
  );
  expect(
    screen
      .getAllByRole('heading', { level: 4 })
      .map(({ textContent }) => textContent),
  ).toEqual(['Tutorial First One title', 'Tutorial Second One title']);
});
