/* istanbul ignore file */

import { useState, useEffect } from 'react';
import createAuth0Client, { Auth0Client } from '@auth0/auth0-spa-js';
import type { User, Auth0User } from '@asap-hub/auth';
import {
  useAuth0,
  Auth0Context,
  getUserClaimKey,
} from '@asap-hub/react-context';

const notImplemented = (method: string) => () => {
  throw new Error(`${method} not implemented by the Auth0 test fixture`);
};
const notReady = (method: string) => () => {
  throw new Error(`Auth0 test fixture loading, not ready for ${method}`);
};

/**
 * You probably don't want to use this in the frontend,
 * which has its own recoil-integrated auth test utils.
 */
export const Auth0Provider: React.FC<{
  readonly children: React.ReactNode;
}> = ({ children }) => {
  const [auth0Client, setAuth0] = useState<Auth0Client>();
  useEffect(() => {
    const initAuth0 = async () => {
      setAuth0(
        await createAuth0Client({
          domain: 'auth.example.com',
          client_id: 'client_id',
          redirect_uri: 'http://localhost',
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
        refreshUser: async () => {},
        getIdTokenClaims: auth0Client
          ? (...args) => auth0Client.getIdTokenClaims(...args)
          : notReady('getIdTokenClaims'),
        getTokenSilently: notImplemented('getTokenSilently'),
        getTokenWithPopup: notImplemented('getTokenWithPopup'),
        handleRedirectCallback: auth0Client
          ? (...args) => auth0Client.handleRedirectCallback(...args).then()
          : notReady('handleRedirectCallback'),
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
  return loading ? <p>Auth0 loading...</p> : <>{children}</>;
};

export const LoggedIn: React.FC<{
  readonly children: React.ReactNode;
  // undefined user should be explicit, this is for the intermediate state
  // where the getUser() promise is pending.
  readonly user: Partial<User> | undefined;
}> = ({ children, user }) => {
  const ctx = useAuth0();

  let auth0User: Auth0User | undefined;
  if (user) {
    const completeUser: User = {
      id: 'testuserid',
      onboarded: true,
      email: 'john.doe@example.com',
      displayName: 'John Doe',
      firstName: 'John',
      lastName: 'Doe',
      teams: [
        {
          id: 'team-1',
          displayName: 'Team 1',
          role: 'Lead PI (Core Leadership)',
        },
      ],
      algoliaApiKey: 'algolia-mock-key',
      ...user,
    };
    auth0User = {
      sub: 'testuser',
      name: completeUser.displayName,
      given_name: completeUser.firstName,
      family_name: completeUser.lastName,
      aud: 'Av2psgVspAN00Kez9v1vR2c496a9zCW3',
      [getUserClaimKey()]: completeUser,
    };
  }

  return (
    <Auth0Context.Provider
      value={{
        ...ctx,
        isAuthenticated: true,
        user: auth0User,
        getTokenSilently: jest.fn().mockResolvedValue('token'),
        getIdTokenClaims: async () => ({ __raw: 'token' }),
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};
