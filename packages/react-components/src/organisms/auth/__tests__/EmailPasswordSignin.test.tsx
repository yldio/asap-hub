import { render, fireEvent } from '@testing-library/react';
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
  fireEvent.change(getByLabelText(/e-?mail/i), {
    target: { value: 'john.doe@example.com' },
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
  fireEvent.change(getByLabelText(/password/i), { target: { value: 'PW' } });
  expect(handleChangePassword).toHaveBeenLastCalledWith('PW');
});

it('renders a button that emits signin events', async () => {
  const handleSignin = jest.fn();
  const { getByText } = render(
    <EmailPasswordSignin
      forgotPasswordHref="#"
      email="john.doe@example.com"
      password="PW"
      onSignin={handleSignin}
    />,
  );
  await userEvent.click(getByText(/sign.*in/i));
  expect(handleSignin).toHaveBeenCalled();
});
it('does not emit a signin event without input', async () => {
  const handleSignin = jest.fn();
  const { getByText } = render(
    <EmailPasswordSignin
      forgotPasswordHref="#"
      email=""
      password=""
      onSignin={handleSignin}
    />,
  );
  await userEvent.click(getByText(/sign.*in/i));
  expect(handleSignin).not.toHaveBeenCalled();
});

it('shows a custom email validation message', () => {
  const { getByText, getByLabelText } = render(
    <EmailPasswordSignin
      email="me@example.com"
      password="asdf1234!@£$"
      emailValidationMessage="Email already exists!"
    />,
  );
  expect(getByText('Email already exists!')).toBeVisible();
  expect(getByLabelText(/e-?mail/i)).toBeInvalid();
  expect(getByLabelText(/password/i)).not.toBeInvalid();
});
it('shows a custom password validation message', () => {
  const { getByText, getByLabelText } = render(
    <EmailPasswordSignin
      email="me@example.com"
      password="asdf"
      passwordValidationMessage="Password too weak!"
    />,
  );
  expect(getByText('Password too weak!')).toBeVisible();
  expect(getByLabelText(/e-?mail/i)).not.toBeInvalid();
  expect(getByLabelText(/password/i)).toBeInvalid();
});
