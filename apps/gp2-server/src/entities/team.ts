import { teamRole, TeamRole } from '@asap-hub/model';

export const isTeamRole = (data: string | null): data is TeamRole =>
  teamRole.includes(data as TeamRole);
