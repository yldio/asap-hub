import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import MenuButton from '../MenuButton';

it('renders a button to toggle the menu', () => {
  const { getByLabelText, getByTitle } = render(<MenuButton />);
  expect(getByLabelText(/toggle menu/i)).toContainElement(getByTitle(/menu/i));
});

it('triggers the click event', () => {
  const handleClick = jest.fn();
  const { getByLabelText } = render(<MenuButton onClick={handleClick} />);

  userEvent.click(getByLabelText(/toggle menu/i));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
