import { User } from '@asap-hub/auth';
import { UserPermissions, UserResponse } from '@asap-hub/model';

export const noPermissions: UserPermissions = {
  saveDraft: false,
  publish: false,
};

export const partialPermissions: UserPermissions = {
  saveDraft: true,
  publish: false,
};

export const fullPermissions: UserPermissions = {
  saveDraft: true,
  publish: true,
};

export const getUserPermissions = (
  user: Omit<User, 'algoliaApiKey'> | UserResponse | null,
  entity: 'teams' | 'workingGroups',
  entityIds: string[],
): UserPermissions => {
  if (user === null) {
    return noPermissions;
  }

  if (user.role === 'Staff') {
    return fullPermissions;
  }

  const isUserProjectManager = user[entity].some(
    (teamOrWorkingGroup) =>
      entityIds?.includes(teamOrWorkingGroup.id) &&
      teamOrWorkingGroup.role === 'Project Manager',
  );

  if (isUserProjectManager) {
    return fullPermissions;
  }

  const isUserMember = user[entity].some((teamOrWorkingGroup) =>
    entityIds.includes(teamOrWorkingGroup.id),
  );

  if (isUserMember) {
    return partialPermissions;
  }

  return noPermissions;
};
