import {
  FetchAnalyticsTeamLeadershipQuery,
  InterestGroups,
  Sys,
  WorkingGroups,
} from '@asap-hub/contentful';
import { cleanArray } from '@asap-hub/server-common';
import { getUniqueIdCount, removeDuplicates } from './common';

export const getTeamLeadershipItems = (
  teamsCollection: FetchAnalyticsTeamLeadershipQuery['teamsCollection'],
) => cleanArray(teamsCollection?.items).map(getTeamLeadershipItem);

export const getTeamLeadershipItem = (team: Team) => {
  const currentInterestGroupIdsFromTeamLeaders =
    getCurrentInterestGroupIdsFromTeamLeaders(team);
  const previousInterestGroupIdsFromTeamLeaders =
    getPreviousInterestGroupIdsFromTeamLeaders(team);
  const currentInterestGroupIdsFromInterestGroupCollection =
    getCurrentInterestGroupIdsFromInterestGroupCollection(team);
  const previousInterestGroupIdsFromInterestGroupCollection =
    getPreviousInterestGroupIdsFromInterestGroupCollection(team);

  const currentWorkingGroupIdsFromTeamLeaders =
    getCurrentWorkingGroupIdsFromTeamLeaders(team);
  const currentWorkingGroupIdsFromProjectManagers =
    getCurrentWorkingGroupIdsFromProjectManagers(team);

  const currentWorkingGroupIdsFromTeamMembers =
    getCurrentWorkingGroupIdsFromTeamMembers(team);
  const previousWorkingGroupIdsFromTeamLeaders =
    getPreviousWorkingGroupIdsFromTeamLeaders(team);
  const previousWorkingGroupIdsFromProjectManagers =
    getPreviousWorkingGroupIdsFromProjectManagers(team);

  const previousWorkingGroupIdsFromTeamMembers =
    getPreviousWorkingGroupIdsFromTeamMembers(team);

  return {
    id: team.sys.id,
    displayName: team.displayName || '',
    inactiveSince: team.inactiveSince,
    _tags: team.displayName ? [team.displayName] : [],
    interestGroupLeadershipRoleCount: team.inactiveSince
      ? 0
      : getUniqueIdCount(currentInterestGroupIdsFromTeamLeaders),
    interestGroupPreviousLeadershipRoleCount: getUniqueIdCount([
      ...removeDuplicates(
        previousInterestGroupIdsFromTeamLeaders,
        currentInterestGroupIdsFromTeamLeaders,
      ),
      ...((team.inactiveSince && currentInterestGroupIdsFromTeamLeaders) || []),
    ]),
    interestGroupMemberCount: team.inactiveSince
      ? 0
      : getUniqueIdCount(currentInterestGroupIdsFromInterestGroupCollection),
    interestGroupPreviousMemberCount: getUniqueIdCount(
      previousInterestGroupIdsFromInterestGroupCollection,
    ),
    workingGroupLeadershipRoleCount: team.inactiveSince
      ? 0
      : getUniqueIdCount(currentWorkingGroupIdsFromTeamLeaders),
    workingGroupPreviousLeadershipRoleCount: getUniqueIdCount([
      ...((team.inactiveSince && currentWorkingGroupIdsFromTeamLeaders) || []),
      ...removeDuplicates(
        previousWorkingGroupIdsFromTeamLeaders,
        currentWorkingGroupIdsFromTeamLeaders,
      ),
    ]),
    workingGroupMemberCount: team.inactiveSince
      ? 0
      : getUniqueIdCount([
          ...currentWorkingGroupIdsFromTeamLeaders,
          ...currentWorkingGroupIdsFromProjectManagers,
          ...currentWorkingGroupIdsFromTeamMembers,
        ]),

    workingGroupPreviousMemberCount: getUniqueIdCount([
      ...((team.inactiveSince && currentWorkingGroupIdsFromTeamMembers) || []),
      ...removeDuplicates(
        [
          ...previousWorkingGroupIdsFromTeamMembers,
          ...previousWorkingGroupIdsFromProjectManagers,
          ...previousWorkingGroupIdsFromTeamLeaders,
        ],
        [
          ...currentWorkingGroupIdsFromTeamMembers,
          ...currentWorkingGroupIdsFromProjectManagers,
        ],
      ),
    ]),
  };
};

