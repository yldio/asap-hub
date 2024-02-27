import {
  LabResponse,
  TeamCreateDataObject,
  TeamDataObject,
  TeamTool,
  TeamUpdateDataObject,
  TeamMember,
  TeamListItemDataObject,
  ListTeamDataObject,
  TeamRole,
} from '@asap-hub/model';

import {
  patchAndPublish,
  GraphQLClient,
  FETCH_TEAMS,
  FETCH_TEAM_BY_ID,
  FetchTeamByIdQuery,
  FetchTeamByIdQueryVariables,
  FetchTeamsQuery,
  FetchTeamsQueryVariables,
  TeamsOrder,
  Environment,
  addLocaleToFields,
} from '@asap-hub/contentful';
import { parseUserDisplayName } from '@asap-hub/server-common';

import { sortMembers } from '../transformers';
import {
  FetchTeamsOptions,
  TeamDataProvider,
} from '../types/teams.data-provider.types';
import { parseResearchTags } from './research-tag.data-provider';

export type TeamByIdItem = NonNullable<
  NonNullable<FetchTeamByIdQuery['teams']>
>;

export type MembershipTeamById = NonNullable<
  NonNullable<
    NonNullable<
      NonNullable<FetchTeamByIdQuery['teams']>['linkedFrom']
    >['teamMembershipCollection']
  >['items'][number]
>;

export type TeamItem = NonNullable<
  NonNullable<FetchTeamsQuery['teamsCollection']>['items'][number]
>;

export type Membership = NonNullable<
  NonNullable<
    NonNullable<TeamItem['linkedFrom']>['teamMembershipCollection']
  >['items'][number]
>;

export class TeamContentfulDataProvider implements TeamDataProvider {
  constructor(
    private contentfulClient: GraphQLClient,
    private getRestClient: () => Promise<Environment>,
  ) {}

  async fetch(options: FetchTeamsOptions): Promise<ListTeamDataObject> {
    const { take = 8, skip = 0, search, filter } = options;

    const searchTerms = (search || '').split(' ').filter(Boolean);
    const searchQuery = searchTerms.length
      ? {
          OR: [
            ...searchTerms.map((term) => ({
              displayName_contains: term,
            })),
            ...searchTerms.map((term) => ({
              projectTitle_contains: term,
            })),
            ...searchTerms.map((term) => ({
              researchTags: { name_contains: term },
            })),
          ],
        }
      : {};

    const activeQuery =
      typeof filter?.active === 'boolean'
        ? { inactiveSince_exists: !filter?.active }
        : {};

    const { teamsCollection } = await this.contentfulClient.request<
      FetchTeamsQuery,
      FetchTeamsQueryVariables
    >(FETCH_TEAMS, {
      limit: take,
      skip,
      order: [TeamsOrder.DisplayNameAsc],
      where: {
        ...searchQuery,
        ...activeQuery,
      },
    });

    if (!teamsCollection?.items) {
      return {
        total: 0,
        items: [],
      };
    }

    return {
      total: teamsCollection?.total,
      items: teamsCollection?.items
        .filter((x): x is TeamItem => x !== null)
        .map(parseContentfulGraphQlTeamListItem),
    };
  }

  async fetchById(id: string): Promise<TeamDataObject | null> {
    const { teams } = await this.contentfulClient.request<
      FetchTeamByIdQuery,
      FetchTeamByIdQueryVariables
    >(FETCH_TEAM_BY_ID, { id });

    if (!teams) {
      return null;
    }

    return parseContentfulGraphQlTeam(teams);
  }

  async update(id: string, update: TeamUpdateDataObject): Promise<void> {
    const environment = await this.getRestClient();

    const cleanTools = getCleanTools(update.tools);

    const publishedTools = await createAndPublishTools(environment, cleanTools);

    const team = await environment.getEntry(id);

    const previousToolsLinks = team.fields.tools
      ? team.fields.tools['en-US']
      : [];

    const newToolsLinks = publishedTools.map((tool) => ({
      sys: {
        type: 'Link',
        linkType: 'Entry',
        id: tool.sys.id,
      },
    }));

    await patchAndPublish(team, {
      tools: [...previousToolsLinks, ...newToolsLinks],
    });
  }

  async create(input: TeamCreateDataObject): Promise<string> {
    const environment = await this.getRestClient();

    const { tools, ...plainInput } = input;
    let toolsInput = {};

    if (tools) {
      const cleanTools = getCleanTools(tools);
      const publishedTools = await createAndPublishTools(
        environment,
        cleanTools,
      );
      toolsInput = {
        tools: {
          'en-US': publishedTools.map((tool) => ({
            sys: {
              type: 'Link',
              linkType: 'Entry',
              id: tool.sys.id,
            },
          })),
        },
      };
    }

    const newEntry = await environment.createEntry('teams', {
      fields: {
        ...addLocaleToFields(plainInput),
        ...toolsInput,
      },
    });

    return newEntry.sys.id;
  }
}

