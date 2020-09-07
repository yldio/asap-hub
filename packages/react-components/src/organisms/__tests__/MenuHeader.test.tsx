import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import MenuHeader from '../MenuHeader';

it('renders the header', () => {
  const { getByAltText } = render(<MenuHeader />);
  expect(getByAltText(/asap.+logo/i)).toBeVisible();
});

it('triggers the menu toggle event', () => {
  const handleToggleMenu = jest.fn();
  const { getByLabelText } = render(
    <MenuHeader onToggleMenu={handleToggleMenu} />,
  );

  userEvent.click(getByLabelText(/toggle menu/i));
  expect(handleToggleMenu).toHaveBeenCalledTimes(1);
});
