import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ForgotPasswordPage from '../ForgotPasswordPage';

it('renders an H1', () => {
  const { getByRole } = render(<ForgotPasswordPage email="" />);
  expect(getByRole('heading')).toHaveTextContent(/password/i);
});

it('renders a text field with the passed email', () => {
  const { getByLabelText } = render(
    <ForgotPasswordPage email="john.doe@example.com" />,
  );
  expect(getByLabelText(/e-?mail/i)).toHaveValue('john.doe@example.com');
});

it('emits email change events', () => {
  const handleChangeEmail = jest.fn();
  const { getByLabelText } = render(
    <ForgotPasswordPage email="" onChangeEmail={handleChangeEmail} />,
  );

  userEvent.type(getByLabelText(/e-?mail/i), 'batman@example.com', {
    allAtOnce: true,
  });
  expect(handleChangeEmail).toHaveBeenLastCalledWith('batman@example.com');
});

it('emits submit events', () => {
  const handleSubmit = jest.fn();
  const { getByText } = render(
    <ForgotPasswordPage email="" onSubmit={handleSubmit} />,
  );

  userEvent.click(getByText(/reset/i, { selector: 'button *' }));
  expect(handleSubmit).toHaveBeenCalled();
});

it('emits go back events', () => {
  const handleGoBack = jest.fn();
  const { getByText } = render(
    <ForgotPasswordPage email="" onGoBack={handleGoBack} />,
  );

  userEvent.click(getByText(/back/i, { selector: 'button *' }));
  expect(handleGoBack).toHaveBeenCalled();
});
