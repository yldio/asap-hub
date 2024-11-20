import { disable, enable } from '@asap-hub/flags';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';

import { noop } from '../../utils';
import WelcomePage from '../WelcomePage';

const onSaveCookiePreferences = jest.fn();

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation();
});

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
    expect(
      screen.queryByText('Privacy Preference Center'),
    ).not.toBeInTheDocument();
  });

  it('does not show the cookie modal if the DISPLAY_COOKIES flag is enabled but showCookieModal is false', () => {
    render(
      <WelcomePage
        onClick={noop}
        onSaveCookiePreferences={onSaveCookiePreferences}
        showCookieModal={false}
      />,
    );
    expect(
      screen.queryByText('Privacy Preference Center'),
    ).not.toBeInTheDocument();
  });

  it('shows the cookie modal if the DISPLAY_COOKIES flag is enabled and showCookieModal is true', () => {
    render(
      <WelcomePage
        onClick={noop}
        onSaveCookiePreferences={onSaveCookiePreferences}
        showCookieModal={true}
      />,
    );
    expect(screen.getByText('Privacy Preference Center')).toBeInTheDocument();
  });

  it('shows the cookie button if the DISPLAY_COOKIES flag is enabled and showCookieModal is false', () => {
    render(
      <WelcomePage
        onClick={noop}
        onSaveCookiePreferences={onSaveCookiePreferences}
        showCookieModal={false}
      />,
    );
    expect(screen.getByTestId('cookie-button')).toBeInTheDocument();
  });

  it('shows the cookie modal when cookie button is clicked', () => {
    const WelcomePageRenderer = () => {
      const [showCookieModal, setShowCookieModal] = useState<boolean>(false);
      const toggleCookieModal = () => {
        setShowCookieModal((prev: boolean) => !prev);
      };
      return (
        <WelcomePage
          onClick={noop}
          onSaveCookiePreferences={onSaveCookiePreferences}
          showCookieModal={showCookieModal}
          toggleCookieModal={toggleCookieModal}
        />
      );
    };
    render(<WelcomePageRenderer />);
    userEvent.click(screen.getByTestId('cookie-button'));
    expect(screen.getByText('Privacy Preference Center')).toBeInTheDocument();
  });
});
