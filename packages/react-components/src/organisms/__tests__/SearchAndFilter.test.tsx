import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SearchAndFilter from '../SearchAndFilter';
import { noop } from '../../utils';

const props: ComponentProps<typeof SearchAndFilter> = {
  searchQuery: '',
  searchPlaceholder: '',
  onChangeSearch: noop,
  filterOptions: [],
  filterTitle: '',
};
it('renders the search controls', () => {
  const { getByRole } = render(<SearchAndFilter {...props} />);
  expect(getByRole('searchbox')).toBeVisible();
  expect(getByRole('button')).toBeVisible();
});

it('Passes query correctly', () => {
  const { getByRole } = render(
    <SearchAndFilter {...props} searchQuery="test123" />,
  );
  expect(getByRole('searchbox')).toHaveValue('test123');
});

it('shows and hides the dropdown menu', () => {
  const { getByRole, getByText } = render(
    <SearchAndFilter {...props} filterTitle="Filter Dropdown" />,
  );
  const filterButton = getByRole('button');
  userEvent.click(filterButton);
  expect(getByText('Filter Dropdown')).toBeVisible();
  userEvent.click(filterButton);
  expect(getByText('Filter Dropdown')).not.toBeVisible();
});
