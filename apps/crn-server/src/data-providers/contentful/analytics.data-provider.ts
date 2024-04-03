import {
  FetchAnalyticsTeamLeadershipQuery,
  FetchAnalyticsTeamLeadershipQueryVariables,
  FETCH_ANALYTICS_TEAM_LEADERSHIP,
  GraphQLClient,
  InterestGroups,
  Sys,
} from '@asap-hub/contentful';
import {
  FetchPaginationOptions,
  ListAnalyticsTeamLeadershipDataObject,
} from '@asap-hub/model';
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

    return {
      total: teamsCollection?.total || 0,
      items:
        teamsCollection?.items
          .filter((team): team is Team => team !== null)
          .map((team) => ({
            id: team.sys.id,
            displayName: team.displayName || '',
            interestGroupLeadershipRoleCount: team.inactiveSince
              ? 0
              : getUniqueIdCount(
                  team.linkedFrom?.teamMembershipCollection?.items.flatMap(
                    (teamMembershipItem) =>
                      teamMembershipItem?.linkedFrom?.usersCollection?.items
                        .flatMap(flattenInterestGroupLeaders)
                        .filter(
                          (item) =>
                            item.interestGroupActive &&
                            item.userIsAlumni === false,
                        )
                        .map((item) => item.interestGroupId),
                  ) || [],
                ),
            interestGroupMemberCount: team.inactiveSince
              ? 0
              : getUniqueIdCount([
                  ...(team.linkedFrom?.teamMembershipCollection?.items.flatMap(
                    (teamMembershipItem) =>
                      teamMembershipItem?.linkedFrom?.usersCollection?.items
                        .flatMap(flattenInterestGroupLeaders)
                        .filter(
                          (item) =>
                            item.interestGroupActive &&
                            item.userIsAlumni === false,
                        )
                        .map((item) => item.interestGroupId),
                  ) || []),
                  ...(team.linkedFrom?.interestGroupsCollection?.items
                    .filter((interestGroup) => !!interestGroup?.active)
                    .flatMap((interestGroup) => interestGroup?.sys.id) || []),
                ]),
            interestGroupPreviousLeadershipRoleCount: getUniqueIdCount([
              ...(team.linkedFrom?.teamMembershipCollection?.items.flatMap(
                (teamMembershipItem) =>
                  teamMembershipItem?.linkedFrom?.usersCollection?.items
                    .flatMap(flattenInterestGroupLeaders)
                    .filter(
                      (item) => !item.interestGroupActive || item.userIsAlumni,
                    )
                    .map((item) => item.interestGroupId),
              ) || []),
              ...((team.inactiveSince &&
                team.linkedFrom?.teamMembershipCollection?.items.flatMap(
                  (teamMembershipItem) =>
                    teamMembershipItem?.linkedFrom?.usersCollection?.items
                      .flatMap(flattenInterestGroupLeaders)
                      .filter(
                        (item) =>
                          item.interestGroupActive &&
                          item.userIsAlumni === false,
                      )
                      .map((item) => item.interestGroupId),
                )) ||
                []),
            ]),
            interestGroupPreviousMemberCount: getUniqueIdCount([
              ...(team.linkedFrom?.teamMembershipCollection?.items.flatMap(
                (teamMembershipItem) =>
                  teamMembershipItem?.linkedFrom?.usersCollection?.items
                    .flatMap(flattenInterestGroupLeaders)
                    .filter(
                      (item) =>
                        team.inactiveSince ||
                        item.userIsAlumni ||
                        !item.interestGroupActive,
                    )
                    .map((item) => item.interestGroupId),
              ) || []),
              ...(team.linkedFrom?.interestGroupsCollection?.items
                .filter(
                  (interestGroup) =>
                    team.inactiveSince || !interestGroup?.active,
                )
                .flatMap((interestGroup) => interestGroup?.sys.id) || []),
            ]),
            workingGroupLeadershipRoleCount: team.inactiveSince
              ? 0
              : getUniqueIdCount(
                  team.linkedFrom?.teamMembershipCollection?.items.flatMap(
                    (teamMembershipItem) =>
                      teamMembershipItem?.linkedFrom?.usersCollection?.items
                        .filter(filterOutAlumni)
                        .flatMap(flattenWorkingGroupLeaders),
                  ) || [],
                ),
            workingGroupMemberCount: team.inactiveSince
              ? 0
              : getUniqueIdCount(
                  team.linkedFrom?.teamMembershipCollection?.items.flatMap(
                    (teamMembershipItem) =>
                      teamMembershipItem?.linkedFrom?.usersCollection?.items
                        .filter(filterOutAlumni)
                        .flatMap(flattenWorkingGroupMember),
                  ) || [],
                ),
            workingGroupPreviousLeadershipRoleCount: getUniqueIdCount([
              ...((team.inactiveSince &&
                team.linkedFrom?.teamMembershipCollection?.items.flatMap(
                  (teamMembershipItem) =>
                    teamMembershipItem?.linkedFrom?.usersCollection?.items
                      .filter(filterOutAlumni)
                      .flatMap(flattenWorkingGroupLeaders),
                )) ||
                []),
              ...(team.linkedFrom?.teamMembershipCollection?.items.flatMap(
                (teamMembershipItem) =>
                  teamMembershipItem?.linkedFrom?.usersCollection?.items
                    .filter(filterAlumni)
                    .flatMap(flattenWorkingGroupLeaders),
              ) || []),
            ]),
            workingGroupPreviousMemberCount: getUniqueIdCount([
              ...((team.inactiveSince &&
                team.linkedFrom?.teamMembershipCollection?.items.flatMap(
                  (teamMembershipItem) =>
                    teamMembershipItem?.linkedFrom?.usersCollection?.items
                      .filter(filterOutAlumni)
                      .flatMap(flattenWorkingGroupMember),
                )) ||
                []),
              ...(team.linkedFrom?.teamMembershipCollection?.items.flatMap(
                (teamMembershipItem) =>
                  teamMembershipItem?.linkedFrom?.usersCollection?.items
                    .filter(filterAlumni)
                    .flatMap(flattenWorkingGroupMember),
              ) || []),
            ]),
          })) || [],
    };
  }
}

