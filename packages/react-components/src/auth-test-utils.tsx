/* istanbul ignore file */

import type { Auth0User, gp2, User } from '@asap-hub/auth';
import {
  Auth0Context,
  Auth0ContextGP2,
  getUserClaimKey,
  useAuth0,
  useAuth0GP2,
} from '@asap-hub/react-context';
import createAuth0Client, { Auth0Client } from '@auth0/auth0-spa-js';
import { useEffect, useState } from 'react';

const notImplemented = (method: string) => () => {
  throw new Error(`${method} not implemented by the Auth0 test fixture`);
};
const notReady = (method: string) => () => {
  throw new Error(`Auth0 test fixture loading, not ready for ${method}`);
};

const auth0Context = (auth0Client: Auth0Client | undefined) => ({
  loading: !auth0Client,
  popupOpen: false,
  isAuthenticated: false,
  refreshUser: async () => {},
  getIdTokenClaims: auth0Client
    ? (...args: Parameters<Auth0Client['getIdTokenClaims']>) =>
        auth0Client.getIdTokenClaims(...args)
    : notReady('getIdTokenClaims'),
  getTokenSilently: notImplemented('getTokenSilently'),
  getTokenWithPopup: notImplemented('getTokenWithPopup'),
  handleRedirectCallback: auth0Client
    ? (...args: Parameters<Auth0Client['handleRedirectCallback']>) =>
        auth0Client.handleRedirectCallback(...args).then()
    : notReady('handleRedirectCallback'),
  loginWithPopup: notImplemented('loginWithPopup'),
  loginWithRedirect: auth0Client
    ? (...args: Parameters<Auth0Client['loginWithRedirect']>) =>
        auth0Client.loginWithRedirect(...args)
    : notReady('loginWithRedirect'),
  logout: auth0Client
    ? (...args: Parameters<Auth0Client['logout']>) =>
        auth0Client.logout(...args)
    : notReady('logout'),
});
const createAuth0ClientParams = {
  domain: 'auth.example.com',
  client_id: 'client_id',
  redirect_uri: 'http://localhost',
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
      setAuth0(await createAuth0Client(createAuth0ClientParams));
    };
    initAuth0();
  }, []);

  return (
    <Auth0Context.Provider value={auth0Context(auth0Client)}>
      {children}
    </Auth0Context.Provider>
  );
};
export const Auth0ProviderGP2: React.FC<{
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
    <Auth0ContextGP2.Provider value={auth0Context(auth0Client)}>
      {children}
    </Auth0ContextGP2.Provider>
  );
};

export const WhenReady: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { loading } = useAuth0();
  return loading ? <p>Auth0 loading...</p> : <>{children}</>;
};
export const WhenReadyGP2: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { loading } = useAuth0GP2();
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

export const LoggedInGP2: React.FC<{
  readonly children: React.ReactNode;
  // undefined user should be explicit, this is for the intermediate state
  // where the getUser() promise is pending.
  readonly user: Partial<gp2.User> | undefined;
  readonly onboarded: boolean;
}> = ({ children, user, onboarded }) => {
  const ctx = useAuth0GP2();

  let auth0User: Auth0User<gp2.User> | undefined;
  if (user) {
    const completeUser: gp2.User = {
      id: 'testuserid',
      onboarded: onboarded,
      email: 'john.doe@example.com',
      displayName: 'John Doe',
      firstName: 'John',
      lastName: 'Doe',
      role: 'Administrator',
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
    <Auth0ContextGP2.Provider
      value={{
        ...ctx,
        isAuthenticated: true,
        user: auth0User,
        getTokenSilently: jest.fn().mockResolvedValue('token'),
        getIdTokenClaims: async () => ({ __raw: 'token' }),
      }}
    >
      {children}
    </Auth0ContextGP2.Provider>
  );
};
