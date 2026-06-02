import { User } from '@asap-hub/auth';
import type { UserResponse } from '@asap-hub/model';
import { JwtPayload } from 'jsonwebtoken';

/**
 * Converts a model `UserResponse` into the token `User` shape, grouping team
 * and working-group roles by entity (one entry each, carrying `roles[]`).
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
  interestGroups: user.interestGroups,
  projects: user.projects,
  role: user.role,
  openScienceTeamMember: user.openScienceTeamMember,
  algoliaApiKey: null,
  teams: user.teams.map(({ role, ...team }) => ({ ...team, roles: [role] })),
  workingGroups: user.workingGroups.map(({ role, ...wg }) => ({
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
