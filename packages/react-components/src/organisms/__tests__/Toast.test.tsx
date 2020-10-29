import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Toast from '../Toast';

it('renders the children', () => {
  const { getByText } = render(<Toast>error message</Toast>);
  expect(getByText('error message')).toBeVisible();
});

it('emits close events', () => {
  const handleClose = jest.fn();
  const { getByTitle } = render(
    <Toast onClose={handleClose}>error message</Toast>,
  );

  userEvent.click(getByTitle(/close/i));
  expect(handleClose).toHaveBeenCalled();
});
