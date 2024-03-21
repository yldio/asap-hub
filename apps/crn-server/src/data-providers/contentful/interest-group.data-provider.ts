import {
  FetchInterestGroupOptions,
  InterestGroupDataObject,
  InterestGroupTools,
  InterestGroupRole,
  InterestGroupLeader as GroupLeader,
  ListInterestGroupDataObject,
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
import { parseContentfulGraphQlUsers } from './user.data-provider';
import { parseContentfulGraphQlTeamListItem } from './team.data-provider';
import { parseResearchTags } from './research-tag.data-provider';

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

  async fetchById(id: string): Promise<InterestGroupDataObject | null> {
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
    options: FetchInterestGroupOptions,
  ): Promise<ListInterestGroupDataObject> {
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
  ): ListInterestGroupDataObject {
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

  async fetch(
    options: FetchInterestGroupOptions,
  ): Promise<ListInterestGroupDataObject> {
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
                {
                  researchTags: {
                    name_contains: word,
                  },
                },
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
  interestGroup: InterestGroupItem,
): InterestGroupDataObject => {
  const teams = (interestGroup.teamsCollection?.items || [])
    .filter((x): x is Teams => x !== null)
    .map((t) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { memberCount, labCount, ...team } =
        parseContentfulGraphQlTeamListItem(t);
      return team;
    });

  const calendars = interestGroup.calendar
    ? [parseContentfulGraphqlCalendarToResponse(interestGroup.calendar)]
    : [];

  let tools: InterestGroupTools = {
    slack: interestGroup.slack ?? undefined,
    googleDrive: interestGroup.googleDrive ?? undefined,
  };

  if (interestGroup.calendar) {
    const url = new URL('https://calendar.google.com/calendar/r');
    url.searchParams.set('cid', interestGroup.calendar.sys.id || '');
    tools = { ...tools, googleCalendar: url.toString() };
  }

  const leaders: GroupLeader[] = (
    interestGroup.leadersCollection?.items || []
  ).reduce((acc: GroupLeader[], leader) => {
    if (!leader || !leader.user) {
      return acc;
    }
    return [
      ...acc,
      {
        user: parseInterestGroupLeader(
          parseContentfulGraphQlUsers(leader.user),
        ),
        role: leader.role as InterestGroupRole,
        inactiveSinceDate: leader.inactiveSinceDate ?? undefined,
      },
    ];
  }, []);

  const contactEmails = leaders
    .filter(
      ({ role, inactiveSinceDate, user: { alumniSinceDate } }) =>
        role === 'Project Manager' && !alumniSinceDate && !inactiveSinceDate,
    )
    .map(({ user }) => user.email);

  return {
    id: interestGroup.sys.id,
    active: !!interestGroup.active,
    createdDate: interestGroup.sys.firstPublishedAt,
    lastModifiedDate: interestGroup.lastUpdated,
    name: interestGroup.name || '',
    description: interestGroup.description || '',
    tags: parseResearchTags(interestGroup.researchTagsCollection?.items || []),
    tools,
    thumbnail: interestGroup.thumbnail?.url ?? undefined,
    contactEmails,
    leaders,
    teams,
    calendars,
  };
};
