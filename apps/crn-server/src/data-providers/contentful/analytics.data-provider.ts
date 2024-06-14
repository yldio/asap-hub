import {
  FetchAnalyticsTeamLeadershipQuery,
  FetchAnalyticsTeamLeadershipQueryVariables,
  FetchTeamProductivityQuery,
  FetchTeamProductivityQueryVariables,
  FetchUserCollaborationQuery,
  FetchUserCollaborationQueryVariables,
  FetchUserProductivityQuery,
  FetchUserProductivityQueryVariables,
  FETCH_ANALYTICS_TEAM_LEADERSHIP,
  FETCH_TEAM_PRODUCTIVITY,
  FETCH_TEAM_COLLABORATION,
  FETCH_USER_COLLABORATION,
  FETCH_USER_PRODUCTIVITY,
  GraphQLClient,
  InterestGroups,
  Sys,
  WorkingGroups,
  FetchTeamCollaborationQuery,
  FetchTeamCollaborationQueryVariables,
} from '@asap-hub/contentful';
import {
  FetchAnalyticsOptions,
  FetchPaginationOptions,
  ListAnalyticsTeamLeadershipDataObject,
  ListTeamCollaborationDataObject,
  ListTeamProductivityDataObject,
  ListUserProductivityDataObject,
  TeamProductivityDataObject,
  TeamRole,
  TimeRangeOption,
  UserProductivityDataObject,
  UserProductivityTeam,
} from '@asap-hub/model';
import { cleanArray, parseUserDisplayName } from '@asap-hub/server-common';
import {
  getUserCollaborationItems,
  getTeamCollaborationItems,
  isTeamOutputDocumentType,
} from '../../utils/analytics/collaboration';
import { getFilterOutputByRange } from '../../utils/analytics/common';
import { AnalyticsDataProvider } from '../types/analytics.data-provider.types';

export class AnalyticsContentfulDataProvider implements AnalyticsDataProvider {
  constructor(private contentfulClient: GraphQLClient) {}

