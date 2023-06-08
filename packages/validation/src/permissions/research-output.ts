import { User } from '@asap-hub/auth';
import { UserRole, UserResponse } from '@asap-hub/model';
import { isEnabled } from '@asap-hub/flags';

type user = Omit<User, 'algoliaApiKey'> | UserResponse;
type association = 'teams' | 'workingGroups';

export const isUserProjectManager = (
  user: user | null,
  association: association,
  associationIds: string[],
): boolean => {
  if (user === null) {
    return false;
  }
  return user[association].some(
    (teamOrWorkingGroup) =>
      associationIds?.includes(teamOrWorkingGroup.id) &&
      teamOrWorkingGroup.role === 'Project Manager',
  );
};

export const isUserMember = (
  user: user | null,
  association: association,
  associationIds: string[],
): boolean => {
  if (user === null) {
    return false;
  }
  return user[association].some(
    (teamOrWorkingGroup) =>
      associationIds?.includes(teamOrWorkingGroup.id) &&
      teamOrWorkingGroup.role !== 'Project Manager',
  );
};

export const getUserRole = (
  user: user | null,
  association: association,
  associationIds: string[],
): UserRole => {
  if (user === null) {
    return 'None';
  }

  if (user.role === 'Staff') {
    return 'Staff';
  }

  if (isUserProjectManager(user, association, associationIds)) {
    return 'Staff';
  }

  if (isUserMember(user, association, associationIds)) {
    return 'Member';
  }

  return 'None';
};

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
