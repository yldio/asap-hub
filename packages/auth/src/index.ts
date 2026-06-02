import type {
  TeamRole,
  UserMetadataResponse,
  UserResponse,
  WorkingGroupMembership,
} from '@asap-hub/model';
import type { Auth0Client, GetTokenSilentlyOptions } from '@auth0/auth0-spa-js';
import auth0PubKeys from './pubKeys';

export * as gp2 from './gp2';
export { auth0PubKeys };

/**
 * Token-shaped team membership: one entry per team, carrying every role the
 * user holds in that team. Mirrors `UserTeam` but with `roles` instead of a
 * single `role`, so the nav menu and other token consumers see each team once.
 */
export type UserTeamRoles = Omit<UserResponse['teams'][0], 'role'> & {
  roles: TeamRole[];
};

/**
 * Token-shaped working group membership: one entry per working group with every
 * role the user holds in it.
 */
export type UserWorkingGroupRoles = Omit<WorkingGroupMembership, 'role'> & {
  roles: WorkingGroupMembership['role'][];
};

export type User = Pick<
  UserMetadataResponse,
  | 'id'
  | 'onboarded'
  | 'displayName'
  | 'email'
  | 'firstName'
  | 'lastName'
  | 'avatarUrl'
  | 'algoliaApiKey'
  | 'interestGroups'
  | 'projects'
  | 'role'
  | 'openScienceTeamMember'
> & {
  teams: ReadonlyArray<UserTeamRoles>;
  workingGroups: ReadonlyArray<UserWorkingGroupRoles>;
};

/**
 * Expands grouped token teams (one entry per team with `roles[]`) back into the
 * per-role row shape (`{ ...team, role }`) that shared permission helpers such
 * as `getUserRole` and `isProjectLead` expect. Lets those helpers keep treating
 * the token user and the model `UserResponse` uniformly.
 */
export const expandUserTeamRoles = (
  teams: ReadonlyArray<UserTeamRoles>,
): UserResponse['teams'] =>
  teams.flatMap(({ roles, ...team }) =>
    roles.map((role) => ({ ...team, role })),
  );

export const expandUserWorkingGroupRoles = (
  workingGroups: ReadonlyArray<UserWorkingGroupRoles>,
): WorkingGroupMembership[] =>
  workingGroups.flatMap(({ roles, ...workingGroup }) =>
    roles.map((role) => ({ ...workingGroup, role })),
  );

/**
 * Expands a whole token user's grouped teams and working groups back into the
 * per-role row shape expected by shared permission helpers.
 */
export const expandUserRoles = (
  user: User,
): Omit<User, 'teams' | 'workingGroups'> & {
  teams: UserResponse['teams'];
  workingGroups: WorkingGroupMembership[];
} => ({
  ...user,
  teams: expandUserTeamRoles(user.teams),
  workingGroups: expandUserWorkingGroupRoles(user.workingGroups),
});

export interface Auth0User<T = User> {
  readonly sub: string;
  readonly name?: string;
  readonly given_name?: string;
  readonly family_name?: string;
  readonly orcid?: string;
  readonly aud: string;
  readonly [customUserClaim: string]: string | undefined | T;
}

export interface Auth0IdToken {
  readonly sub: string;
  readonly name?: string;
  readonly given_name?: string;
  readonly family_name?: string;
  readonly orcid?: string;
  readonly aud: string[];
}

export type Auth0<T = User> = {
  readonly isAuthenticated?: boolean;
  readonly user?: Auth0User<T>;
  readonly loading: boolean;
  readonly popupOpen: boolean;
  readonly refreshUser: () => Promise<void>;
  readonly checkSession?: () => Promise<void>;
  readonly getTokenSilently: (
    options?: GetTokenSilentlyOptions,
  ) => Promise<string>;
} & Pick<
  Auth0Client,
  | 'getIdTokenClaims'
  | 'loginWithRedirect'
  | 'loginWithPopup'
  | 'handleRedirectCallback'
  | 'getTokenWithPopup'
  | 'logout'
>;
