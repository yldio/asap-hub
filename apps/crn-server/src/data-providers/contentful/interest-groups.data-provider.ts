import {
  FetchGroupOptions,
  GroupDataObject,
  GroupTools,
  GroupRole,
  GroupLeader,
  ListGroupDataObject,
} from '@asap-hub/model';
import {
  GraphQLClient,
  FETCH_INTEREST_GROUPS,
  FETCH_INTEREST_GROUP_BY_ID,
  FETCH_INTEREST_GROUPS_BY_USER_ID,
  FetchInterestGroupByIdQuery,
  FetchInterestGroupByIdQueryVariables,
  FetchInterestGroupsQuery,
  FetchInterestGroupsQueryVariables,
  FetchInterestGroupsByUserIdQuery,
  FetchInterestGroupsByUserIdQueryVariables,
  InterestGroupsOrder,
  InterestGroupsFilter,
  Teams,
} from '@asap-hub/contentful';

import { InterestGroupDataProvider } from '../types';
import {
  parseContentfulGraphqlCalendarToResponse,
  parseInterestGroupLeader,
} from '../transformers';
import { parseContentfulGraphQlUsers } from './users.data-provider';
import { parseContentfulGraphQlTeams } from './teams.data-provider';

type InterestGroupItem = NonNullable<
  NonNullable<
    FetchInterestGroupsQuery['interestGroupsCollection']
  >['items'][number]
>;

type InterestGroupLeader = NonNullable<
  NonNullable<
    FetchInterestGroupsByUserIdQuery['interestGroupLeadersCollection']
  >['items'][number]
>;

type InterestGroupsQueryResult =
  FetchInterestGroupsQuery['interestGroupsCollection'];

export class InterestGroupContentfulDataProvider
  implements InterestGroupDataProvider
{
  constructor(private contentfulClient: GraphQLClient) {}

  async fetchById(id: string): Promise<GroupDataObject | null> {
    const { interestGroups } = await this.contentfulClient.request<
      FetchInterestGroupByIdQuery,
      FetchInterestGroupByIdQueryVariables
    >(FETCH_INTEREST_GROUP_BY_ID, { id });

    if (!interestGroups) {
      return null;
    }

    return parseGraphQLInterestGroup(interestGroups);
  }

  private async fetchByUserId(
    userId: string,
    options: FetchGroupOptions,
  ): Promise<ListGroupDataObject> {
    const { take = 20, skip = 0 } = options;
    const { interestGroupLeadersCollection } =
      await this.contentfulClient.request<
        FetchInterestGroupsByUserIdQuery,
        FetchInterestGroupsByUserIdQueryVariables
      >(FETCH_INTEREST_GROUPS_BY_USER_ID, {
        limit: take,
        skip,
        id: userId,
      });

    const items: InterestGroupItem[] =
      interestGroupLeadersCollection?.items
        ?.filter((x): x is InterestGroupLeader => x !== null)
        .map(
          (item: InterestGroupLeader) =>
            item?.linkedFrom?.interestGroupsCollection?.items[0],
        )
        .filter((x): x is InterestGroupItem => !!x) || [];

    return this.parseCollection({ total: items?.length || 0, items });
  }

  private parseCollection(
    collection: InterestGroupsQueryResult,
  ): ListGroupDataObject {
    if (!collection || !collection.total) {
      return {
        total: 0,
        items: [],
      };
    }

    return {
      total: collection.total,
      items: collection.items
        .filter((x): x is InterestGroupItem => x !== null)
        .map(parseGraphQLInterestGroup),
    };
  }

  async fetch(options: FetchGroupOptions): Promise<ListGroupDataObject> {
    const { filter, search, take = 20, skip = 0 } = options;

    if (filter && filter.userId) {
      return this.fetchByUserId(filter.userId, options);
    }
    const where: InterestGroupsFilter = {};

    const words = (search || '').split(' ').filter(Boolean); // removes whitespaces

    if (words.length) {
      const filters: InterestGroupsFilter[] = words.reduce(
        (acc: InterestGroupsFilter[], word: string) =>
          acc.concat([
            {
              OR: [
                { name_contains: word },
                { description_contains: word },
                { tags_contains_all: [word] },
              ],
            },
          ]),
        [],
      );
      where.AND = filters;
    }

    if (filter && filter.active !== undefined) {
      where.AND = [...(where.AND || []), { active: filter.active }];
    }

    if (filter && filter.teamId) {
      where.AND = [
        ...(where.AND || []),
        { teams: { sys: { id_in: filter.teamId } } },
      ];
    }

    const { interestGroupsCollection } = await this.contentfulClient.request<
      FetchInterestGroupsQuery,
      FetchInterestGroupsQueryVariables
    >(FETCH_INTEREST_GROUPS, {
      limit: take,
      skip,
      where,
      order: [InterestGroupsOrder.NameAsc],
    });

    return this.parseCollection(interestGroupsCollection);
  }
}

const parseGraphQLInterestGroup = (
  group: InterestGroupItem,
): GroupDataObject => {
  const isString = (x: unknown): x is string => typeof x === 'string';

  const teams = (group.teamsCollection?.items || [])
    .filter((x): x is Teams => x !== null)
    .map((t) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { members, labCount, ...team } = parseContentfulGraphQlTeams(t);
      return team;
    });

  const calendars = group.calendar
    ? [parseContentfulGraphqlCalendarToResponse(group.calendar)]
    : [];

  let tools: GroupTools = {
    slack: group.slack ?? undefined,
    googleDrive: group.googleDrive ?? undefined,
  };

  if (group.calendar) {
    const url = new URL('https://calendar.google.com/calendar/r');
    url.searchParams.set('cid', group.calendar.sys.id || '');
    tools = { ...tools, googleCalendar: url.toString() };
  }

  const leaders: GroupLeader[] = (group.leadersCollection?.items || []).reduce(
    (acc: GroupLeader[], leader) => {
      if (!leader || !leader.user) {
        return acc;
      }
      return [
        ...acc,
        {
          user: parseInterestGroupLeader(
            parseContentfulGraphQlUsers(leader.user),
          ),
          role: leader.role as GroupRole,
          inactiveSinceDate: leader.inactiveSinceDate ?? undefined,
        },
      ];
    },
    [],
  );

  const contactEmails = leaders
    .filter(
      ({ role, inactiveSinceDate, user: { alumniSinceDate } }) =>
        role === 'Project Manager' && !alumniSinceDate && !inactiveSinceDate,
    )
    .map(({ user }) => user.email);

  return {
    id: group.sys.id,
    active: !!group.active,
    createdDate: group.sys.firstPublishedAt,
    lastModifiedDate: group.sys.publishedAt,
    name: group.name || '',
    description: group.description || '',
    tags: (group.tags || []).filter(isString),
    tools,
    thumbnail: group.thumbnail?.url ?? undefined,
    contactEmails,
    leaders,
    teams,
    calendars,
  };
};
