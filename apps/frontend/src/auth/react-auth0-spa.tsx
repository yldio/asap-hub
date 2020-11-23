// Copied from the Auth0 React quickstart, added some types, checks, and recoil integration
/* istanbul ignore file */
/* eslint-disable no-shadow */

import React, { useState, useEffect } from 'react';
import { useSetRecoilState, useResetRecoilState } from 'recoil';
import { Auth0User, Auth0 } from '@asap-hub/auth';
import { Auth0Context } from '@asap-hub/react-context';
import createAuth0Client, {
  Auth0ClientOptions,
  Auth0Client,
  RedirectLoginResult,
} from '@auth0/auth0-spa-js';

import { auth0State } from './state';

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

  const setAuth0 = useSetRecoilState(auth0State);
  const resetAuth0 = useResetRecoilState(auth0State);

  useEffect(() => {
    const initAuth0 = async () => {
      const auth0FromHook = await createAuth0Client(initOptions);
      setAuth0Client(auth0FromHook);

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
    const result = await auth0Client.handleRedirectCallback();
    const user = await auth0Client.getUser();
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

  const auth0: Auth0 = {
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
  };
  useEffect(() => {
    setAuth0(auth0);
    return () => resetAuth0();
  }, [auth0, setAuth0, resetAuth0]);

  return (
    <Auth0Context.Provider value={auth0}>{children}</Auth0Context.Provider>
  );
};
