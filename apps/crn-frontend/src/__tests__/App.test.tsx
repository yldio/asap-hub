import { getConsentCookie } from '@asap-hub/frontend-utils';
import { authTestUtils } from '@asap-hub/react-components';
import { useFlags } from '@asap-hub/react-context';
import {
  cleanup,
  render,
  screen,
  waitFor,
  renderHook,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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
  // Default mock: return undefined for any fetch (tests can override as needed)
  global.fetch = jest.fn();
  MockSignin.mockReset().mockReturnValue(<>Signin</>);
  MockAuthenticatedApp.mockReset().mockReturnValue(<>Authenticated</>);
});

afterEach(() => {
  global.fetch = originalFetch;
});

it('changes routing for logged in users', async () => {
  // Set up cookie consent to prevent modal from blocking the view
  const mockCookiesPreferences = {
    cookieId: 'a29956e6-897a-47c9-a2f6-3216986d20c7',
    preferences: { essential: true, analytics: false },
  };
  document.cookie = `crn-cookie-consent=${JSON.stringify(
    mockCookiesPreferences,
  )};`;

  const { container, rerender } = render(
    <authTestUtils.UserAuth0Provider>
      <App />
    </authTestUtils.UserAuth0Provider>,
  );

  await waitFor(() => expect(container).not.toHaveTextContent(/loading/i));
  await waitFor(() => expect(container).toHaveTextContent(/Signin/i));

  rerender(
    <authTestUtils.UserAuth0Provider>
      <authTestUtils.UserLoggedIn user={{}}>
        <App />
      </authTestUtils.UserLoggedIn>
    </authTestUtils.UserAuth0Provider>,
  );
  await waitFor(() => expect(container).not.toHaveTextContent(/loading/i));
  await waitFor(() => expect(container).toHaveTextContent(/Authenticated/i));
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
    // Ensure cookie is cleared before each test
    document.cookie = `crn-cookie-consent=;`;
  });

  afterEach(() => {
    document.cookie = `crn-cookie-consent=;`;
    cleanup();
  });

  it('shows the cookie modal if showCookieModal is true', async () => {
    // Ensure fetch is reset (no cookie means no fetch should be called)
    (global.fetch as jest.Mock).mockReset();

    render(<App />);
    // The modal should appear immediately when there's no cookie consent
    // Use findByText which will wait for the element to appear
    expect(
      await screen.findByText('Privacy Preference Center'),
    ).toBeInTheDocument();
  });

  it('hides the cookie modal if consent has been given before', () => {
    jest.spyOn(console, 'error').mockImplementation();
    const mockCookiesPreferences = {
      cookieId: 'a29956e6-897a-47c9-a2f6-3216986d20c7',
      preferences: { essential: true, analytics: false },
    };
    document.cookie = `crn-cookie-consent=${JSON.stringify(
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
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    render(<App />);

    const saveButton = await screen.findByText('Save and close');
    await userEvent.click(saveButton);

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
    const mockCookiesPreferences = {
      cookieId: 'a29956e6-897a-47c9-a2f6-3216986d20c7',
      preferences: { essential: true, analytics: false },
    };
    document.cookie = `crn-cookie-consent=${JSON.stringify(
      mockCookiesPreferences,
    )};`;

    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/cookie-preferences/')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCookiesPreferences),
        });
      }
      return Promise.reject(new Error('Unexpected fetch call'));
    });

    render(<App />);

    const cookieButton = await screen.findByTestId('cookie-button');
    await userEvent.click(cookieButton);

    await waitFor(() => {
      expect(
        screen.queryByText('Privacy Preference Center'),
      ).toBeInTheDocument();
    });
  });
});
