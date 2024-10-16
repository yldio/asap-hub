import { fireEvent, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import ListControls from '../ListControls';

it('passes through links', () => {
  const { getAllByText, getByText, getByRole } = render(
    <MemoryRouter>
      <ListControls
        cardViewHref="/card?123"
        listViewHref="/list?321"
        isListView={false}
      />
    </MemoryRouter>,
  );
  fireEvent.click(getByRole('button'));
  expect(getByText(/list/i).closest('a')).toHaveAttribute('href', '/list?321');
  expect(getAllByText(/card/i)[1]!.closest('a')).toHaveAttribute(
    'href',
    '/card?123',
  );
});

it('indicates which option is selected', () => {
  const { getByRole, rerender } = render(
    <MemoryRouter>
      <ListControls
        cardViewHref="/card?123"
        listViewHref="/list?321"
        isListView={false}
      />
    </MemoryRouter>,
  );
  expect(getByRole('button').closest('span')).toHaveTextContent(/card/i);
  rerender(
    <ListControls
      cardViewHref="/card?123"
      listViewHref="/list?321"
      isListView={true}
    />,
  );
  expect(getByRole('button').closest('span')).toHaveTextContent(/list/i);
});
