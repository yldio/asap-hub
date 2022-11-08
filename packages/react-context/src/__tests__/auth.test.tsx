import { Auth0User, gp2, User } from '@asap-hub/auth';
import { renderHook } from '@testing-library/react-hooks';

import {
  getUserClaimKey,
  useCurrentUserCRN,
  useCurrentUserGP2,
  useCurrentUserTeamRolesCRN,
} from '../auth';
import {
  Auth0ContextCRN,
  Auth0ContextGP2,
  useAuth0CRN,
  useAuth0GP2,
} from '../auth0';

const userProvider =
  (user: Auth0User | undefined): React.FC =>
  ({ children }) => {
    const ctx = useAuth0CRN();

    return (
      <Auth0ContextCRN.Provider
        value={{
          ...ctx,
          loading: false,
          isAuthenticated: true,
          user,
        }}
      >
        {children}
      </Auth0ContextCRN.Provider>
    );
  };

describe('getUserClaimKey', () => {
  it('returns a URL on the current origin', () => {
    expect(new URL(getUserClaimKey()).origin).toBe(window.location.origin);
  });

  it('returns a URL with the well-known path to the claim', () => {
    expect(new URL(getUserClaimKey()).pathname).toBe('/user');
  });
});

describe('useCurrentUser', () => {
  it('returns null when there is no Auth0 user', async () => {
    const { result } = renderHook(useCurrentUserCRN);
    expect(result.current).toBe(null);
  });

  it('throws if the Auth0 user is missing the user claim', async () => {
    const { result } = renderHook(useCurrentUserCRN, {
      wrapper: userProvider({
        sub: '42',
        aud: 'Av2psgVspAN00Kez9v1vR2c496a9zCW3',
      }),
    });
    expect(result.error).toMatchInlineSnapshot(
      `[Error: Auth0 user is missing user claim - expected claim key http://localhost/user, got keys [sub, aud]]`,
    );
  });

  it('throws if the user claim is not an object', async () => {
    const { result } = renderHook(useCurrentUserCRN, {
      wrapper: userProvider({
        sub: '42',
        aud: 'Av2psgVspAN00Kez9v1vR2c496a9zCW3',
        [`${window.location.origin}/user`]: 'testuser',
      }),
    });
    expect(result.error).toMatchInlineSnapshot(
      `[Error: Invalid user claim - expected object, got testuser]`,
    );
  });

  it('returns the user claim', async () => {
    const { result } = renderHook(useCurrentUserCRN, {
      wrapper: userProvider({
        sub: '42',
        aud: 'Av2psgVspAN00Kez9v1vR2c496a9zCW3',
        [`${window.location.origin}/user`]: {
          id: 'testuser',
          onboarded: true,
          email: 'john.doe@example.com',
          firstName: 'John',
          lastName: 'Doe',
          displayName: 'John Doe',
          teams: [],
          algoliaApiKey: 'asdasda',
        },
      }),
    });
    expect(result.current).toHaveProperty('id', 'testuser');
  });
});

describe('useCurrentUserGP2', () => {
  const userProviderGP2 =
    (user: Auth0User<gp2.User> | undefined): React.FC =>
    ({ children }) => {
      const ctx = useAuth0GP2();

      return (
        <Auth0ContextGP2.Provider
          value={{
            ...ctx,
            loading: false,
            isAuthenticated: true,
            user,
          }}
        >
          {children}
        </Auth0ContextGP2.Provider>
      );
    };
  it('returns null when there is no Auth0 user', async () => {
    const { result } = renderHook(useCurrentUserGP2);
    expect(result.current).toBe(null);
  });

  it('throws if the Auth0 user is missing the user claim', async () => {
    const { result } = renderHook(useCurrentUserGP2, {
      wrapper: userProviderGP2({
        sub: '42',
        aud: 'Av2psgVspAN00Kez9v1vR2c496a9zCW3',
      }),
    });
    expect(result.error).toMatchInlineSnapshot(
      `[Error: Auth0 user is missing user claim - expected claim key http://localhost/user, got keys [sub, aud]]`,
    );
  });

  it('throws if the user claim is not an object', async () => {
    const { result } = renderHook(useCurrentUserGP2, {
      wrapper: userProviderGP2({
        sub: '42',
        aud: 'Av2psgVspAN00Kez9v1vR2c496a9zCW3',
        [`${window.location.origin}/user`]: 'testuser',
      }),
    });
    expect(result.error).toMatchInlineSnapshot(
      `[Error: Invalid user claim - expected object, got testuser]`,
    );
  });

  it('returns the user claim', async () => {
    const { result } = renderHook(useCurrentUserGP2, {
      wrapper: userProviderGP2({
        sub: '42',
        aud: 'Av2psgVspAN00Kez9v1vR2c496a9zCW3',
        [`${window.location.origin}/user`]: {
          id: 'testuser',
          onboarded: true,
          email: 'john.doe@example.com',
          firstName: 'John',
          lastName: 'Doe',
          displayName: 'John Doe',
          role: 'Network Collaborator',
        },
      }),
    });
    expect(result.current).toHaveProperty('id', 'testuser');
  });
});
describe('useCurrentUserTeamRoles', () => {
  const userTeam: User['teams'][number] = {
    displayName: 'Jakobsson, J',
    role: 'Project Manager' as const,
    id: '1',
  };
  it('returns an empty array when there is no current user', async () => {
    const { result } = renderHook(useCurrentUserTeamRolesCRN, {
      wrapper: userProvider(undefined),
    });
    expect(result.current).toEqual([]);
  });

  it('returns an array of team user roles when there is a logged in user', async () => {
    const { result } = renderHook(useCurrentUserTeamRolesCRN, {
      wrapper: userProvider({
        sub: '42',
        aud: 'Av2psgVspAN00Kez9v1vR2c496a9zCW3',
        [`${window.location.origin}/user`]: {
          id: 'testuser',
          onboarded: true,
          email: 'john.doe@example.com',
          firstName: 'John',
          lastName: 'Doe',
          displayName: 'John Doe',
          teams: [
            { ...userTeam, role: 'ASAP Staff' },
            { ...userTeam, role: 'Collaborating PI' },
          ],
          algoliaApiKey: 'asdasda',
        },
      }),
    });
    expect(result.current).toEqual(['ASAP Staff', 'Collaborating PI']);
  });
});
