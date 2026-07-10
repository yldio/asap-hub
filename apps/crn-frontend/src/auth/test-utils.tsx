/* istanbul ignore file */
import type { Auth0, Auth0User, User } from '@asap-hub/auth';
import type { UserResponse } from '@asap-hub/model';
import { Auth0ContextCRN, getUserClaimKey } from '@asap-hub/react-context';
import createAuth0Client, { Auth0Client } from '@auth0/auth0-spa-js';
import { useContext, useEffect, useRef, useState } from 'react';

// Recoil-free since Phase 5 of the recoil → react-query migration. The fixture
// provides the Auth0 context directly (async-initialised, exactly like the
// production `AuthProvider`): `useAuthorization()` and react-query hooks read
// the token through that context, so no recoil store is needed. The exported
// API (`Auth0Provider`, `WhenReady`) is unchanged — its ~83 importers keep
// working without edits.

const notImplemented = (method: string) => () => {
  throw new Error(`${method} not implemented by the Auth0 test fixture`);
};
const notReady = (method: string) => () => {
  throw new Error(`Auth0 test fixture loading, not ready for ${method}`);
};

// Tests build users from both the token `User` (teams carry `roles[]`) and the
// model `UserResponse` (teams carry a single `role`). Accept either and
// normalise to the token shape.
type TestUser =
  | Partial<User>
  | (Partial<Omit<User, 'teams' | 'workingGroups'>> &
      Partial<Pick<UserResponse, 'teams' | 'workingGroups'>>);

type GroupedRoles = Record<string, unknown> & { roles: unknown[] };

const groupRoles = (
  items: ReadonlyArray<Record<string, unknown>> | undefined,
): GroupedRoles[] =>
  (items ?? []).reduce<GroupedRoles[]>((grouped, { role, roles, ...rest }) => {
    const incoming = (roles as unknown[]) ?? (role === undefined ? [] : [role]);
    const existing = grouped.find((entry) => entry.id === rest.id);
    if (existing) {
      existing.roles.push(...incoming);
      return grouped;
    }
    return [...grouped, { ...rest, roles: [...incoming] }];
  }, []);

const createAuth0 = (
  auth0Client?: Auth0Client,
  user?: TestUser,
  auth0Overrides?: (
    auth0ClientOverride?: Auth0Client,
    auth0UserOverride?: Auth0User,
  ) => Partial<Auth0>,
): Auth0 => {
  let auth0User: Auth0User | undefined;
  if (user) {
    const { teams, workingGroups, ...rest } = user;
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
          roles: ['Lead PI (Core Leadership)'],
        },
      ],
      algoliaApiKey: null,
      workingGroups: [],
      interestGroups: [],
      projects: [],
      role: 'Grantee',
      openScienceTeamMember: false,
      ...rest,
      ...(teams && {
        teams: groupRoles(
          teams as unknown as Record<string, unknown>[],
        ) as unknown as User['teams'],
      }),
      ...(workingGroups && {
        workingGroups: groupRoles(
          workingGroups as unknown as Record<string, unknown>[],
        ) as unknown as User['workingGroups'],
      }),
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

type Auth0ProviderProps = {
  // no property ommission, only explicit undefined allowed if you really want the 'user-not-yet-fetched' state
  readonly user: TestUser | undefined;
  readonly children: React.ReactNode;
  readonly auth0Overrides?: (
    auth0Client?: Auth0Client,
    auth0User?: Auth0User,
  ) => Partial<Auth0>;
};

export const Auth0Provider: React.FC<Auth0ProviderProps> = ({
  user,
  children,
  auth0Overrides,
}) => {
  const [auth0, setAuth0] = useState<Auth0>();

  // Re-init whenever the (stringified) user changes so onboarding flows that
  // swap the user mid-test are reflected, but ignore the identity churn of an
  // inline `auth0Overrides` callback (read the latest via a ref). Keeping
  // `auth0Overrides` in the dependency array would re-run this effect every
  // render and flap the context between loading and ready, unmounting
  // `WhenReady`'s children mid-test.
  const auth0OverridesRef = useRef(auth0Overrides);
  auth0OverridesRef.current = auth0Overrides;
  const userKey = JSON.stringify(user ?? null);

  useEffect(() => {
    let cancelled = false;
    const initAuth0 = async () => {
      const auth0Client = await createAuth0Client({
        domain: 'auth.example.com',
        client_id: 'client_id',
        redirect_uri: 'http://localhost',
      });
      if (!cancelled) {
        setAuth0(createAuth0(auth0Client, user, auth0OverridesRef.current));
      }
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    initAuth0();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userKey]);

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
  const { loading } = useContext(Auth0ContextCRN);
  return loading ? <p>Auth0 loading...</p> : <>{children}</>;
};
