import {
  UserRole,
  UserResponse,
  UserTeam,
  UserProjectMembership,
  WorkingGroupMembership,
} from '@asap-hub/model';

type AssociationType = 'teams' | 'workingGroups' | 'projects';

type AssociationMembership =
  | UserTeam
  | WorkingGroupMembership
  | UserProjectMembership;

/**
 * Accepts any user whose teams/working groups carry a single `role` per row.
 * The grouped token `User` must be expanded via `expandUserTeamRoles` /
 * `expandUserWorkingGroupRoles` before being passed here.
 */
type UserInput =
  | (Pick<UserResponse, 'role'> & {
      teams: ReadonlyArray<UserTeam>;
      workingGroups: ReadonlyArray<WorkingGroupMembership>;
      projects: ReadonlyArray<UserProjectMembership>;
    })
  | null;

export const isStaff = (user: UserInput): boolean => user?.role === 'Staff';

export const isActiveAndBelongsToAssociation = (
  user: AssociationMembership,
  association: AssociationType,
  associationIds: string[],
): boolean => {
  const belongsToAssociation = associationIds.includes(user.id);
  let isActive: boolean;
  if (association === 'teams') {
    isActive =
      !('inactiveSinceDate' in user) || user.inactiveSinceDate === undefined;
  } else if (association === 'projects') {
    isActive = 'status' in user && user.status === 'Active';
  } else {
    isActive = 'active' in user && user.active;
  }

  return belongsToAssociation && isActive;
};

const ELEVATED_WORKING_GROUP_ROLES = new Set([
  'Project Manager',
  'Lead',
  'Co-lead',
]);

export const isProjectManagerAndActive = (
  user: AssociationMembership,
  associationType: AssociationType,
  associationIds: string[],
): boolean => {
  if (associationType === 'projects' || !('role' in user)) {
    return false;
  }

  const hasElevatedRole =
    associationType === 'workingGroups'
      ? ELEVATED_WORKING_GROUP_ROLES.has(user.role)
      : user.role === 'Project Manager';

  return (
    hasElevatedRole &&
    isActiveAndBelongsToAssociation(user, associationType, associationIds)
  );
};

export const getUserRole = (
  user: UserInput,
  associationType: AssociationType,
  associationIds: string[],
): UserRole => {
  if (!user) return 'None';

  if (isStaff(user)) return 'Staff';

  const isUserActiveProjectManager = user[associationType].some((membership) =>
    isProjectManagerAndActive(membership, associationType, associationIds),
  );

  if (isUserActiveProjectManager) return 'Staff';

  const isUserActiveMember = user[associationType].some((membership) =>
    isActiveAndBelongsToAssociation(
      membership,
      associationType,
      associationIds,
    ),
  );

  return isUserActiveMember ? 'Member' : 'None';
};

export const hasResearchOutputDraftAccess = (
  user: UserInput,
  associations: {
    teams?: string[];
    workingGroups?: string[];
    projects?: string[];
  },
): boolean =>
  getUserRole(user, 'teams', associations.teams ?? []) !== 'None' ||
  getUserRole(user, 'workingGroups', associations.workingGroups ?? []) !==
    'None' ||
  getUserRole(user, 'projects', associations.projects ?? []) !== 'None';

export const hasRequestForReviewPermission = (userRole: UserRole): boolean =>
  userRole === 'Member';

export const hasShareResearchOutputPermission = (userRole: UserRole): boolean =>
  userRole === 'Staff' || userRole === 'Member';

export const hasDuplicateResearchOutputPermission = (
  userRole: UserRole,
): boolean => userRole === 'Staff' || userRole === 'Member';

export const hasPublishResearchOutputPermission = (
  userRole: UserRole,
  isManuscriptOutput: boolean,
): boolean =>
  userRole === 'Staff' || (isManuscriptOutput && userRole === 'Member');

export const hasVersionResearchOutputPermission = (
  userRole: UserRole,
  isManuscriptOutput: boolean,
): boolean => hasPublishResearchOutputPermission(userRole, isManuscriptOutput);

export const hasEditResearchOutputPermission = (
  userRole: UserRole,
  published: boolean,
  isManuscriptOutput: boolean,
): boolean =>
  userRole === 'Staff' ||
  (userRole === 'Member' && (!published || isManuscriptOutput));
