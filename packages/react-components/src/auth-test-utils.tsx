/* istanbul ignore file */
import React, { useState, useEffect } from 'react';
import createAuth0Client, { Auth0Client } from '@auth0/auth0-spa-js';
import type { Auth0User } from '@asap-hub/auth';
import { useAuth0, Auth0Context } from '@asap-hub/react-context';

const notImplemented = (method: string) => () => {
  throw new Error(`${method} not implemented by the Auth0 test fixture`);
};
const notReady = (method: string) => () => {
  throw new Error(`Auth0 test fixture loading, not ready for ${method}`);
};

export const Auth0Provider: React.FC<{
  readonly children: React.ReactNode;
}> = ({ children }) => {
  const [auth0Client, setAuth0] = useState<Auth0Client>();
  useEffect(() => {
    const initAuth0 = async () => {
      setAuth0(
        await createAuth0Client({
          /* eslint-disable @typescript-eslint/camelcase */
          domain: 'auth.example.com',
          client_id: 'client_id',
          redirect_uri: 'http://localhost',
          /* eslint-enable @typescript-eslint/camelcase */
        }),
      );
    };
    initAuth0();
  }, []);

  return (
    <Auth0Context.Provider
      value={{
        loading: !auth0Client,
        popupOpen: false,
        isAuthenticated: false,
        getIdTokenClaims: notImplemented('getIdTokenClaims'),
        getTokenSilently: notImplemented('getTokenSilently'),
        getTokenWithPopup: notImplemented('getTokenWithPopup'),
        handleRedirectCallback: notImplemented('handleRedirectCallback'),
        loginWithPopup: notImplemented('loginWithPopup'),
        loginWithRedirect: auth0Client
          ? (...args) => auth0Client.loginWithRedirect(...args)
          : notReady('loginWithRedirect'),
        logout: auth0Client
          ? (...args) => auth0Client.logout(...args)
          : notReady('logout'),
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};

export const WhenReady: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { loading } = useAuth0();
  return loading ? <p>Initializing Auth0</p> : <>{children}</>;
};

export const LoggedIn: React.FC<{
  readonly children: React.ReactNode;
  // undefined user should be explicit, this is for the intermediate state
  // where the getUser() promise is pending.
  readonly user: Auth0User | undefined;
}> = ({ children, user }) => {
  const ctx = useAuth0();
  return (
    <Auth0Context.Provider
      value={{
        ...ctx,
        isAuthenticated: true,
        user,
        getTokenSilently: async () => 'token',
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};
