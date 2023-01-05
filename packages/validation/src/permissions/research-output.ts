import { User } from '@asap-hub/auth';
import {
  ResearchOutputPostRequest,
  WorkingGroupDataObject,
} from '@asap-hub/model';

export const hasCreateUpdateResearchOutputPermissions = (
  user: Omit<User, 'algoliaApiKey'>,
  teams: ResearchOutputPostRequest['teams'],
): boolean =>
  !!user.teams.find((team) => {
    if (team.role === 'ASAP Staff') {
      return true;
    }

    return teams.includes(team.id) && team.role === 'Project Manager';
  });

export const hasWorkingGroupsCreateUpdateResearchOutputPermissions = (
  user: Omit<User, 'algoliaApiKey'>,
  workingGroup: WorkingGroupDataObject | undefined,
): boolean => {
  if (!workingGroup) return false;

  const { leaders } = workingGroup;

  return leaders.some((leader) => {
    if (leader.user.id === user.id && leader.role === 'Project Manager') {
      return true;
    }
    return false;
  });
};
