import {
  FetchOptions,
  ListTeamDataObject,
  TeamCreateDataObject,
  TeamDataObject,
  TeamTool,
  TeamUpdateDataObject,
} from '@asap-hub/model';

import {
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

import { TeamDataProvider } from '../teams.data-provider';

export type TeamItem = NonNullable<
  NonNullable<FetchTeamsQuery['teamsCollection']>['items'][number]
>;

type TeamFilter = {
  active?: boolean;
};

export type FetchTeamsOptions = FetchOptions<TeamFilter>;

export class TeamContentfulDataProvider implements TeamDataProvider {
  constructor(
    private contentfulClient: GraphQLClient,
    private restClient: Environment,
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
    const cleanTools = update.tools.map((tool) =>
      Object.entries(tool).reduce(
        (acc, [key, value]) =>
          value?.trim && value?.trim() === ''
            ? acc // deleted field
            : { ...acc, [key]: value },
        {} as TeamTool,
      ),
    );
    const environment = this.restClient;

    const publishedTools = await Promise.all(
      cleanTools.map(async (tool) => {
        const entry = await environment.createEntry('externalTools', {
          fields: addLocaleToFields(tool),
        });
        return entry.publish();
      }),
    );

    const team = await environment.getEntry(id);
    await team.patch([
      {
        op: 'replace',
        path: '/fields/tools/en-US',
        value: publishedTools.map((tool) => ({
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: tool.sys.id,
          },
        })),
      },
    ]);
  }

  async create(input: TeamCreateDataObject): Promise<string> {
    const environment = this.restClient;
    const newEntry = await environment.createEntry('teams', {
      fields: addLocaleToFields(input),
    });

    return newEntry.sys.id;
  }
}

export const teamUnreadyResponse = {
  labCount: 0,
  members: [],
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

  return {
    id: item.sys.id ?? '',
    displayName: item.displayName ?? '',
    inactiveSince: item.inactiveSince ?? undefined,
    projectTitle: item.projectTitle ?? '',
    lastModifiedDate: new Date(item.sys.publishedAt).toISOString(),
    expertiseAndResourceTags,
    tools,
    projectSummary: item.projectSummary ?? undefined,

    // TODO implement below when users, labs and RO are ready
    ...teamUnreadyResponse,
  };
};