  async fetchTeamLeadership(
    options: FetchPaginationOptions,
  ): Promise<ListAnalyticsTeamLeadershipDataObject> {
    const { take = 10, skip = 0 } = options;
    const { teamsCollection } = await this.contentfulClient.request<
      FetchAnalyticsTeamLeadershipQuery,
      FetchAnalyticsTeamLeadershipQueryVariables
    >(FETCH_ANALYTICS_TEAM_LEADERSHIP, { limit: take, skip });

    const getCurrentInterestGroupIdsFromTeamLeaders = (team: Team): string[] =>
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

    const getCurrentInterestGroupIdsFromInterestGroupCollection = (
      team: Team,
    ): string[] =>
      team.linkedFrom?.interestGroupsCollection?.items
        .filter(
          (interestGroup): interestGroup is InterestGroup =>
            (interestGroup && !!interestGroup.active) || false,
        )
        .flatMap((interestGroup) => interestGroup.sys.id) || [];

    const getPreviousInterestGroupIdsFromTeamLeaders = (team: Team): string[] =>
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

    const getPreviousInterestGroupIdsFromInterestGroupCollection = (
      team: Team,
    ): string[] =>
      team.linkedFrom?.interestGroupsCollection?.items
        .filter(
          (interestGroup): interestGroup is InterestGroup =>
            !!(interestGroup && (team.inactiveSince || !interestGroup?.active)),
        )
        .flatMap((interestGroup) => interestGroup.sys.id) || [];

    const getCurrentWorkingGroupIdsFromTeamMembers = (team: Team): string[] =>
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

    const getCurrentWorkingGroupIdsFromTeamLeaders = (team: Team): string[] =>
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

    const getPreviousWorkingGroupIdsFromTeamLeaders = (team: Team): string[] =>
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

    const getPreviousWorkingGroupIdsFromTeamMembers = (team: Team): string[] =>
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

    return {
      total: teamsCollection?.total || 0,
      items:
        teamsCollection?.items
          .filter((team): team is Team => team !== null)
          .map((team) => {
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
                ...((team.inactiveSince &&
                  currentInterestGroupIdsFromTeamLeaders) ||
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
                ...((team.inactiveSince &&
                  currentWorkingGroupIdsFromTeamLeaders) ||
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
                ...((team.inactiveSince &&
                  currentWorkingGroupIdsFromTeamMembers) ||
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
          }) || [],
    };
  }

  async fetchUserProductivity(
    options: FetchAnalyticsOptions,
  ): Promise<ListUserProductivityDataObject> {
    const { take = 10, skip = 0, filter: rangeKey } = options;

    const { usersCollection } = await this.contentfulClient.request<
      FetchUserProductivityQuery,
      FetchUserProductivityQueryVariables
    >(FETCH_USER_PRODUCTIVITY, { limit: take, skip });

    return {
      total: usersCollection?.total || 0,
      items: getUserProductivityItems(usersCollection, rangeKey),
    };
  }

  async fetchTeamProductivity(
    options: FetchAnalyticsOptions,
  ): Promise<ListTeamProductivityDataObject> {
    const { take = 10, skip = 0, filter: rangeKey } = options;
    const { teamsCollection } = await this.contentfulClient.request<
      FetchTeamProductivityQuery,
      FetchTeamProductivityQueryVariables
    >(FETCH_TEAM_PRODUCTIVITY, { limit: take, skip });

    return {
      total: teamsCollection?.total || 0,
      items: getTeamProductivityItems(teamsCollection, rangeKey),
    };
  }
  async fetchUserCollaboration(options: FetchAnalyticsOptions) {
    const { take = 10, skip = 0, filter: rangeKey } = options;
    let collection: FetchUserCollaborationQuery['usersCollection'] = {
      total: 0,
      items: [],
    };

    for (let i = 0; i < take / 5; i += 1) {
      const { usersCollection } = await this.contentfulClient.request<
        FetchUserCollaborationQuery,
        FetchUserCollaborationQueryVariables
      >(FETCH_USER_COLLABORATION, { limit: 5, skip: skip + 5 * i });
      if (usersCollection && usersCollection.items) {
        collection = {
          total: usersCollection.total,
          items: [...collection.items, ...usersCollection.items],
        };
      }
    }

    return {
      total: collection?.total || 0,
      items: getUserCollaborationItems(collection, rangeKey),
    };
  }

  async fetchTeamCollaboration(
    options: FetchAnalyticsOptions,
  ): Promise<ListTeamCollaborationDataObject> {
    const { take = 10, skip = 0, filter: rangeKey } = options;

    let collection: FetchTeamCollaborationQuery['teamsCollection'] = {
      total: 0,
      items: [],
    };

    for (let i = 0; i < take / 5; i += 1) {
      const { teamsCollection } = await this.contentfulClient.request<
        FetchTeamCollaborationQuery,
        FetchTeamCollaborationQueryVariables
      >(FETCH_TEAM_COLLABORATION, { limit: 5, skip: skip + 5 * i });
      if (teamsCollection && teamsCollection.items.length) {
        collection = {
          total: teamsCollection.total,
          items: [...collection.items, ...teamsCollection.items],
        };
      } else {
        break;
      }
    }

    return {
      total: collection.total,
      items: getTeamCollaborationItems(collection, rangeKey),
    };
  }
}

type Team = NonNullable<
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

const getUniqueIdCount = (arr: (string | undefined)[]): number =>
  [...new Set(arr.filter((elem) => !!elem))].length;

const getUserProductivityItems = (
  usersCollection: FetchUserProductivityQuery['usersCollection'],
  rangeKey?: TimeRangeOption,
): UserProductivityDataObject[] =>
  cleanArray(usersCollection?.items).map((user) => {
    const teams =
      user.teamsCollection?.items
        .map((teamItem) => {
          if (teamItem?.role && teamItem?.team?.displayName) {
            return {
              team: teamItem.team.displayName,
              id: teamItem.team.sys.id,
              role: teamItem.role as TeamRole,
              isTeamInactive: !!teamItem.team.inactiveSince,
              isUserInactiveOnTeam: !!teamItem.inactiveSinceDate,
            };
          }

          return null;
        })
        .filter(
          (
            userProductivityItem: UserProductivityTeam | null,
          ): userProductivityItem is UserProductivityTeam =>
            userProductivityItem !== null,
        ) || [];

    const userOutputsCount = user.linkedFrom?.researchOutputsCollection?.items
      .filter(getFilterOutputByRange(rangeKey))
      .reduce(
        (outputsCount, outputItem) => {
          const isAuthor = outputItem?.authorsCollection?.items.some(
            (author) =>
              author?.__typename === 'Users' && author.sys.id === user.sys.id,
          );

          if (isAuthor) {
            if (outputItem?.sharingStatus === 'Public') {
              return {
                outputs: outputsCount.outputs + 1,
                publicOutputs: outputsCount.publicOutputs + 1,
              };
            }

            return {
              ...outputsCount,
              outputs: outputsCount.outputs + 1,
            };
          }

          return outputsCount;
        },
        {
          outputs: 0,
          publicOutputs: 0,
        },
      ) || {
      outputs: 0,
      publicOutputs: 0,
    };

    return {
      id: user.sys.id,
      name: parseUserDisplayName(
        user.firstName ?? '',
        user.lastName ?? '',
        undefined,
        user.nickname ?? '',
      ),
      isAlumni: !!user.alumniSinceDate,
      teams,
      asapOutput: userOutputsCount.outputs,
      asapPublicOutput: userOutputsCount.publicOutputs,
      ratio:
        userOutputsCount.outputs > 0
          ? (userOutputsCount.publicOutputs / userOutputsCount.outputs).toFixed(
              2,
            )
          : '0.00',
    };
  });

const getTeamProductivityItems = (
  teamsCollection: FetchTeamProductivityQuery['teamsCollection'],
  rangeKey?: TimeRangeOption,
): TeamProductivityDataObject[] =>
  cleanArray(teamsCollection?.items).map((teamItem) => {
    const initialDocumentTypesCount = {
      Article: 0,
      Bioinformatics: 0,
      Dataset: 0,
      'Lab Resource': 0,
      Protocol: 0,
    };

    const documentTypesCount =
      teamItem.linkedFrom?.researchOutputsCollection?.items
        .filter(getFilterOutputByRange(rangeKey))
        .reduce((count, researchOutput) => {
          if (
            researchOutput?.documentType &&
            isTeamOutputDocumentType(researchOutput.documentType)
          ) {
            return {
              ...count,
              [researchOutput.documentType]:
                count[researchOutput.documentType] + 1,
            };
          }
          return count;
        }, initialDocumentTypesCount) || initialDocumentTypesCount;

    return {
      id: teamItem.sys.id,
      name: teamItem.displayName || '',
      isInactive: !!teamItem.inactiveSince,
      Article: documentTypesCount.Article,
      Bioinformatics: documentTypesCount.Bioinformatics,
      Dataset: documentTypesCount.Dataset,
      'Lab Resource': documentTypesCount['Lab Resource'],
      Protocol: documentTypesCount.Protocol,
    };
  });
// remove string from one array that are present in another array and return a new array of strings
const removeDuplicates = (arr1: string[], arr2: string[]): string[] => [
  ...arr1.filter((elem) => !arr2.includes(elem)),
];
