import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Filter from '../Filter';

it('shows and hides the dropdown menu', () => {
  const { getByRole, getByText } = render(
    <Filter
      filterOptions={[{ label: 'F1', value: 'f1' }]}
      filterTitle="Filter by Stuff"
    />,
  );
  const filterButton = getByRole('button');

  userEvent.click(filterButton);
  expect(getByText('Filter by Stuff')).toBeVisible();

  userEvent.click(filterButton);
  expect(getByText('Filter by Stuff')).not.toBeVisible();
});

it('hides the dropdown menu when the title changes', () => {
  const { rerender, getByRole, getByText } = render(
    <Filter
      filterOptions={[{ label: 'F1', value: 'f1' }]}
      filterTitle="Filter by Stuff"
    />,
  );
  userEvent.click(getByRole('button'));
  expect(getByText('Filter by Stuff')).toBeVisible();

  rerender(
    <Filter
      filterOptions={[{ label: 'F1', value: 'f1' }]}
      filterTitle="Filter by Things"
    />,
  );
  expect(getByText('Filter by Things')).not.toBeVisible();
});
