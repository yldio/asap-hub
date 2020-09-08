import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import UserMenuButton from '../UserMenuButton';

it('renders a button to toggle the user menu', () => {
  const { getByLabelText } = render(<UserMenuButton />);
  expect(getByLabelText(/toggle.+user menu/i)).toHaveTextContent(/user menu/i);
});

it('triggers the click event', () => {
  const handleClick = jest.fn();
  const { getByLabelText } = render(<UserMenuButton onClick={handleClick} />);

  userEvent.click(getByLabelText(/toggle.+user menu/i));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
