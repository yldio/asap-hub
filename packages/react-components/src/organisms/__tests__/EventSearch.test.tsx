import { render } from '@testing-library/react';

import EventSearch from '../EventSearch';

it('renders a searchbox with the search query', () => {
  const { getByRole } = render(<EventSearch searchQuery="searchterm" />);
  expect(getByRole('searchbox')).toHaveValue('searchterm');
});

it('renders a searchbox when there is an empty search query', () => {
  const { getByRole } = render(<EventSearch searchQuery="" />);
  expect(getByRole('searchbox')).toBeVisible();
});

it('does not render a searchbox if there is no search query', () => {
  const { queryByRole } = render(<EventSearch />);
  expect(queryByRole('searchbox')).not.toBeInTheDocument();
});
