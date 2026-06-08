import { User } from '@asap-hub/auth';
import type { UserResponse } from '@asap-hub/model';
import { JwtPayload } from 'jsonwebtoken';

const uniqueById = <T extends { id: string }>(items: ReadonlyArray<T>): T[] =>
  items.reduce<T[]>(
    (unique, item) =>
      unique.some((existing) => existing.id === item.id)
        ? unique
        : [...unique, item],
    [],
  );

// Collapse one-row-per-role memberships into one entry per entity, collecting
// every role — mirrors the grouping the real token builder performs.
const groupRolesById = <
  TRole,
  TInput extends { id: string; role: TRole },
  TOutput extends { id: string; roles: TRole[] },
>(
  items: ReadonlyArray<TInput>,
  toEntry: (item: TInput) => TOutput,
): TOutput[] =>
  items.reduce<TOutput[]>((grouped, item) => {
    const existing = grouped.find((entry) => entry.id === item.id);
    if (existing) {
      if (!existing.roles.includes(item.role)) {
        existing.roles.push(item.role);
      }
      return grouped;
    }
    return [...grouped, toEntry(item)];
  }, []);

/**
 * Converts a model `UserResponse` into the token `User` shape, grouping team
 * and working-group roles by entity (one entry each, carrying `roles[]`) and
 * deduplicating interest groups and projects by id.
 */
export const toAuthUser = (
  user: UserResponse,
): Pick<
  User,
  | 'id'
  | 'onboarded'
  | 'displayName'
  | 'email'
  | 'firstName'
  | 'lastName'
  | 'avatarUrl'
  | 'interestGroups'
  | 'projects'
  | 'role'
  | 'openScienceTeamMember'
> & {
  teams: User['teams'];
  workingGroups: User['workingGroups'];
  algoliaApiKey: null;
} => ({
  id: user.id,
  onboarded: !!user.onboarded,
  displayName: user.displayName,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  avatarUrl: user.avatarUrl,
  interestGroups: uniqueById(user.interestGroups),
  projects: uniqueById(user.projects),
  role: user.role,
  openScienceTeamMember: user.openScienceTeamMember,
  algoliaApiKey: null,
  teams: groupRolesById(user.teams, ({ role, ...team }) => ({
    ...team,
    roles: [role],
  })),
  workingGroups: groupRolesById(user.workingGroups, ({ role, ...wg }) => ({
    ...wg,
    roles: [role],
  })),
});

export const createAuthUser = (): User => ({
  id: 'test-id-11',
  onboarded: true,
  displayName: 'Tony Stark',
  email: 'tony.stark@asap.science',
  firstName: 'Tony',
  lastName: 'Stark',
  teams: [
    {
      id: 'team-id-1',
      displayName: 'Awesome Team',
      roles: ['Project Manager'],
    },
  ],
  algoliaApiKey: 'test-mock-key',
  workingGroups: [
    {
      id: 'wg-id-1',
      name: 'Working Group',
      roles: ['Project Manager'],
      active: true,
    },
  ],
  interestGroups: [
    {
      id: 'ig-id-1',
      name: 'Interest Group',
      active: true,
    },
  ],
  projects: [
    {
      id: 'project-id-1',
      title: 'Discovery Project Alpha',
      projectType: 'Discovery Project',
      status: 'Active',
    },
    {
      id: 'project-id-2',
      title: 'Trainee Project Beta',
      projectType: 'Trainee Project',
      status: 'Active',
    },
  ],
  role: 'Grantee',
  openScienceTeamMember: false,
});

export const getJwtPayload = (): JwtPayload => ({
  given_name: 'Tony',
  family_name: 'Stark',
  name: 'Tony Stark',
  sub: 'google-oauth2|awesomeGoogleCode',
  aud: ['audience'],
});
