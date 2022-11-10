/* istanbul ignore file */

import type { Auth0, Auth0User, gp2 as gp2Auth, User } from '@asap-hub/auth';
import { createAuthUser, gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import {
  Auth0ContextCRN,
  Auth0ContextGP2,
  getUserClaimKey,
  useAuth0CRN,
  useAuth0GP2,
} from '@asap-hub/react-context';
import createAuth0Client, { Auth0Client } from '@auth0/auth0-spa-js';
import { Context, useEffect, useState } from 'react';

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
interface Auth0ProviderProps<T> {
  readonly children: React.ReactNode;
  readonly AuthContext?: Context<Auth0<T>>;
}
export const Auth0ProviderCRN = <T = User,>(props: Auth0ProviderProps<T>) => {
  const { AuthContext = Auth0ContextCRN, children } = props;
  const [auth0Client, setAuth0] = useState<Auth0Client>();
  useEffect(() => {
    const initAuth0 = async () => {
      setAuth0(await createAuth0Client(createAuth0ClientParams));
    };
    initAuth0();
  }, []);

  return (
    <AuthContext.Provider value={auth0Context(auth0Client)}>
      {children}
    </AuthContext.Provider>
  );
};

export const Auth0ProviderGP2 = ({
  children,
}: Auth0ProviderProps<gp2Auth.User>) => (
  <Auth0ProviderCRN<gp2Auth.User> AuthContext={Auth0ContextGP2}>
    {children}
  </Auth0ProviderCRN>
);

interface WhenReadyProps<T> {
  readonly children: React.ReactNode;
  readonly useAuth0?: () => Auth0<T>;
}
export const WhenReadyCRN = <T = User,>(props: WhenReadyProps<T>) => {
  const { children, useAuth0 = useAuth0CRN } = props;
  const { loading } = useAuth0();
  return loading ? <p>Auth0 loading...</p> : <>{children}</>;
};

export const WhenReadyGP2 = ({ children }: WhenReadyProps<gp2Auth.User>) => (
  <WhenReadyCRN<gp2Auth.User> useAuth0={useAuth0GP2}>{children}</WhenReadyCRN>
);
// function isUser(user: User | gp2Auth.User): user is User {
//   return 'algoliaApiKey' in user;
// }

interface LoggedInBaseProps<T> {
  readonly children: React.ReactNode;
  // undefined user should be explicit, this is for the intermediate state
  // where the getUser() promise is pending.
  readonly user: Partial<T> | undefined;
  readonly mockUser: () => T;
  readonly useAuth0: () => Auth0<T>;
  readonly AuthContext: Context<Auth0<T>>;
}
export const LoggedInBase = <T extends Auth0UserBase>(
  props: LoggedInBaseProps<T>,
) => {
  const { children, user, useAuth0, mockUser, AuthContext } = props;
  const ctx = useAuth0();
  const getAuth0User = (): Auth0User<T> => {
    const completeUser = {
      ...mockUser(),
      ...user,
    };
    return getAuth0UserFromUser<T>(completeUser);
  };

  const auth0User = user ? getAuth0User() : undefined;

  return (
    <AuthContext.Provider
      value={{
        ...ctx,
        isAuthenticated: true,
        user: auth0User,
        getTokenSilently: jest.fn().mockResolvedValue('token'),
        getIdTokenClaims: async () => ({ __raw: 'token' }),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

type LoggedInCRNProps = Pick<LoggedInBaseProps<User>, 'children' | 'user'>;
export const LoggedInCRN = ({ children, user }: LoggedInCRNProps) => (
  <LoggedInBase
    user={user}
    useAuth0={useAuth0CRN}
    mockUser={createAuthUser}
    AuthContext={Auth0ContextCRN}
  >
    {children}
  </LoggedInBase>
);

type LoggedInGP2Props = Pick<
  LoggedInBaseProps<gp2Auth.User>,
  'children' | 'user'
>;
export const LoggedInGP2 = ({ children, user }: LoggedInGP2Props) => (
  <LoggedInBase
    user={user}
    useAuth0={useAuth0GP2}
    mockUser={gp2Fixtures.createAuthUser}
    AuthContext={Auth0ContextGP2}
  >
    {children}
  </LoggedInBase>
);

type Auth0UserBase = {
  displayName: string;
  firstName: string;
  lastName: string;
};
const getAuth0UserFromUser = <T extends Auth0UserBase>(completeUser: T) => ({
  sub: 'testuser',
  name: completeUser.displayName,
  given_name: completeUser.firstName,
  family_name: completeUser.lastName,
  aud: 'Av2psgVspAN00Kez9v1vR2c496a9zCW3',
  [getUserClaimKey()]: completeUser,
});
