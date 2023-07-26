import { User } from '@asap-hub/auth';
import {
  UserRole,
  UserResponse,
  UserTeam,
  WorkingGroupMembership,
} from '@asap-hub/model';
import { isEnabled } from '@asap-hub/flags';

export const getUserRole = (
  user: Omit<User, 'algoliaApiKey'> | UserResponse | null,
  association: 'teams' | 'workingGroups',
  associationIds: string[],
): UserRole => {
  if (user === null) {
    return 'None';
  }

  if (user.role === 'Staff') {
    return 'Staff';
  }

  const isUserActiveProjectManager = user[association].some(
    (teamOrWorkingGroup: UserTeam | WorkingGroupMembership) => {
      if (
        association === 'teams' &&
        'inactiveSinceDate' in teamOrWorkingGroup
      ) {
        return (
          associationIds?.includes(teamOrWorkingGroup.id) &&
          teamOrWorkingGroup.role === 'Project Manager' &&
          teamOrWorkingGroup.inactiveSinceDate === undefined
        );
      } else if (
        association === 'workingGroups' &&
        'active' in teamOrWorkingGroup
      ) {
        return (
          associationIds?.includes(teamOrWorkingGroup.id) &&
          teamOrWorkingGroup.role === 'Project Manager' &&
          teamOrWorkingGroup.active
        );
      }
      return false;
    },
  );

  if (isUserActiveProjectManager) {
    return 'Staff';
  }

  const isUserActiveMember = user[association].some(
    (teamOrWorkingGroup: UserTeam | WorkingGroupMembership) => {
      if (
        association === 'teams' &&
        'inactiveSinceDate' in teamOrWorkingGroup
      ) {
        return (
          associationIds.includes(teamOrWorkingGroup.id) &&
          teamOrWorkingGroup.inactiveSinceDate === undefined
        );
      } else if (
        association === 'workingGroups' &&
        'active' in teamOrWorkingGroup
      ) {
        return (
          associationIds.includes(teamOrWorkingGroup.id) &&
          teamOrWorkingGroup.active
        );
      }
      return false;
    },
  );

  if (isUserActiveMember) {
    return 'Member';
  }

  return 'None';
};

export const hasRequestForReviewPermission = (userRole: UserRole): boolean =>
  isEnabled('DRAFT_RESEARCH_OUTPUT') && userRole === 'Member';

export const hasShareResearchOutputPermission = (userRole: UserRole): boolean =>
  userRole === 'Staff' ||
  (isEnabled('DRAFT_RESEARCH_OUTPUT') && userRole === 'Member');

export const hasDuplicateResearchOutputPermission = (
  userRole: UserRole,
): boolean =>
  userRole === 'Staff' ||
  (isEnabled('DRAFT_RESEARCH_OUTPUT') && userRole === 'Member');

export const hasPublishResearchOutputPermission = (
  userRole: UserRole,
): boolean => userRole === 'Staff';

export const hasEditResearchOutputPermission = (
  userRole: UserRole,
  published: boolean,
): boolean =>
  userRole === 'Staff' ||
  (isEnabled('DRAFT_RESEARCH_OUTPUT') && userRole === 'Member' && !published);
