import { renderHook } from '@testing-library/react-hooks/server';
import { Auth0User, User } from '@asap-hub/auth';

import { Auth0Context, useAuth0 } from '../auth0';
import {
  getUserClaimKey,
  useCurrentUser,
  useCurrentUserTeamRoles,
} from '../auth';

const userProvider =
  (user: Auth0User | undefined): React.FC =>
  ({ children }) => {
    const ctx = useAuth0();

    return (
      <Auth0Context.Provider
        value={{
          ...ctx,
          loading: false,
          isAuthenticated: true,
          user,
        }}
      >
        {children}
      </Auth0Context.Provider>
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
    const { result } = renderHook(useCurrentUser);
    expect(result.current).toBe(null);
  });

  it('throws if the Auth0 user is missing the user claim', async () => {
    const { result } = renderHook(useCurrentUser, {
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
    const { result } = renderHook(useCurrentUser, {
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
    const { result } = renderHook(useCurrentUser, {
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

describe('useCurrentUserTeamRoles', () => {
  const userTeam: User['teams'][number] = {
    displayName: 'Jakobsson, J',
    role: 'Project Manager' as const,
    id: '1',
  };
  it('returns an empty array when there is no current user', async () => {
    const { result } = renderHook(useCurrentUserTeamRoles, {
      wrapper: userProvider(undefined),
    });
    expect(result.current).toEqual([]);
  });

  it('returns an array of team user roles when there is a logged in user', async () => {
    const { result } = renderHook(useCurrentUserTeamRoles, {
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
