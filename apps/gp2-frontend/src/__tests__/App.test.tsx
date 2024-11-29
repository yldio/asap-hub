import { authTestUtils } from '@asap-hub/gp2-components';
import { useFlags } from '@asap-hub/react-context';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';

import { getConsentCookie } from '@asap-hub/frontend-utils';
import App from '../App';
import Signin from '../auth/Signin';
import AuthenticatedApp from '../AuthenticatedApp';
import { COOKIE_CONSENT_NAME } from '../config';

// Mock out normal auth
jest.mock('../auth/AuthProvider', () =>
  jest.fn(({ children }) => <>{children}</>),
);
// We don't want to test the implementation just the routing
jest.mock('../auth/Signin', () => jest.fn());
jest.mock('../AuthenticatedApp', () => jest.fn());
const MockSignin = Signin as jest.MockedFunction<typeof Signin>;
const MockAuthenticatedApp = AuthenticatedApp as jest.MockedFunction<
  typeof AuthenticatedApp
>;

const originalCookie = document.cookie;

const originalFetch = global.fetch;

beforeEach(() => {
  global.fetch = jest.fn();
  MockSignin.mockReset().mockReturnValue(<>Signin</>);
  MockAuthenticatedApp.mockReset().mockReturnValue(<>Authenticated</>);
});

afterEach(() => {
  global.fetch = originalFetch;
});

it('changes routing for logged in users', async () => {
  const { container, rerender } = render(
    <authTestUtils.UserAuth0Provider>
      <App />
    </authTestUtils.UserAuth0Provider>,
  );

  await waitFor(() => expect(container).not.toHaveTextContent(/loading/i));
  expect(container).toHaveTextContent(/Signin/i);
  rerender(
    <authTestUtils.UserAuth0Provider>
      <authTestUtils.UserLoggedIn user={{}}>
        <App />
      </authTestUtils.UserLoggedIn>
    </authTestUtils.UserAuth0Provider>,
  );
  await waitFor(() => expect(container).not.toHaveTextContent(/loading/i));
  expect(container).toHaveTextContent(/Authenticated/i);
});

it('loads overrides for feature flags', async () => {
  const {
    result: { current },
  } = renderHook(useFlags);

  const { container } = render(
    <authTestUtils.UserAuth0Provider>
      <authTestUtils.UserLoggedIn user={{}}>
        <App />
      </authTestUtils.UserLoggedIn>
    </authTestUtils.UserAuth0Provider>,
  );
  await waitFor(() => expect(container).not.toHaveTextContent(/loading/i));
  current.setCurrentOverrides({ ASAP_PERSISTENT_EXAMPLE: false });

  document.cookie = 'ASAP_PERSISTENT_EXAMPLE=true';
  expect(current.isEnabled('PERSISTENT_EXAMPLE')).toBe(true);
  document.cookie = originalCookie;
});

describe('Cookie Modal & Button', () => {
  beforeEach(() => {
    document.cookie = 'ASAP_DISPLAY_COOKIES=true;';
  });

  afterEach(() => {
    document.cookie = 'ASAP_DISPLAY_COOKIES=false;';
    document.cookie = `gp2-cookie-consent=;`;
    cleanup();
  });

  it('does not show the cookie modal if the DISPLAY_COOKIES flag is disabled', () => {
    document.cookie = 'ASAP_DISPLAY_COOKIES=false;';
    render(<App />);
    expect(
      screen.queryByText('Privacy Preference Center'),
    ).not.toBeInTheDocument();
  });

  it('shows the cookie modal if the DISPLAY_COOKIES flag is enabled and showCookieModal is true', () => {
    render(<App />);
    expect(screen.queryByText('Privacy Preference Center')).toBeInTheDocument();
  });

  it('hides the cookie modal if the DISPLAY_COOKIES flag is enabled and consent has been given before', () => {
    jest.spyOn(console, 'error').mockImplementation();
    const mockCookiesPreferences = {
      cookieId: 'a29956e6-897a-47c9-a2f6-3216986d20c7',
      preferences: { essential: true, analytics: false },
    };
    document.cookie = `gp2-cookie-consent=${JSON.stringify(
      mockCookiesPreferences,
    )};`;

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockCookiesPreferences),
    });
    render(<App />);
    expect(
      screen.queryByText('Privacy Preference Center'),
    ).not.toBeInTheDocument();
  });

  it('closes modal when save button is clicked, shows the cookie button and saves cookies', async () => {
    render(<App />);
    userEvent.click(screen.getByText('Save and close'));

    await waitFor(() => {
      expect(screen.getByTestId('cookie-button')).toBeInTheDocument();
      expect(
        screen.queryByText('Privacy Preference Center'),
      ).not.toBeInTheDocument();
      expect(getConsentCookie(COOKIE_CONSENT_NAME)?.preferences).not.toBeNull();
      expect(getConsentCookie(COOKIE_CONSENT_NAME)?.preferences.essential).toBe(
        true,
      );
      expect(getConsentCookie(COOKIE_CONSENT_NAME)?.preferences.analytics).toBe(
        false,
      );
    });
  });

  it('shows the cookie modal when cookie button is clicked', async () => {
    document.cookie = `gp2-cookie-consent=${JSON.stringify({
      cookieId: 'a29956e6-897a-47c9-a2f6-3216986d20c7',
      preferences: { essential: true, analytics: false },
    })};`;

    render(<App />);

    const cookieButton = await screen.findByTestId('cookie-button');
    userEvent.click(cookieButton);

    const saveAndCloseButton = await screen.findByText('Save and close');
    userEvent.click(saveAndCloseButton);

    await waitFor(() => {
      expect(
        screen.queryByText('Privacy Preference Center'),
      ).toBeInTheDocument();
    });
  });
});