export const parseContentfulGraphQlTeamListItem = (
  item: TeamItem,
): TeamListItemDataObject => {
  const [numberOfMembers, labIds]: [number, Set<string>] = (
    item.linkedFrom?.teamMembershipCollection?.items || []
  ).reduce(
    ([memberCount, labIdsSet], membership: Membership | null) => {
      if (
        !membership ||
        !membership.linkedFrom?.usersCollection?.items[0]?.onboarded ||
        !membership.role
      ) {
        return [memberCount, labIdsSet];
      }

      const { labsCollection } =
        membership.linkedFrom?.usersCollection?.items[0] || {};

      const memberLabIds = labsCollection?.items
        .map((labItem) => labItem?.sys.id)
        .filter((x): x is string => x !== undefined);

      memberLabIds?.forEach((labId) => labIdsSet.add(labId));

      return [memberCount + 1, labIdsSet];
    },
    [0, new Set() as Set<string>],
  );

  return {
    id: item.sys.id ?? '',
    displayName: item.displayName ?? '',
    inactiveSince: item.inactiveSince ?? undefined,
    projectTitle: item.projectTitle ?? '',
    tags: parseResearchTags(item.researchTagsCollection?.items || []),
    memberCount: numberOfMembers,
    labCount: labIds.size,
  };
};

export const parseContentfulGraphQlTeam = (
  item: TeamByIdItem,
): TeamDataObject => {
  const tools = (item.toolsCollection?.items || []).reduce(
    (teamTools: TeamTool[], tool) => {
      if (!tool || !tool.name || !tool.url) {
        return teamTools;
      }

      const { name, url, description } = tool;

      return [
        ...teamTools,
        {
          name,
          url,
          description: description ?? undefined,
        },
      ];
    },
    [],
  );

  const members: TeamMember[] = (
    item.linkedFrom?.teamMembershipCollection?.items || []
  ).reduce(
    (
      userList: TeamMember[],
      membership: MembershipTeamById | null,
    ): TeamMember[] => {
      if (
        !membership ||
        !membership.linkedFrom?.usersCollection?.items[0]?.onboarded ||
        !membership.role
      ) {
        return userList;
      }

      const { role, inactiveSinceDate } = membership;
      const {
        sys: { id },
        firstName,
        nickname,
        lastName,
        email,
        avatar,
        labsCollection,
        alumniSinceDate,
      } = membership.linkedFrom?.usersCollection?.items[0] || {};

      const labs: LabResponse[] = (labsCollection?.items || []).reduce(
        (userLabs: LabResponse[], lab): LabResponse[] => {
          if (!lab) {
            return userLabs;
          }

          return [
            ...userLabs,
            {
              id: lab.sys.id,
              name: lab.name || '',
            },
          ];
        },
        [],
      );

      return [
        ...userList,
        {
          id,
          firstName: firstName ?? '',
          lastName: lastName ?? '',
          email: email ?? '',
          role: (role as TeamRole) ?? '',
          inactiveSinceDate: inactiveSinceDate ?? undefined,
          alumniSinceDate,
          avatarUrl: avatar?.url ?? undefined,
          displayName: parseUserDisplayName(
            firstName ?? '',
            lastName ?? '',
            undefined,
            nickname ?? '',
          ),
          labs,
        },
      ];
    },
    [],
  );

  const labCount = members
    .flatMap((member) => member.labs || [])
    .filter(
      (lab, index, labs) => labs.findIndex((l) => l.id === lab.id) === index,
    ).length;

  return {
    id: item.sys.id ?? '',
    displayName: item.displayName ?? '',
    inactiveSince: item.inactiveSince ?? undefined,
    projectTitle: item.projectTitle ?? '',
    lastModifiedDate: new Date(item.sys.publishedAt).toISOString(),
    tags: parseResearchTags(item.researchTagsCollection?.items || []),
    tools,
    projectSummary: item.projectSummary ?? undefined,
    members: members.sort(sortMembers),
    labCount,
    pointOfContact: members.find(
      ({ role, alumniSinceDate, inactiveSinceDate }) =>
        role === 'Project Manager' && !alumniSinceDate && !inactiveSinceDate,
    ),
    proposalURL: item.proposal ? item.proposal.sys.id : undefined,
  };
};

const getCleanTools = (tools: TeamTool[]) =>
  tools.map((tool) =>
    Object.entries(tool).reduce(
      (acc, [key, value]) =>
        value?.trim && value?.trim() === ''
          ? acc // deleted field
          : { ...acc, [key]: value },
      {} as TeamTool,
    ),
  );

const createAndPublishTools = (environment: Environment, tools: TeamTool[]) =>
  Promise.all(
    tools.map(async (tool) => {
      const entry = await environment.createEntry('externalTools', {
        fields: addLocaleToFields(tool),
      });
      return entry.publish();
    }),
  );
