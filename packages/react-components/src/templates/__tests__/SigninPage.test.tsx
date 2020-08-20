import React from 'react';
import { render } from '@testing-library/react';

import SigninPage from '../SigninPage';

it('renders the signin form', () => {
  const { getByText } = render(
    <SigninPage
      email=""
      password=""
      termsHref="#"
      privacyPolicyHref="#"
      forgotPasswordHref="#"
    />,
  );
  expect(getByText(/sign in/i, { selector: 'h1' })).toBeVisible();
});

it('does not render a terms link by default', () => {
  const { queryByText } = render(
    <SigninPage
      email=""
      password=""
      termsHref="#"
      privacyPolicyHref="#"
      forgotPasswordHref="#"
    />,
  );
  expect(queryByText(/terms/i)).not.toBeInTheDocument();
});

it('renders the terms link in signup mode', () => {
  const { getByText } = render(
    <SigninPage
      signup
      email=""
      password=""
      termsHref="#"
      privacyPolicyHref="#"
      forgotPasswordHref="#"
    />,
  );
  expect(getByText(/terms/i)).toBeVisible();
});
