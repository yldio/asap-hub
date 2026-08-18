import createAuth0Client, { Auth0Client, User } from '@auth0/auth0-spa-js';
import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { AUTH0_AUDIENCE, AUTH0_CLIENT_ID, AUTH0_DOMAIN } from '../config';

export type AuthState = {
  isLoading: boolean;
  isAuthenticated: boolean;
  user?: User;
  getToken: () => Promise<string>;
  login: () => Promise<void>;
  logout: () => void;
};

const notReady = () => {
  throw new Error('Auth client is not ready');
};

export const AuthContext = createContext<AuthState>({
  isLoading: true,
  isAuthenticated: false,
  getToken: notReady,
  login: notReady,
  logout: notReady,
});

export const useAuth = (): AuthState => useContext(AuthContext);

const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [client, setClient] = useState<Auth0Client>();
  const [isLoading, setLoading] = useState(true);
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      const auth0 = await createAuth0Client({
        domain: AUTH0_DOMAIN,
        client_id: AUTH0_CLIENT_ID,
        audience: AUTH0_AUDIENCE,
        redirect_uri: window.location.origin,
        cacheLocation: 'localstorage',
        useRefreshTokens: true,
      });

      if (window.location.search.includes('code=')) {
        const { appState } = await auth0.handleRedirectCallback();
        const target =
          (appState as { returnTo?: string } | undefined)?.returnTo ?? '/';
        window.history.replaceState({}, document.title, target);
      }

      const authenticated = await auth0.isAuthenticated();
      if (cancelled) return;
      setClient(auth0);
      setAuthenticated(authenticated);
      setUser(authenticated ? await auth0.getUser<User>() : undefined);
      setLoading(false);
    };

    init().catch(() => {
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const getToken = useCallback(async () => {
    if (!client) throw new Error('Auth client is not ready');
    return client.getTokenSilently();
  }, [client]);

  const login = useCallback(async () => {
    if (!client) throw new Error('Auth client is not ready');
    await client.loginWithRedirect({
      redirect_uri: window.location.origin,
      appState: {
        returnTo: `${window.location.pathname}${window.location.search}`,
      },
    });
  }, [client]);

  const logout = useCallback(() => {
    void client?.logout({ returnTo: window.location.origin });
  }, [client]);

  const value = useMemo(
    () => ({ isLoading, isAuthenticated, user, getToken, login, logout }),
    [isLoading, isAuthenticated, user, getToken, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
