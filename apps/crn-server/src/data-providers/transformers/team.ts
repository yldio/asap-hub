import { TeamMember, TeamRole, teamRole } from '@asap-hub/model';

export const priorities: Record<TeamRole, number> = {
  'Lead PI (Core Leadership)': 1,
  'Project Manager': 2,
  'Co-PI (Core Leadership)': 3,
  'Collaborating PI': 4,
  'Key Personnel': 5,
  'ASAP Staff': 6,
  'Scientific Advisory Board': 7,
  Trainee: 8,
};
export const sortMembers = (a: TeamMember, b: TeamMember) => {
  if (priorities[a.role] === priorities[b.role]) {
    // sort ascending on lastName
    return a.lastName < b.lastName ? -1 : 1;
  }
  return priorities[a.role] - priorities[b.role];
};

export const isTeamRole = (data: string | null): data is TeamRole =>
  teamRole.includes(data as TeamRole);
