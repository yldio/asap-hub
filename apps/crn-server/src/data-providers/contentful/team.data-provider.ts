import {
  FetchOptions,
  LabResponse,
  ListTeamDataObject,
  TeamCreateDataObject,
  TeamDataObject,
  TeamTool,
  TeamUpdateDataObject,
  TeamMember,
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

import { isTeamRole, priorities } from '../transformers';

import { TeamDataProvider } from '../team.data-provider';

export type TeamItem = NonNullable<
  NonNullable<FetchTeamsQuery['teamsCollection']>['items'][number]
>;

export type Membership = NonNullable<
  NonNullable<
    NonNullable<TeamItem['linkedFrom']>['teamMembershipCollection']
  >['items'][number]
>;

type TeamFilter = {
  active?: boolean;
};

export type FetchTeamsOptions = FetchOptions<TeamFilter>;
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
            {
              expertiseAndResourceTags_contains_some: searchTerms,
            },
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
        .map(parseContentfulGraphQlTeams),
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

    return parseContentfulGraphQlTeams(teams);
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

export const teamUnreadyResponse = {
  pointOfContact: undefined,
  proposalURL: undefined,
};

export const parseContentfulGraphQlTeams = (item: TeamItem): TeamDataObject => {
  const expertiseAndResourceTags = (item.expertiseAndResourceTags || []).reduce(
    (tags: string[], tag) => {
      if (tag) {
        tags.push(tag);
      }
      return tags;
    },
    [],
  );
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
    (userList: TeamMember[], membership: Membership | null): TeamMember[] => {
      if (!membership) {
        return userList;
      }

      const { role, inactiveSinceDate } = membership;
      const {
        sys,
        firstName,
        lastName,
        email,
        avatar,
        labsCollection,
        alumniSinceDate,
      } = membership.linkedFrom?.usersCollection?.items[0] || {};
      const id = sys?.id;

      if (!id) {
        return userList;
      }

      if (!role || !isTeamRole(role)) {
        return userList;
      }

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
          role: role ?? '',
          inactiveSinceDate: inactiveSinceDate ?? undefined,
          alumniSinceDate,
          avatarUrl: avatar?.url ?? undefined,
          displayName: `${firstName} ${lastName}`,
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
    expertiseAndResourceTags,
    tools,
    projectSummary: item.projectSummary ?? undefined,
    members: members.sort((a, b) => priorities[a.role] - priorities[b.role]),
    labCount,

    // TODO implement below when users (CRN-1164),
    // labs (CRN-1263) and RO (CRN-1253) are ready
    ...teamUnreadyResponse,
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
