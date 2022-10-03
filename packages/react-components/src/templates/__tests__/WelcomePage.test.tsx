import { screen, render } from '@testing-library/react';

import WelcomePage from '../WelcomePage';
import { noop } from '../../utils';

it('renders the signin page', () => {
  const handleClick = jest.fn();
  render(<WelcomePage onClick={handleClick} />);
  expect(screen.getByRole('button').textContent).toMatchInlineSnapshot(
    `"Sign in"`,
  );
});

it('renders the signup page', () => {
  const handleClick = jest.fn();
  render(<WelcomePage allowSignup onClick={handleClick} />);
  expect(screen.getByRole('button').textContent).toMatchInlineSnapshot(
    `"Activate account"`,
  );
});

it('shows an auth failed error message', () => {
  render(<WelcomePage onClick={noop} />);
  expect(screen.queryByText(/problem/i)).not.toBeInTheDocument();

  render(<WelcomePage authFailed={'invalid'} onClick={noop} />);
  expect(screen.queryByText(/problem/i)).toBeVisible();
});

it('shows an alumni no-access error message', () => {
  render(<WelcomePage authFailed={'alumni'} onClick={noop} />);
  expect(screen.queryByText(/alumni/i)).toBeVisible();
});
