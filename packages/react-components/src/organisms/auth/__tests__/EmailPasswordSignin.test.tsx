import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import EmailPasswordSignin from '../EmailPasswordSignin';

it('renders an email field with the given email value', () => {
  const { getByLabelText } = render(
    <EmailPasswordSignin
      forgotPasswordHref="#"
      email="john.doe@example.com"
      password=""
    />,
  );
  expect(getByLabelText(/e-?mail/i)).toHaveValue('john.doe@example.com');
});
it('emits email change events', async () => {
  const handleChangeEmail = jest.fn();
  const { getByLabelText } = render(
    <EmailPasswordSignin
      forgotPasswordHref="#"
      email=""
      password=""
      onChangeEmail={handleChangeEmail}
    />,
  );
  await userEvent.type(getByLabelText(/e-?mail/i), 'john.doe@example.com', {
    allAtOnce: true,
  });
  expect(handleChangeEmail).toHaveBeenLastCalledWith('john.doe@example.com');
});

it('renders a password field with the given password value', () => {
  const { getByLabelText } = render(
    <EmailPasswordSignin forgotPasswordHref="#" email="" password="PW" />,
  );
  expect(getByLabelText(/password/i)).toHaveValue('PW');
});
it('emits password change events', async () => {
  const handleChangePassword = jest.fn();
  const { getByLabelText } = render(
    <EmailPasswordSignin
      forgotPasswordHref="#"
      email=""
      password=""
      onChangePassword={handleChangePassword}
    />,
  );
  await userEvent.type(getByLabelText(/password/i), 'PW', { allAtOnce: true });
  expect(handleChangePassword).toHaveBeenLastCalledWith('PW');
});

it('renders a button that emits signin events', () => {
  const handleSignin = jest.fn();
  const { getByText } = render(
    <EmailPasswordSignin
      forgotPasswordHref="#"
      email="john.doe@example.com"
      password="PW"
      onSignin={handleSignin}
    />,
  );
  userEvent.click(getByText(/sign.*in/i));
  expect(handleSignin).toHaveBeenCalled();
});

it('does not emit a signin event without input', () => {
  const handleSignin = jest.fn();
  const { getByText } = render(
    <EmailPasswordSignin
      forgotPasswordHref="#"
      email=""
      password=""
      onSignin={handleSignin}
    />,
  );
  userEvent.click(getByText(/sign.*in/i));
  expect(handleSignin).not.toHaveBeenCalled();
});
