import {
  FetchAnalyticsTeamLeadershipQuery,
  FetchAnalyticsTeamLeadershipQueryVariables,
  FETCH_ANALYTICS_TEAM_LEADERSHIP,
  GraphQLClient,
} from '@asap-hub/contentful';
import { ListAnalyticsTeamLeadershipDataObject } from '@asap-hub/model';
import { AnalyticsDataProvider } from '../types/analytics.data-provider.types';

export class AnalyticsContentfulDataProvider implements AnalyticsDataProvider {
  constructor(private contentfulClient: GraphQLClient) {}

  async fetchTeamLeaderShip(): Promise<ListAnalyticsTeamLeadershipDataObject> {
    const { teamsCollection } = await this.contentfulClient.request<
      FetchAnalyticsTeamLeadershipQuery,
      FetchAnalyticsTeamLeadershipQueryVariables
    >(FETCH_ANALYTICS_TEAM_LEADERSHIP);

    return {
      total: teamsCollection?.total || 0,
      items:
        teamsCollection?.items
          .filter((team): team is Team => team !== null)
          .map((team) => ({
            id: team.sys.id,
            displayName: team.displayName || '',
            interestGroupLeadershipRoleCount: getUniqueIdCount(
              team.linkedFrom?.teamMembershipCollection?.items.flatMap(
                (item) =>
                  item?.linkedFrom?.usersCollection?.items
                    .filter(filterOutAlumni)
                    .flatMap(flattenInterestGroupLeaders),
              ),
            ),
            interestGroupMemberCount:
              (!team.inactiveSince &&
                team.linkedFrom?.interestGroupsCollection?.total) ||
              0,
            interestGroupPreviousLeadershipRoleCount: getUniqueIdCount(
              team.linkedFrom?.teamMembershipCollection?.items.flatMap(
                (item) =>
                  item?.linkedFrom?.usersCollection?.items
                    .filter(filterAlumni)
                    .flatMap(flattenInterestGroupLeaders),
              ),
            ),
            interestGroupPreviousMemberCount:
              (team.inactiveSince &&
                team.linkedFrom?.interestGroupsCollection?.total) ||
              0,
            workingGroupLeadershipRoleCount: getUniqueIdCount(
              team.linkedFrom?.teamMembershipCollection?.items.flatMap(
                (item) =>
                  item?.linkedFrom?.usersCollection?.items
                    .filter(filterOutAlumni)
                    .flatMap(flattenWorkingGroupLeaders),
              ),
            ),
            workingGroupMemberCount: getUniqueIdCount(
              team.linkedFrom?.teamMembershipCollection?.items.flatMap(
                (item) =>
                  item?.linkedFrom?.usersCollection?.items
                    .filter(filterOutAlumni)
                    .flatMap(flattenWorkingGroupMember),
              ),
            ),
            workingGroupPreviousLeadershipRoleCount: getUniqueIdCount(
              team.linkedFrom?.teamMembershipCollection?.items.flatMap(
                (item) =>
                  item?.linkedFrom?.usersCollection?.items
                    .filter(filterAlumni)
                    .flatMap(flattenWorkingGroupLeaders),
              ),
            ),
            workingGroupPreviousMemberCount: getUniqueIdCount(
              team.linkedFrom?.teamMembershipCollection?.items.flatMap(
                (item) =>
                  item?.linkedFrom?.usersCollection?.items
                    .filter(filterAlumni)
                    .flatMap(flattenWorkingGroupMember),
              ),
            ),
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
const flattenInterestGroupLeaders = (user: User): (string | undefined)[] =>
  user?.linkedFrom?.interestGroupLeadersCollection?.items.flatMap(
    (interestGroupLeader) =>
      interestGroupLeader?.linkedFrom?.interestGroupsCollection?.items.map(
        (item) => item?.sys.id,
      ),
  ) || [];
const flattenWorkingGroupMember = (user: User): (string | undefined)[] =>
  user?.linkedFrom?.workingGroupMembersCollection?.items.flatMap(
    (workingGroupMember) =>
      workingGroupMember?.linkedFrom?.workingGroupsCollection?.items.map(
        (item) => item?.sys.id,
      ),
  ) || [];
const getUniqueIdCount = (arr: (string | undefined)[] | undefined): number =>
  [...new Set(arr)].length;
