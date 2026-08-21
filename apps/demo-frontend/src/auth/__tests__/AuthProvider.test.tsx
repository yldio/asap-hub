import createAuth0Client from '@auth0/auth0-spa-js';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AUTH0_AUDIENCE, AUTH0_CLIENT_ID, AUTH0_DOMAIN } from '../../config';
import AuthProvider, { useAuth } from '../AuthProvider';

jest.mock('@auth0/auth0-spa-js', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const createClient = createAuth0Client as unknown as jest.Mock;

const makeClient = (overrides: Record<string, unknown> = {}) => ({
  isAuthenticated: jest.fn(() => Promise.resolve(true)),
  getUser: jest.fn(() => Promise.resolve({ email: 'jane@example.com' })),
  getTokenSilently: jest.fn(() => Promise.resolve('a-token')),
  loginWithRedirect: jest.fn(() => Promise.resolve()),
  logout: jest.fn(),
  handleRedirectCallback: jest.fn(() => Promise.resolve({ appState: {} })),
  ...overrides,
});

const Probe = () => {
  const { isLoading, isAuthenticated, user, getToken, login, logout } =
    useAuth();
  return (
    <div>
      <span data-testid="state">
        {isLoading ? 'loading' : isAuthenticated ? 'in' : 'out'}
      </span>
      <span data-testid="user">{(user?.email as string) ?? 'none'}</span>
      <button
        type="button"
        onClick={() => {
          getToken()
            .then((token) => {
              document.title = token;
            })
            .catch(() => undefined);
        }}
      >
        token
      </button>
      <button
        type="button"
        onClick={() => {
          login().catch(() => undefined);
        }}
      >
        login
      </button>
      <button type="button" onClick={logout}>
        logout
      </button>
    </div>
  );
};

const renderProvider = () =>
  render(
    <AuthProvider>
      <Probe />
    </AuthProvider>,
  );

const setLocation = (search: string, pathname = '/videos/video-1') => {
  window.history.replaceState({}, '', `${pathname}${search}`);
};

beforeEach(() => {
  jest.clearAllMocks();
  setLocation('', '/');
});

it('configures the client with the app audience and origin', async () => {
  createClient.mockResolvedValue(makeClient());
  renderProvider();

  await waitFor(() =>
    expect(screen.getByTestId('state')).toHaveTextContent('in'),
  );
  expect(createClient).toHaveBeenCalledWith({
    domain: AUTH0_DOMAIN,
    client_id: AUTH0_CLIENT_ID,
    audience: AUTH0_AUDIENCE,
    redirect_uri: window.location.origin,
    cacheLocation: 'localstorage',
    useRefreshTokens: true,
  });
});

it('reflects an authenticated session and its user', async () => {
  createClient.mockResolvedValue(makeClient());
  renderProvider();

  await waitFor(() =>
    expect(screen.getByTestId('state')).toHaveTextContent('in'),
  );
  expect(screen.getByTestId('user')).toHaveTextContent('jane@example.com');
});

it('reflects an anonymous session without asking for a user', async () => {
  const client = makeClient({
    isAuthenticated: jest.fn(() => Promise.resolve(false)),
  });
  createClient.mockResolvedValue(client);
  renderProvider();

  await waitFor(() =>
    expect(screen.getByTestId('state')).toHaveTextContent('out'),
  );
  expect(client.getUser).not.toHaveBeenCalled();
  expect(screen.getByTestId('user')).toHaveTextContent('none');
});

it('stops loading when the client cannot be created', async () => {
  createClient.mockRejectedValue(new Error('offline'));
  renderProvider();

  await waitFor(() =>
    expect(screen.getByTestId('state')).toHaveTextContent('out'),
  );
});

describe('redirect callback', () => {
  it('handles the callback and restores the returnTo path', async () => {
    setLocation('?code=abc&state=xyz');
    const client = makeClient({
      handleRedirectCallback: jest.fn(() =>
        Promise.resolve({ appState: { returnTo: '/videos/video-1' } }),
      ),
    });
    createClient.mockResolvedValue(client);
    const replaceState = jest.spyOn(window.history, 'replaceState');

    renderProvider();

    await waitFor(() =>
      expect(client.handleRedirectCallback).toHaveBeenCalled(),
    );
    expect(replaceState).toHaveBeenCalledWith(
      {},
      document.title,
      '/videos/video-1',
    );
    replaceState.mockRestore();
  });

  it('falls back to the root when there is no returnTo', async () => {
    setLocation('?code=abc');
    createClient.mockResolvedValue(makeClient());
    const replaceState = jest.spyOn(window.history, 'replaceState');

    renderProvider();

    await waitFor(() =>
      expect(replaceState).toHaveBeenCalledWith({}, document.title, '/'),
    );
    replaceState.mockRestore();
  });

  it('leaves the url alone when there is no code', async () => {
    const client = makeClient();
    createClient.mockResolvedValue(client);

    renderProvider();

    await waitFor(() =>
      expect(screen.getByTestId('state')).toHaveTextContent('in'),
    );
    expect(client.handleRedirectCallback).not.toHaveBeenCalled();
  });
});

describe('actions', () => {
  it('delegates getToken to the client', async () => {
    const client = makeClient();
    createClient.mockResolvedValue(client);
    renderProvider();

    await waitFor(() =>
      expect(screen.getByTestId('state')).toHaveTextContent('in'),
    );
    await userEvent.click(screen.getByRole('button', { name: 'token' }));

    await waitFor(() => expect(document.title).toBe('a-token'));
    expect(client.getTokenSilently).toHaveBeenCalled();
  });

  it('logs in with the current location as the returnTo', async () => {
    setLocation('?q=1', '/users');
    const client = makeClient();
    createClient.mockResolvedValue(client);
    renderProvider();

    await waitFor(() =>
      expect(screen.getByTestId('state')).toHaveTextContent('in'),
    );
    await userEvent.click(screen.getByRole('button', { name: 'login' }));

    expect(client.loginWithRedirect).toHaveBeenCalledWith({
      redirect_uri: window.location.origin,
      appState: { returnTo: '/users?q=1' },
    });
  });

  it('logs out back to the origin', async () => {
    const client = makeClient();
    createClient.mockResolvedValue(client);
    renderProvider();

    await waitFor(() =>
      expect(screen.getByTestId('state')).toHaveTextContent('in'),
    );
    await userEvent.click(screen.getByRole('button', { name: 'logout' }));

    expect(client.logout).toHaveBeenCalledWith({
      returnTo: window.location.origin,
    });
  });
});
