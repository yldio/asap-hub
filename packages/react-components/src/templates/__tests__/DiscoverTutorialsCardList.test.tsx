import { createNewsResponseWithType } from '@asap-hub/fixtures';
import { render, screen } from '@testing-library/react';

import DiscoverTutorialsCardList from '../DiscoverTutorialsCardList';

it('renders the provided title and subtitle', () => {
  render(
    <DiscoverTutorialsCardList
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
    <DiscoverTutorialsCardList
      title="Tutorials"
      subtitle="Explore our tutorials to understand how you can use the Hub and work with the tools."
      news={[
        createNewsResponseWithType({ key: 'First One', type: 'Tutorial' }),
        createNewsResponseWithType({ key: 'Second One', type: 'Tutorial' }),
      ]}
    />,
  );
  expect(
    screen
      .getAllByRole('heading', { level: 4 })
      .map(({ textContent }) => textContent),
  ).toEqual(['Tutorial First One title', 'Tutorial Second One title']);
});
