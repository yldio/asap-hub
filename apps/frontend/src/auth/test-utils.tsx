/* istanbul ignore file */
/* eslint-disable @typescript-eslint/camelcase */

import React, { useEffect } from 'react';
import createAuth0Client, { Auth0Client } from '@auth0/auth0-spa-js';
import type { User, Auth0User, Auth0 } from '@asap-hub/auth';
import { Auth0Context, getUserClaimKey } from '@asap-hub/react-context';
import { useRecoilState, useResetRecoilState, useRecoilValue } from 'recoil';
import { auth0State } from './state';

const notImplemented = (method: string) => () => {
  throw new Error(`${method} not implemented by the Auth0 test fixture`);
};
const notReady = (method: string) => () => {
  throw new Error(`Auth0 test fixture loading, not ready for ${method}`);
};

const createAuth0 = (
  auth0Client?: Auth0Client,
  user?: Partial<User>,
): Auth0 => {
  let auth0User: Auth0User | undefined;
  if (user) {
    const completeUser: User = {
      id: 'testuserid',
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

  return {
    ...{
      loading: !auth0Client,
      popupOpen: false,
      isAuthenticated: false,
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
    },
    ...(auth0User && {
      isAuthenticated: true,
      user: auth0User,
      getTokenSilently: async () => 'access_token',
      getIdTokenClaims: async () => ({ __raw: 'id_token' }),
    }),
  };
};

export const Auth0Provider: React.FC<{
  readonly user?: Partial<User>;
  readonly children: React.ReactNode;
}> = ({ user, children }) => {
  const [auth0, setAuth0] = useRecoilState(auth0State);
  const resetAuth0 = useResetRecoilState(auth0State);
  useEffect(() => {
    const initAuth0 = async () => {
      const auth0Client = await createAuth0Client({
        domain: 'auth.example.com',
        client_id: 'client_id',
        redirect_uri: 'http://localhost',
      });
      setAuth0(createAuth0(auth0Client, user));
    };
    initAuth0();

    return () => {
      resetAuth0();
    };
  }, [user, setAuth0, resetAuth0]);

  return (
    <Auth0Context.Provider value={auth0 ?? createAuth0()}>
      {children}
    </Auth0Context.Provider>
  );
};

export const WhenReady: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const loading = useRecoilValue(auth0State)?.loading ?? true;
  return loading ? <p>Auth0 loading...</p> : <>{children}</>;
};
