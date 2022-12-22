import { Role, TeamRole } from '@asap-hub/model';

export const isCMSAdministrator = (userRole: Role, teamRole?: TeamRole) =>
  userRole === 'Staff' || teamRole === 'ASAP Staff';