export const getCurrentInterestGroupIdsFromTeamLeaders = (
  team: Team,
): string[] =>
  team.linkedFrom?.teamMembershipCollection?.items.flatMap(
    (teamMembershipItem) =>
      teamMembershipItem?.linkedFrom?.usersCollection?.items
        .flatMap(flattenInterestGroupLeaders)
        .filter((item) => isCurrent(item, teamMembershipItem))
        .filter((item) => item.role !== 'Project Manager')
        .map((item) => item.groupId) || [],
  ) || [];

export const getCurrentInterestGroupIdsFromInterestGroupCollection = (
  team: Team,
): string[] =>
  team.linkedFrom?.interestGroupsCollection?.items
    .filter(
      (interestGroup): interestGroup is InterestGroup =>
        (interestGroup && !!interestGroup.active) || false,
    )
    .flatMap((interestGroup) => interestGroup.sys.id) || [];

export const getPreviousInterestGroupIdsFromTeamLeaders = (
  team: Team,
): string[] =>
  team.linkedFrom?.teamMembershipCollection?.items.flatMap(
    (teamMembershipItem) =>
      teamMembershipItem?.linkedFrom?.usersCollection?.items
        .flatMap(flattenInterestGroupLeaders)
        .filter(
          (item) => !isCurrent(item, teamMembershipItem) || team.inactiveSince,
        )
        .filter((item) => item.role !== 'Project Manager')
        .map((item) => item.groupId) || [],
  ) || [];

export const getPreviousInterestGroupIdsFromInterestGroupCollection = (
  team: Team,
): string[] =>
  team.linkedFrom?.interestGroupsCollection?.items
    .filter(
      (interestGroup): interestGroup is InterestGroup =>
        !!(interestGroup && (team.inactiveSince || !interestGroup?.active)),
    )
    .flatMap((interestGroup) => interestGroup.sys.id) || [];

export const getCurrentWorkingGroupIdsFromTeamMembers = (
  team: Team,
): string[] =>
  team.linkedFrom?.teamMembershipCollection?.items.flatMap(
    (teamMembershipItem) =>
      teamMembershipItem?.linkedFrom?.usersCollection?.items
        .flatMap(flattenWorkingGroupMember)
        .filter((item) => isCurrent(item, teamMembershipItem))
        .map((item) => item.groupId) || [],
  ) || [];

export const getCurrentWorkingGroupIdsFromTeamLeaders = (
  team: Team,
): string[] =>
  team.linkedFrom?.teamMembershipCollection?.items.flatMap(
    (teamMembershipItem) =>
      teamMembershipItem?.linkedFrom?.usersCollection?.items
        .flatMap(flattenWorkingGroupLeaders)
        .filter((item) => isCurrent(item, teamMembershipItem))
        .filter((item) => item.role !== 'Project Manager')
        .map((item) => item.groupId) || [],
  ) || [];

export const getPreviousWorkingGroupIdsFromTeamLeaders = (
  team: Team,
): string[] =>
  team.linkedFrom?.teamMembershipCollection?.items.flatMap(
    (teamMembershipItem) =>
      teamMembershipItem?.linkedFrom?.usersCollection?.items
        .flatMap(flattenWorkingGroupLeaders)
        .filter((item) => !isCurrent(item, teamMembershipItem))
        .filter((item) => item.role !== 'Project Manager')
        .map((item) => item.groupId) || [],
  ) || [];

export const getCurrentWorkingGroupIdsFromProjectManagers = (
  team: Team,
): string[] =>
  team.linkedFrom?.teamMembershipCollection?.items.flatMap(
    (teamMembershipItem) =>
      teamMembershipItem?.linkedFrom?.usersCollection?.items
        .flatMap(flattenWorkingGroupLeaders)
        .filter((item) => isCurrent(item, teamMembershipItem))
        .filter((item) => item.role === 'Project Manager')
        .map((item) => item.groupId) || [],
  ) || [];

