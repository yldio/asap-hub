import React from 'react';
import { render } from '@testing-library/react';

import SigninPage from '../SigninPage';

it('renders the signin form as the main content', () => {
  const { getByText, getByRole } = render(
    <SigninPage
      email=""
      password=""
      termsHref="#"
      privacyPolicyHref="#"
      forgotPasswordHref="#"
    />,
  );
  expect(getByRole('main')).toContainElement(
    getByText(/sign in/i, { selector: 'h1' }),
  );
});

it('renders the terms link', () => {
  const { getByText } = render(
    <SigninPage
      email=""
      password=""
      termsHref="#"
      privacyPolicyHref="#"
      forgotPasswordHref="#"
    />,
  );
  expect(getByText(/terms/i)).toBeVisible();
});
