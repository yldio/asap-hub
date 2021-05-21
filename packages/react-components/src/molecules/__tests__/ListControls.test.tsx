import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import ListControls from '../ListControls';

it('passes through links', () => {
  const { getByTitle } = render(
    <ListControls
      cardViewHref="/card?123"
      listViewHref="/list?321"
      isListView={false}
    />,
    { wrapper: MemoryRouter },
  );
  expect(getByTitle(/list/i).closest('a')).toHaveAttribute('href', '/list?321');
  expect(getByTitle(/card/i).closest('a')).toHaveAttribute('href', '/card?123');
});

it('indicates which option is selected', () => {
  const { getByText, rerender } = render(
    <ListControls
      cardViewHref="/card?123"
      listViewHref="/list?321"
      isListView={false}
    />,
    { wrapper: MemoryRouter },
  );
  expect(
    getComputedStyle(getByText(/card/i, { selector: 'p' })).fontWeight,
  ).toBe('bold');
  expect(
    getComputedStyle(getByText(/list/i, { selector: 'p' })).fontWeight,
  ).toBe('');
  rerender(
    <ListControls
      cardViewHref="/card?123"
      listViewHref="/list?321"
      isListView={true}
    />,
  );
  expect(
    getComputedStyle(getByText(/card/i, { selector: 'p' })).fontWeight,
  ).toBe('');
  expect(
    getComputedStyle(getByText(/list/i, { selector: 'p' })).fontWeight,
  ).toBe('bold');
});
