import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SearchControls from '../SearchControls';
import { noop } from '../../utils';

const props: ComponentProps<typeof SearchControls> = {
  searchQuery: '',
  placeholder: '',
  onChangeSearch: noop,
  filterOptions: [],
  filterTitle: '',
};
it('renders the search controls', () => {
  const { getByRole } = render(<SearchControls {...props} />);
  expect(getByRole('textbox')).toBeVisible();
  expect(getByRole('button')).toBeVisible();
});

it('Passes query correctly', () => {
  const { getByRole } = render(
    <SearchControls {...props} searchQuery="test123" />,
  );
  expect(getByRole('textbox')).toHaveValue('test123');
});

it('shows and hides the dropdown menu', () => {
  const { getByRole, getByText } = render(
    <SearchControls {...props} filterTitle="Filter Dropdown" />,
  );
  const filterButton = getByRole('button');
  userEvent.click(filterButton);
  expect(getByText('Filter Dropdown')).toBeVisible();
  userEvent.click(filterButton);
  expect(getByText('Filter Dropdown')).not.toBeVisible();
});
