import React from 'react';
import { render } from '@testing-library/react';

import WelcomePage from '../WelcomePage';
import { noop } from '../../utils';

it('renders the signin page', () => {
  const handleClick = jest.fn();
  const { getByRole } = render(<WelcomePage onClick={handleClick} />);
  expect(getByRole('button').textContent).toMatchInlineSnapshot(`"Sign in"`);
});

it('renders the signup page', () => {
  const handleClick = jest.fn();
  const { getByRole } = render(
    <WelcomePage allowSignup onClick={handleClick} />,
  );
  expect(getByRole('button').textContent).toMatchInlineSnapshot(
    `"Activate account"`,
  );
});

it('shows an auth failed error message', () => {
  const { queryByText, rerender } = render(<WelcomePage onClick={noop} />);
  expect(queryByText(/problem/i)).not.toBeInTheDocument();

  rerender(<WelcomePage authFailed onClick={noop} />);
  expect(queryByText(/problem/i)).toBeVisible();
});
