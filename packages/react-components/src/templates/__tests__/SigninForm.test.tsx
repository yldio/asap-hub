import React from 'react';
import { render } from '@testing-library/react';

import SigninForm from '../SigninForm';

it('renders different headlines in signin and signup mode', () => {
  const { getByRole, rerender } = render(
    <SigninForm email="" password="" forgotPasswordHref="#" />,
  );
  expect(getByRole('heading').textContent).toMatchInlineSnapshot(
    `"Sign in to the ASAP Hub"`,
  );

  rerender(<SigninForm signup email="" password="" forgotPasswordHref="#" />);
  expect(getByRole('heading').textContent).toMatchInlineSnapshot(
    `"Choose a login method"`,
  );
});

it('renders the SSO buttons', () => {
  const { getByText } = render(
    <SigninForm email="" password="" forgotPasswordHref="#" />,
  );
  expect(getByText(/Google/i, { selector: 'button > *' })).toBeVisible();
  expect(getByText(/ORCID/i, { selector: 'button > *' })).toBeVisible();
});

it('renders username and password fields with the given values', () => {
  const { getByLabelText } = render(
    <SigninForm
      email="john.doe@example.com"
      password="PW"
      forgotPasswordHref="#"
    />,
  );
  expect(getByLabelText(/e-?mail/i)).toHaveValue('john.doe@example.com');
  expect(getByLabelText(/password/i)).toHaveValue('PW');
});
