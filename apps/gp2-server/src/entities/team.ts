/* istanbul ignore file */
// ignore this file for coverage since we don't have the requirements yet to test it
import { teamRole, TeamRole } from '@asap-hub/model';

export const isTeamRole = (data: string | null): data is TeamRole =>
  teamRole.includes(data as TeamRole);
