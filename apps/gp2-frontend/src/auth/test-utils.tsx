/* istanbul ignore file */

import type { Auth0, Auth0User, gp2 } from '@asap-hub/auth';
import { Auth0ContextGP2, getUserClaimKey } from '@asap-hub/react-context';
import createAuth0Client, { Auth0Client } from '@auth0/auth0-spa-js';
import { useEffect } from 'react';
import {
  useRecoilState,
  useRecoilValue,
  useRecoilRefresher_UNSTABLE,
} from 'recoil';
import { auth0State } from './state';

const notImplemented = (method: string) => () => {
  throw new Error(`${method} not implemented by the Auth0 test fixture`);
};
const notReady = (method: string) => () => {
  throw new Error(`Auth0 test fixture loading, not ready for ${method}`);
};

const createAuth0 = (
  auth0Client?: Auth0Client,
  user?: Partial<gp2.User>,
  auth0Overrides?: (
    auth0ClientOverride?: Auth0Client,
    auth0UserOverride?: Auth0User<gp2.User>,
  ) => Partial<Auth0<gp2.User>>,
): Auth0<gp2.User> => {
  let auth0User: Auth0User<gp2.User> | undefined;
  if (user) {
    const completeUser: gp2.User = {
      id: 'testuserid',
      onboarded: true,
      email: 'john.doe@example.com',
      displayName: 'John Doe',
      firstName: 'John',
      lastName: 'Doe',
      role: 'Network Collaborator',
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
      refreshUser: auth0Client ? async () => {} : notReady('refreshUser'),
    },
    ...(auth0User && {
      isAuthenticated: true,
      user: auth0User,
      getTokenSilently: jest.fn().mockResolvedValue('access_token'),
      getIdTokenClaims: async () => ({ __raw: 'id_token' }),
    }),
    ...(auth0Overrides && auth0Overrides(auth0Client, auth0User)),
  };
};

export const Auth0Provider: React.FC<{
  // no property ommission, only explicit undefined allowed if you really want the 'user-not-yet-fetched' state
  readonly user: Partial<gp2.User> | undefined;
  readonly children: React.ReactNode;
  readonly auth0Overrides?: (
    auth0Client?: Auth0Client,
    auth0User?: Auth0User<gp2.User>,
  ) => Partial<Auth0<gp2.User>>;
}> = ({ user, children, auth0Overrides }) => {
  const [auth0, setAuth0] = useRecoilState(auth0State);
  const resetAuth0 = useRecoilRefresher_UNSTABLE(auth0State);
  useEffect(() => {
    const initAuth0 = async () => {
      const auth0Client = await createAuth0Client({
        domain: 'auth.example.com',
        client_id: 'client_id',
        redirect_uri: 'http://localhost',
      });
      setAuth0(createAuth0(auth0Client, user, auth0Overrides));
    };
    initAuth0();

    return () => {
      resetAuth0();
    };
  }, [user, setAuth0, resetAuth0, auth0Overrides]);

  return (
    <Auth0ContextGP2.Provider
      value={auth0 ?? createAuth0(undefined, undefined, auth0Overrides)}
    >
      {children}
    </Auth0ContextGP2.Provider>
  );
};

export const WhenReady: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const loading = useRecoilValue(auth0State)?.loading ?? true;
  return loading ? <p>Auth0 loading...</p> : <>{children}</>;
};
