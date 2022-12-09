import { Role, TeamRole } from '@asap-hub/model';

export const isCMSAdministrator = (userRole: Role, teamRole: TeamRole) => {
  return userRole === 'Staff' || teamRole === 'ASAP Staff';
};
