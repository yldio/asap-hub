// Copied from the Auth0 React quickstart, added some types and checks
/* istanbul ignore file */
/* eslint-disable no-shadow */

import React, { useState, useEffect } from 'react';
import { User, Auth0 } from '@asap-hub/auth';
import { Auth0Context } from '@asap-hub/react-context';
import createAuth0Client, {
  Auth0ClientOptions,
  Auth0Client,
  RedirectLoginResult,
} from '@auth0/auth0-spa-js';

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
  const [user, setUser] = useState<User>();
  const [auth0Client, setAuth0] = useState<Auth0Client>();
  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    const initAuth0 = async () => {
      const auth0FromHook = await createAuth0Client(initOptions);
      setAuth0(auth0FromHook);

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
        const user = await auth0FromHook.getUser();
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
      console.error(error);
    } finally {
      setPopupOpen(false);
    }
    const user = await auth0Client.getUser();
    setUser(user);
    setIsAuthenticated(true);
  };

  const handleRedirectCallback = async () => {
    if (!auth0Client) {
      throw new Error('Auth0 client not initialized');
    }
    setLoading(true);
    await auth0Client.handleRedirectCallback();
    const user = await auth0Client.getUser();
    setLoading(false);
    setIsAuthenticated(true);
    setUser(user);
  };

  const getSafeAuth0ClientProperty = <T extends keyof Auth0Client>(
    property: T,
  ) =>
    auth0Client
      ? auth0Client[property]
      : () => {
          throw new Error('Auth0 client not initialized');
        };

  return (
    <Auth0Context.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        popupOpen,
        loginWithPopup,
        handleRedirectCallback,
        getIdTokenClaims: getSafeAuth0ClientProperty('getIdTokenClaims').bind(
          auth0Client,
        ),
        loginWithRedirect: getSafeAuth0ClientProperty('loginWithRedirect').bind(
          auth0Client,
        ),
        getTokenSilently: getSafeAuth0ClientProperty('getTokenSilently').bind(
          auth0Client,
        ),
        getTokenWithPopup: getSafeAuth0ClientProperty('getTokenWithPopup').bind(
          auth0Client,
        ),
        logout: getSafeAuth0ClientProperty('logout').bind(auth0Client),
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};