export const getPreviousWorkingGroupIdsFromProjectManagers = (
  team: Team,
): string[] =>
  team.linkedFrom?.teamMembershipCollection?.items.flatMap(
    (teamMembershipItem) =>
      teamMembershipItem?.linkedFrom?.usersCollection?.items
        .flatMap(flattenWorkingGroupLeaders)
        .filter((item) => !isCurrent(item, teamMembershipItem))
        .filter((item) => item.role === 'Project Manager')
        .map((item) => item.groupId) || [],
  ) || [];

export const getPreviousWorkingGroupIdsFromTeamMembers = (
  team: Team,
): string[] =>
  team.linkedFrom?.teamMembershipCollection?.items.flatMap(
    (teamMembershipItem) =>
      teamMembershipItem?.linkedFrom?.usersCollection?.items
        .flatMap(flattenWorkingGroupMember)
        .filter((item) => !isCurrent(item, teamMembershipItem))
        .map((item) => item.groupId) || [],
  ) || [];

export const isCurrent = (
  item: FlatMember,
  relationshipItem: { inactiveSinceDate?: string },
): boolean =>
  !item.userIsAlumni &&
  item.groupActive &&
  item.relationshipIsActive &&
  relationshipItem.inactiveSinceDate === null;

export const flattenWorkingGroupLeaders = (user: User): Array<FlatLeader> =>
  user?.linkedFrom?.workingGroupLeadersCollection?.items.flatMap(
    (workingGroupLeader) =>
      workingGroupLeader?.linkedFrom?.workingGroupsCollection?.items
        .filter(
          (
            item,
          ): item is Pick<WorkingGroups, 'complete'> & {
            sys: Pick<Sys, 'id'>;
          } => !!item,
        )
        .map((item) => ({
          groupId: item.sys.id,
          userIsAlumni: !!user.alumniSinceDate,
          groupActive: !item.complete,
          relationshipIsActive: !workingGroupLeader.inactiveSinceDate,
          role: workingGroupLeader.role || null,
        })) || [],
  ) || [];

const flattenWorkingGroupMember = (user: User): Array<FlatMember> =>
  user?.linkedFrom?.workingGroupMembersCollection?.items.flatMap(
    (workingGroupMember) =>
      workingGroupMember?.linkedFrom?.workingGroupsCollection?.items
        .filter(
          (
            item,
          ): item is Pick<WorkingGroups, 'complete'> & {
            sys: Pick<Sys, 'id'>;
          } => !!item,
        )
        .map((item) => ({
          groupId: item.sys.id,
          userIsAlumni: !!user.alumniSinceDate,
          groupActive: !item.complete,
          relationshipIsActive: !workingGroupMember.inactiveSinceDate,
        })) || [],
  ) || [];

const flattenInterestGroupLeaders = (user: User): Array<FlatLeader> =>
  user?.linkedFrom?.interestGroupLeadersCollection?.items.flatMap(
    (interestGroupLeader) =>
      interestGroupLeader?.linkedFrom?.interestGroupsCollection?.items
        .filter(
          (
            item,
          ): item is Pick<InterestGroups, 'active'> & {
            sys: Pick<Sys, 'id'>;
          } => !!item,
        )
        .map((item) => ({
          groupId: item.sys.id,
          userIsAlumni: !!user.alumniSinceDate,
          groupActive: !!item.active,
          relationshipIsActive: !interestGroupLeader.inactiveSinceDate,
          role: interestGroupLeader.role || null,
        })) || [],
  ) || [];

export type Team = NonNullable<
  NonNullable<
    FetchAnalyticsTeamLeadershipQuery['teamsCollection']
  >['items'][number]
>;

type InterestGroup = Pick<InterestGroups, 'active'> & {
  sys: Pick<Sys, 'id'>;
};
export type User = NonNullable<
  NonNullable<
    NonNullable<
      NonNullable<
        NonNullable<
          NonNullable<
            NonNullable<
              FetchAnalyticsTeamLeadershipQuery['teamsCollection']
            >['items'][number]
          >['linkedFrom']
        >['teamMembershipCollection']
      >['items'][number]
    >['linkedFrom']
  >['usersCollection']
>['items'][number];

type FlatMember = {
  groupId: string;
  userIsAlumni: boolean;
  groupActive: boolean;
  relationshipIsActive: boolean;
};

type FlatLeader = FlatMember & {
  role: string | null;
};
