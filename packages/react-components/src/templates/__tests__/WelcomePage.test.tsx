import { disable, enable } from '@asap-hub/flags';
import { render, screen } from '@testing-library/react';

import { noop } from '../../utils';
import WelcomePage from '../WelcomePage';

const onSaveCookiePreferences = jest.fn();
it('renders the signin page', () => {
  const handleClick = jest.fn();
  render(
    <WelcomePage
      onClick={handleClick}
      onSaveCookiePreferences={onSaveCookiePreferences}
    />,
  );
  expect(screen.getByRole('button', { name: /Sign in/ })).toBeVisible();
});

it('renders the signup page', () => {
  const handleClick = jest.fn();
  render(
    <WelcomePage
      allowSignup
      onClick={handleClick}
      onSaveCookiePreferences={onSaveCookiePreferences}
    />,
  );
  expect(
    screen.getByRole('button', { name: /Activate account/ }),
  ).toBeVisible();
});

it('shows an auth failed error message', () => {
  render(
    <WelcomePage
      onClick={noop}
      onSaveCookiePreferences={onSaveCookiePreferences}
    />,
  );
  expect(screen.queryByText(/problem/i)).not.toBeInTheDocument();

  render(
    <WelcomePage
      authFailed={'invalid'}
      onClick={noop}
      onSaveCookiePreferences={onSaveCookiePreferences}
    />,
  );
  expect(screen.getByText(/problem/i)).toBeVisible();
});

it('shows an alumni no-access error message', () => {
  render(
    <WelcomePage
      authFailed={'alumni'}
      onClick={noop}
      onSaveCookiePreferences={onSaveCookiePreferences}
    />,
  );
  expect(screen.getByText(/alumni/i)).toBeVisible();
});

describe('cookie modal', () => {
  beforeEach(() => {
    enable('DISPLAY_COOKIES');
  });

  afterEach(() => {
    disable('DISPLAY_COOKIES');
  });

  it('does not show the cookie modal if the flag is disabled', () => {
    disable('DISPLAY_COOKIES');

    render(
      <WelcomePage
        onClick={noop}
        onSaveCookiePreferences={onSaveCookiePreferences}
      />,
    );
    expect(screen.queryByText(/cookie/i)).not.toBeInTheDocument();
  });

  it('does not show the cookie modal if the DISPLAY_COOKIES flag is enabled but showCookieModal is false', () => {
    render(
      <WelcomePage
        onClick={noop}
        onSaveCookiePreferences={onSaveCookiePreferences}
        showCookieModal={false}
      />,
    );
    expect(screen.queryByText(/cookie/i)).not.toBeInTheDocument();
  });

  it('shows the cookie modal if the DISPLAY_COOKIES flag is enabled and showCookieModal is true', () => {
    render(
      <WelcomePage
        onClick={noop}
        onSaveCookiePreferences={onSaveCookiePreferences}
        showCookieModal={true}
      />,
    );
    expect(screen.getAllByText(/cookie/i).length).toBeGreaterThan(0);
  });
});
