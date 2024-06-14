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
) =>
  cleanArray(teamsCollection?.items).map((team) => {
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
    const currentWorkingGroupIdsFromTeamMembers =
      getCurrentWorkingGroupIdsFromTeamMembers(team);
    const previousWorkingGroupIdsFromTeamLeaders =
      getPreviousWorkingGroupIdsFromTeamLeaders(team);
    const previousWorkingGroupIdsFromTeamMembers =
      getPreviousWorkingGroupIdsFromTeamMembers(team);

    return {
      id: team.sys.id,
      displayName: team.displayName || '',
      _tags: team.displayName ? [team.displayName] : [],
      interestGroupLeadershipRoleCount: team.inactiveSince
        ? 0
        : getUniqueIdCount(currentInterestGroupIdsFromTeamLeaders),
      interestGroupPreviousLeadershipRoleCount: getUniqueIdCount([
        ...removeDuplicates(
          previousInterestGroupIdsFromTeamLeaders,
          currentInterestGroupIdsFromTeamLeaders,
        ),
        ...((team.inactiveSince && currentInterestGroupIdsFromTeamLeaders) ||
          []),
      ]),
      interestGroupMemberCount: team.inactiveSince
        ? 0
        : getUniqueIdCount([
            ...currentInterestGroupIdsFromTeamLeaders,
            ...currentInterestGroupIdsFromInterestGroupCollection,
          ]),
      interestGroupPreviousMemberCount: getUniqueIdCount([
        ...previousInterestGroupIdsFromTeamLeaders,
        ...previousInterestGroupIdsFromInterestGroupCollection,
      ]),
      workingGroupLeadershipRoleCount: team.inactiveSince
        ? 0
        : getUniqueIdCount(currentWorkingGroupIdsFromTeamLeaders),
      workingGroupPreviousLeadershipRoleCount: getUniqueIdCount([
        ...((team.inactiveSince && currentWorkingGroupIdsFromTeamLeaders) ||
          []),
        ...removeDuplicates(
          previousWorkingGroupIdsFromTeamLeaders,
          currentWorkingGroupIdsFromTeamLeaders,
        ),
      ]),
      workingGroupMemberCount: team.inactiveSince
        ? 0
        : getUniqueIdCount([
            ...currentWorkingGroupIdsFromTeamLeaders,
            ...currentWorkingGroupIdsFromTeamMembers,
          ]),

      workingGroupPreviousMemberCount: getUniqueIdCount([
        ...((team.inactiveSince && currentWorkingGroupIdsFromTeamMembers) ||
          []),
        ...removeDuplicates(
          [
            ...previousWorkingGroupIdsFromTeamMembers,
            ...previousWorkingGroupIdsFromTeamLeaders,
          ],
          currentWorkingGroupIdsFromTeamMembers,
        ),
      ]),
    };
  });

export const getCurrentInterestGroupIdsFromTeamLeaders = (
  team: Team,
): string[] =>
  team.linkedFrom?.teamMembershipCollection?.items.flatMap(
    (teamMembershipItem) =>
      teamMembershipItem?.linkedFrom?.usersCollection?.items
        .flatMap(flattenInterestGroupLeaders)
        .filter(
          (item) =>
            item.interestGroupActive &&
            item.userIsAlumni === false &&
            item.interestGroupLeadershipIsActive &&
            teamMembershipItem.inactiveSinceDate === null &&
            item.role !== 'Project Manager',
        )
        .map((item) => item.interestGroupId) || [],
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
          (item) =>
            item.role !== 'Project Manager' &&
            (team.inactiveSince ||
              item.userIsAlumni ||
              !item.interestGroupActive ||
              !item.interestGroupLeadershipIsActive ||
              teamMembershipItem.inactiveSinceDate !== null),
        )
        .map((item) => item.interestGroupId) || [],
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
        .filter(
          (item) =>
            !item.userIsAlumni &&
            !item.workingGroupComplete &&
            item.workingGroupMembershipIsActive &&
            teamMembershipItem.inactiveSinceDate === null,
        )
        .map((item) => item.workingGroupId) || [],
  ) || [];

