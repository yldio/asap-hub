import React from 'react';
import { render } from '@testing-library/react';

import Signin from '../Signin';

it('renders different headlines in signin and signup mode', () => {
  const { getByRole, rerender } = render(
    <Signin email="" password="" forgotPasswordHref="#" />,
  );
  expect(getByRole('heading').textContent).toMatchInlineSnapshot(
    `"Sign in to ASAP Hub"`,
  );

  rerender(<Signin signup email="" password="" forgotPasswordHref="#" />);
  expect(getByRole('heading').textContent).toMatchInlineSnapshot(
    `"Create your account"`,
  );
});

it('renders the SSO buttons', () => {
  const { getByText } = render(
    <Signin email="" password="" forgotPasswordHref="#" />,
  );
  expect(getByText(/Google/i, { selector: 'button > *' })).toBeVisible();
  expect(getByText(/ORCID/i, { selector: 'button > *' })).toBeVisible();
});

it('renders username and password fields with the given values', () => {
  const { getByLabelText } = render(
    <Signin
      email="john.doe@example.com"
      password="PW"
      forgotPasswordHref="#"
    />,
  );
  expect(getByLabelText(/e-?mail/i)).toHaveValue('john.doe@example.com');
  expect(getByLabelText(/password/i)).toHaveValue('PW');
});
