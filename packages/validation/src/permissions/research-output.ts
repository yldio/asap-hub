import { User } from '@asap-hub/auth';
import { UserPermissionsLevel, UserResponse } from '@asap-hub/model';

export const getUserPermissionLevel = (
  user: Omit<User, 'algoliaApiKey'> | UserResponse | null,
  entity: 'teams' | 'workingGroups',
  entityIds: string[],
): UserPermissionsLevel => {
  if (user === null) {
    return 'None';
  }

  if (user.role === 'Staff') {
    return 'Admin';
  }

  const isUserProjectManager = user[entity].some(
    (teamOrWorkingGroup) =>
      entityIds?.includes(teamOrWorkingGroup.id) &&
      teamOrWorkingGroup.role === 'Project Manager',
  );

  if (isUserProjectManager) {
    return 'Admin';
  }

  const isUserMember = user[entity].some((teamOrWorkingGroup) =>
    entityIds.includes(teamOrWorkingGroup.id),
  );

  if (isUserMember) {
    return 'Member';
  }

  return 'None';
};

export const hasCreateUpdateResearchOutputPermissions = (
  userPermissionLevel: UserPermissionsLevel,
  publish: boolean,
): boolean => {
  if (userPermissionLevel === 'Admin') {
    return true;
  }

  if (userPermissionLevel === 'Member') {
    return !publish;
  }

  return false;
};
