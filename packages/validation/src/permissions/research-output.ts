import { User } from '@asap-hub/auth';
import { UserRole, UserResponse } from '@asap-hub/model';
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

  const isUserProjectManager = user[association].some(
    (teamOrWorkingGroup) =>
      associationIds?.includes(teamOrWorkingGroup.id) &&
      teamOrWorkingGroup.role === 'Project Manager',
  );

  if (isUserProjectManager) {
    return 'Staff';
  }

  const isUserMember = user[association].some((teamOrWorkingGroup) =>
    associationIds.includes(teamOrWorkingGroup.id),
  );

  if (isUserMember) {
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
