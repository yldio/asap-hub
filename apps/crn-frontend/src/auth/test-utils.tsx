/* istanbul ignore file */
import type { Auth0, Auth0User, User } from '@asap-hub/auth';
import { Auth0ContextCRN, getUserClaimKey } from '@asap-hub/react-context';
import createAuth0Client, { Auth0Client } from '@auth0/auth0-spa-js';
import { useContext, useEffect } from 'react';
import {
  useRecoilRefresher_UNSTABLE as useRecoilRefresher,
  useRecoilState,
  useRecoilValue,
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
  user?: Partial<User>,
  auth0Overrides?: (
    auth0ClientOverride?: Auth0Client,
    auth0UserOverride?: Auth0User,
  ) => Partial<Auth0>,
): Auth0 => {
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
      algoliaApiKey: 'test-api-key',
      workingGroups: [],
      interestGroups: [],
      role: 'Grantee',
      openScienceTeamMember: false,
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
  readonly user: Partial<User> | undefined;
  readonly children: React.ReactNode;
  readonly auth0Overrides?: (
    auth0Client?: Auth0Client,
    auth0User?: Auth0User,
  ) => Partial<Auth0>;
}> = ({ user, children, auth0Overrides }) => {
  const [auth0, setAuth0] = useRecoilState(auth0State);
  const resetAuth0 = useRecoilRefresher(auth0State);
  useEffect(() => {
    const initAuth0 = async () => {
      const auth0Client = await createAuth0Client({
        domain: 'auth.example.com',
        client_id: 'client_id',
        redirect_uri: 'http://localhost',
      });
      setAuth0(createAuth0(auth0Client, user, auth0Overrides));
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    initAuth0();

    return () => {
      resetAuth0();
    };
  }, [user, setAuth0, resetAuth0, auth0Overrides]);

  return (
    <Auth0ContextCRN.Provider
      value={auth0 ?? createAuth0(undefined, undefined, auth0Overrides)}
    >
      {children}
    </Auth0ContextCRN.Provider>
  );
};

export const WhenReady: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const contextAuth0 = useContext(Auth0ContextCRN);
  const loading =
    (useRecoilValue(auth0State)?.loading ?? true) || contextAuth0.loading;
  return loading ? <p>Auth0 loading...</p> : <>{children}</>;
};
