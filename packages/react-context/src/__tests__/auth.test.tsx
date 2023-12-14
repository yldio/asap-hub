import { Auth0User, gp2, User } from '@asap-hub/auth';
import { renderHook } from '@testing-library/react-hooks';

import {
  getUserClaimKey,
  useCurrentUserCRN,
  useCurrentUserGP2,
  useCurrentUserProjectRolesGP2,
  useCurrentUserRoleGP2,
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
          workingGroups: [],
          interestGroups: [],
          role: 'Grantee',
        },
      }),
    });
    expect(result.current).toHaveProperty('id', 'testuser');
  });
});

describe('useCurrentUserGP2', () => {
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
          algoliaApiKey: 'asdasda',
          projects: [],
          workingGroups: [],
        },
      }),
    });
    expect(result.current).toHaveProperty('id', 'testuser');
  });
});

describe('useCurrentUserRoleGP2', () => {
  it('returns undefined when there is no current user', async () => {
    const { result } = renderHook(
      () => useCurrentUserRoleGP2('proj-1', 'Projects'),
      {
        wrapper: userProviderGP2(undefined),
      },
    );
    expect(result.current).toBeUndefined();
  });

  it('returns undefined when entity is not Projects', async () => {
    const { result } = renderHook(
      () => useCurrentUserRoleGP2('wg-1', 'WorkingGroups'),
      {
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
            projects: [],
            algoliaApiKey: 'asdasda',
            workingGroups: [],
            role: 'Trainee',
          },
        }),
      },
    );
    expect(result.current).toBeUndefined();
  });

  it('returns the user role in the project when there is a logged in user', async () => {
    const project: gp2.User['projects'][number] = {
      id: 'proj-1',
      title: 'Proj',
      status: 'Active',
      members: [
        { role: 'Project manager', userId: 'testuser' },
        { role: 'Contributor', userId: '2' },
      ],
    };
    const { result } = renderHook(
      () => useCurrentUserRoleGP2('proj-1', 'Projects'),
      {
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
            projects: [project],
            algoliaApiKey: 'asdasda',
            workingGroups: [],
            role: 'Trainee',
          },
        }),
      },
    );
    expect(result.current).toEqual('Project manager');
  });
});
describe('useCurrentUserProjectRolesGP2', () => {
  it('returns an empty array when there is no current user', async () => {
    const { result } = renderHook(() => useCurrentUserProjectRolesGP2(), {
      wrapper: userProviderGP2(undefined),
    });
    expect(result.current).toEqual([]);
  });

  it('returns an array of project user roles when there is a logged in user', async () => {
    const project1: gp2.User['projects'][number] = {
      id: 'proj-1',
      title: 'Proj',
      status: 'Active',
      members: [
        { role: 'Project manager', userId: 'testuser' },
        { role: 'Contributor', userId: '2' },
      ],
    };
    const project2: gp2.User['projects'][number] = {
      id: 'proj-1',
      title: 'Proj',
      status: 'Active',
      members: [
        { role: 'Project co-lead', userId: '1' },
        { role: 'Investigator', userId: 'testuser' },
        { role: 'Project manager', userId: '3' },
      ],
    };
    const { result } = renderHook(() => useCurrentUserProjectRolesGP2(), {
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
          projects: [project1, project2],
          algoliaApiKey: 'asdasda',
          workingGroups: [],
          role: 'Trainee',
        },
      }),
    });
    expect(result.current).toEqual(['Project manager', 'Investigator']);
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
          workingGroups: [],
          interestGroups: [],
          role: 'Grantee',
        },
      }),
    });
    expect(result.current).toEqual(['ASAP Staff', 'Collaborating PI']);
  });
});
