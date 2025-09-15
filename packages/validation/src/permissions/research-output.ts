import { User } from '@asap-hub/auth';
import {
  UserRole,
  UserResponse,
  UserTeam,
  WorkingGroupMembership,
} from '@asap-hub/model';

type AssociationType = 'teams' | 'workingGroups';
type UserInput = Omit<User, 'algoliaApiKey'> | UserResponse | null;

export const isActiveAndBelongsToAssociation = (
  user: UserTeam | WorkingGroupMembership,
  association: AssociationType,
  associationIds: string[],
): boolean => {
  const belongsToAssociation = associationIds.includes(user.id);
  const isActive =
    association === 'teams'
      ? !('inactiveSinceDate' in user) || user.inactiveSinceDate === undefined
      : 'active' in user && user.active;

  return belongsToAssociation && isActive;
};

export const isProjectManagerAndActive = (
  user: UserTeam | WorkingGroupMembership,
  association: AssociationType,
  associationIds: string[],
): boolean =>
  user.role === 'Project Manager' &&
  isActiveAndBelongsToAssociation(user, association, associationIds);

export const getUserRole = (
  user: UserInput,
  association: AssociationType,
  associationIds: string[],
): UserRole => {
  if (!user) return 'None';

  if (user.role === 'Staff') return 'Staff';

  const isUserActiveProjectManager = user[association].some(
    (teamOrWorkingGroup) =>
      isProjectManagerAndActive(
        teamOrWorkingGroup,
        association,
        associationIds,
      ),
  );

  if (isUserActiveProjectManager) return 'Staff';

  const isUserActiveMember = user[association].some((teamOrWorkingGroup) =>
    isActiveAndBelongsToAssociation(
      teamOrWorkingGroup,
      association,
      associationIds,
    ),
  );

  return isUserActiveMember ? 'Member' : 'None';
};

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