export const getCurrentWorkingGroupIdsFromTeamLeaders = (
  team: Team,
): string[] =>
  team.linkedFrom?.teamMembershipCollection?.items.flatMap(
    (teamMembershipItem) =>
      teamMembershipItem?.linkedFrom?.usersCollection?.items
        .flatMap(flattenWorkingGroupLeaders)
        .filter(
          (item) =>
            !item.userIsAlumni &&
            !item.workingGroupComplete &&
            item.workingGroupLeadershipIsActive &&
            teamMembershipItem.inactiveSinceDate === null &&
            item.role !== 'Project Manager',
        )
        .map((item) => item.workingGroupId) || [],
  ) || [];

export const getPreviousWorkingGroupIdsFromTeamLeaders = (
  team: Team,
): string[] =>
  team.linkedFrom?.teamMembershipCollection?.items.flatMap(
    (teamMembershipItem) =>
      teamMembershipItem?.linkedFrom?.usersCollection?.items
        .flatMap(flattenWorkingGroupLeaders)
        .filter(
          (item) =>
            item.role !== 'Project Manager' &&
            (item.userIsAlumni ||
              item.workingGroupComplete ||
              !item.workingGroupLeadershipIsActive ||
              teamMembershipItem.inactiveSinceDate !== null),
        )
        .map((item) => item.workingGroupId) || [],
  ) || [];

export const getPreviousWorkingGroupIdsFromTeamMembers = (
  team: Team,
): string[] =>
  team.linkedFrom?.teamMembershipCollection?.items.flatMap(
    (teamMembershipItem) =>
      teamMembershipItem?.linkedFrom?.usersCollection?.items
        .flatMap(flattenWorkingGroupMember)
        .filter(
          (item) =>
            item.userIsAlumni ||
            item.workingGroupComplete ||
            !item.workingGroupMembershipIsActive ||
            teamMembershipItem.inactiveSinceDate !== null,
        )
        .map((item) => item.workingGroupId) || [],
  ) || [];

export type Team = NonNullable<
  NonNullable<
    FetchAnalyticsTeamLeadershipQuery['teamsCollection']
  >['items'][number]
>;

type InterestGroup = Pick<InterestGroups, 'active'> & {
  sys: Pick<Sys, 'id'>;
};
type User = NonNullable<
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

const flattenWorkingGroupLeaders = (
  user: User,
): Array<{
  workingGroupId: string;
  userIsAlumni: boolean;
  workingGroupComplete: boolean;
  workingGroupLeadershipIsActive: boolean;
  role: string | null;
}> =>
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
          workingGroupId: item.sys.id,
          userIsAlumni: !!user.alumniSinceDate,
          workingGroupComplete: !!item.complete,
          workingGroupLeadershipIsActive: !workingGroupLeader.inactiveSinceDate,
          role: workingGroupLeader.role || null,
        })) || [],
  ) || [];

const flattenWorkingGroupMember = (
  user: User,
): Array<{
  workingGroupId: string;
  userIsAlumni: boolean;
  workingGroupComplete: boolean;
  workingGroupMembershipIsActive: boolean;
}> =>
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
          workingGroupId: item.sys.id,
          userIsAlumni: !!user.alumniSinceDate,
          workingGroupComplete: !!item.complete,
          workingGroupMembershipIsActive: !workingGroupMember.inactiveSinceDate,
        })) || [],
  ) || [];

const flattenInterestGroupLeaders = (
  user: User,
): Array<{
  interestGroupId: string;
  userIsAlumni: boolean;
  interestGroupActive: boolean;
  interestGroupLeadershipIsActive: boolean;
  role: string | null;
}> =>
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
          interestGroupId: item.sys.id,
          userIsAlumni: !!user.alumniSinceDate,
          interestGroupActive: !!item.active,
          interestGroupLeadershipIsActive:
            !interestGroupLeader.inactiveSinceDate,
          role: interestGroupLeader.role || null,
        })) || [],
  ) || [];
