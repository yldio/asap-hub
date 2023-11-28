// Copied from the Auth0 React quickstart.
// Added some typings and guards.
// Refactored to use constructor instead of createAuth0Client factory.
/* istanbul ignore file */
/* eslint-disable no-shadow */

import { Auth0, Auth0User } from '@asap-hub/auth';
import { Auth0ContextCRN } from '@asap-hub/react-context';
import {
  Auth0Client,
  Auth0ClientOptions,
  RedirectLoginResult,
} from '@auth0/auth0-spa-js';
import { useEffect, useState } from 'react';

const DEFAULT_REDIRECT_CALLBACK = () =>
  window.history.replaceState({}, document.title, window.location.pathname);

interface Auth0ProviderProps extends Auth0ClientOptions {
  children: React.ReactNode;
  onRedirectCallback: (appState: RedirectLoginResult['appState']) => void;
}
export const Auth0Provider: React.FC<Auth0ProviderProps> = ({
  children,
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  ...initOptions
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>();
  const [user, setUser] = useState<Auth0User>();
  const [auth0Client, setAuth0Client] = useState<Auth0Client>();
  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    const initAuth0 = async () => {
      const auth0FromHook = new Auth0Client(initOptions);
      setAuth0Client(auth0FromHook);
      try {
        await auth0FromHook.checkSession(); // use refresh token to get new access token if required
        // eslint-disable-next-line
      } catch (error) {} // Invalid refresh token proceed as if user isn't logged in
      if (
        window.location.search.includes('code=') &&
        window.location.search.includes('state=')
      ) {
        const { appState } = await auth0FromHook.handleRedirectCallback();
        onRedirectCallback(appState);
      }

      const isAuthenticated = await auth0FromHook.isAuthenticated();

      setIsAuthenticated(isAuthenticated);

      if (isAuthenticated) {
        const user = await auth0FromHook.getUser<Auth0User>();
        setUser(user);
      }

      setLoading(false);
    };
    initAuth0();
    // eslint-disable-next-line
  }, []);

  const loginWithPopup: Auth0['loginWithPopup'] = async (...args) => {
    if (!auth0Client) {
      throw new Error('Auth0 client not initialized');
    }
    setPopupOpen(true);
    try {
      await auth0Client.loginWithPopup(...args);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setPopupOpen(false);
    }
    const user = await auth0Client.getUser<Auth0User>();
    setUser(user);
    setIsAuthenticated(true);
  };

  const handleRedirectCallback = async () => {
    if (!auth0Client) {
      throw new Error('Auth0 client not initialized');
    }
    setLoading(true);
    const result = await auth0Client.handleRedirectCallback();
    const user = await auth0Client.getUser<Auth0User>();
    setLoading(false);
    setIsAuthenticated(true);
    setUser(user);
    return result;
  };

  const getSafeAuth0ClientProperty = <T extends keyof Auth0Client>(
    property: T,
  ) =>
    auth0Client
      ? auth0Client[property]
      : () => {
          throw new Error('Auth0 client not initialized');
        };

  const checkSession = async () => {
    if (auth0Client) {
      try {
        await auth0Client.checkSession(); // use refresh token to get new access token if required
        // eslint-disable-next-line
      } catch (error) {} // Invalid refresh token proceed as if user isn't logged in
      const isAuthenticated = await auth0Client.isAuthenticated();
      setIsAuthenticated(isAuthenticated);
    }
  };

  const refreshUser = async () => {
    if (!auth0Client) {
      throw new Error('Auth0 client not initialized');
    }

    setUser(await auth0Client.getUser());
  };

  const auth0: Auth0 = {
    isAuthenticated,
    user,
    refreshUser,
    loading,
    popupOpen,
    loginWithPopup,
    handleRedirectCallback,
    getTokenSilently:
      getSafeAuth0ClientProperty('getTokenSilently').bind(auth0Client),
    getIdTokenClaims:
      getSafeAuth0ClientProperty('getIdTokenClaims').bind(auth0Client),
    loginWithRedirect:
      getSafeAuth0ClientProperty('loginWithRedirect').bind(auth0Client),
    getTokenWithPopup:
      getSafeAuth0ClientProperty('getTokenWithPopup').bind(auth0Client),
    logout: getSafeAuth0ClientProperty('logout').bind(auth0Client),
    checkSession,
  };

  return (
    <Auth0ContextCRN.Provider value={auth0}>
      {children}
    </Auth0ContextCRN.Provider>
  );
};
