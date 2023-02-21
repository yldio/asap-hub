import { User } from '@asap-hub/auth';
import {
  ResearchOutputPostRequest,
  ResearchOutputResponse,
  ResearchOutputWorkingGroupResponse,
  userPermissions,
  WorkingGroupDataObject,
} from '@asap-hub/model';
import { isResearchOutputWorkingGroup } from '../research-output-guards';

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

export const noPermissions: userPermissions = {
  createDraft: false,
  editDraft: false,
  publishDraft: false,
  editPublished: false,
};

export const isUserAsapStaff = (user: Omit<User, 'algoliaApiKey'>): boolean =>
  user.teams.some((team) => team.role === 'ASAP Staff');

export const isUserProjectManagerOfTeams = (
  user: Omit<User, 'algoliaApiKey'>,
  teams: ResearchOutputResponse['teams'],
): boolean =>
  !!user.teams.find(
    (team) =>
      teams.map((t) => t.id).includes(team.id) &&
      team.role === 'Project Manager',
  );

export const isUserProjectManagerOfWorkingGroups = (
  user: Omit<User, 'algoliaApiKey'>,
  workingGroups: ResearchOutputWorkingGroupResponse['workingGroups'],
): boolean =>
  !!user.workingGroups.find(
    (workingGroup) =>
      workingGroups.map((wg) => wg.id).includes(workingGroup.id) &&
      workingGroup.role === 'Project Manager',
  );

export const getUserPerrmisions = (
  user: Omit<User, 'algoliaApiKey'> | null,
  researchOutputData: ResearchOutputResponse | undefined,
): userPermissions => {
  if (user === null || researchOutputData === undefined) {
    return noPermissions;
  }

  if (
    isUserAsapStaff(user) ||
    (isResearchOutputWorkingGroup(researchOutputData) &&
      isUserProjectManagerOfWorkingGroups(
        user,
        researchOutputData.workingGroups,
      )) ||
    (!isResearchOutputWorkingGroup(researchOutputData) &&
      isUserProjectManagerOfTeams(user, researchOutputData.teams))
  ) {
    return {
      createDraft: true,
      editDraft: true,
      publishDraft: true,
      editPublished: true,
    };
  }

  return noPermissions;
};