type Team = NonNullable<
  NonNullable<
    FetchAnalyticsTeamLeadershipQuery['teamsCollection']
  >['items'][number]
>;
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

// removes alumnis, assumes any date in the future also make them an alumni
const filterOutAlumni = (user: User) => user?.alumniSinceDate === null;
const filterAlumni = (user: User) => user?.alumniSinceDate !== null;

const flattenWorkingGroupLeaders = (user: User): (string | undefined)[] =>
  user?.linkedFrom?.workingGroupLeadersCollection?.items.flatMap(
    (workingGroupLeader) =>
      workingGroupLeader?.linkedFrom?.workingGroupsCollection?.items.map(
        (item) => item?.sys.id,
      ),
  ) || [];
const flattenInterestGroupLeaders = (
  user: User,
): Array<{
  interestGroupId: string;
  userIsAlumni: boolean;
  interestGroupActive: boolean;
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
          userIsAlumni: user.alumniSinceDate !== null,
          interestGroupActive: !!item.active,
        })) || [],
  ) || [];
const flattenWorkingGroupMember = (user: User): (string | undefined)[] =>
  user?.linkedFrom?.workingGroupMembersCollection?.items.flatMap(
    (workingGroupMember) =>
      workingGroupMember?.linkedFrom?.workingGroupsCollection?.items.map(
        (item) => item?.sys.id,
      ),
  ) || [];
const getUniqueIdCount = (arr: (string | undefined)[]): number =>
  [...new Set(arr.filter((elem) => !!elem))].length;
