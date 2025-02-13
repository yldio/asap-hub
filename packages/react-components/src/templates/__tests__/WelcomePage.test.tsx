import { render, screen } from '@testing-library/react';

import { noop } from '../../utils';
import WelcomePage from '../WelcomePage';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation();
});

it('renders the signin page', () => {
  const handleClick = jest.fn();
  render(<WelcomePage onClick={handleClick} />);
  expect(screen.getByRole('button', { name: /Sign in/ })).toBeVisible();
});

it('renders the signup page', () => {
  const handleClick = jest.fn();
  render(<WelcomePage allowSignup onClick={handleClick} />);
  expect(
    screen.getByRole('button', { name: /Activate account/ }),
  ).toBeVisible();
});

it('shows an auth failed error message', () => {
  render(<WelcomePage onClick={noop} />);
  expect(screen.queryByText(/problem/i)).not.toBeInTheDocument();

  render(<WelcomePage authFailed={'invalid'} onClick={noop} />);
  expect(screen.getByText(/problem/i)).toBeVisible();
});

it('shows an alumni no-access error message', () => {
  render(<WelcomePage authFailed={'alumni'} onClick={noop} />);
  expect(screen.getByText(/alumni/i)).toBeVisible();
});

it('shows custom email addres if provided', () => {
  render(
    <WelcomePage
      supportEmail="custom@mail.com"
      authFailed={'alumni'}
      onClick={noop}
    />,
  );
  const supportLink = screen.getByRole('link', { name: 'ASAP Support' });
  expect(supportLink).toBeInTheDocument();
  expect(supportLink).toHaveAttribute(
    'href',
    'mailto:custom@mail.com?subject=ASAP%20Hub%3A%20Tech%20support',
  );
});
