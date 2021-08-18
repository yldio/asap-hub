import Boom from '@hapi/boom';
import {
  RestTeam,
  RestUser,
  GraphqlTeam,
  GraphqlUser,
} from '@asap-hub/squidex';
import {
  ListTeamResponse,
  TeamResponse,
  TeamMember,
  TeamTool,
} from '@asap-hub/model';
import { User } from '@asap-hub/auth';

import {
  InstrumentedSquidex,
  InstrumentedSquidexGraphql,
} from '../utils/instrumented-client';
import { getGraphQLQueryResearchOutput } from './research-outputs';
import { parseGraphQLTeam, parseGraphQLUser } from '../entities';
import { sanitiseForSquidex } from '../utils/squidex';
import { GraphqlFetchOptions } from '../utils/types';
import { GraphQLQueryUser } from './users';

export const getGraphQLQueryTeam = ({
  withResearchOutputs = true,
  researchOutputsWithTeams = true,
}: {
  withResearchOutputs?: boolean;
  researchOutputsWithTeams?: boolean;
}): string => `
id
created
lastModified
flatData {
  applicationNumber
  displayName
  ${
    withResearchOutputs
      ? `outputs {
    ${getGraphQLQueryResearchOutput({ withTeams: researchOutputsWithTeams })}
  }`
      : ''
  }
  projectSummary
  projectTitle
  skills
  proposal {
    id
  }
  tools{
    description
    name
    url
  }
}
referencingUsersContents {
    ${GraphQLQueryUser}
}`;

export const buildGraphQLQueryFetchTeams = (): string => `
  query FetchTeams($top: Int, $skip: Int, $filter: String) {
    queryTeamsContentsWithTotal(top: $top, skip: $skip, filter: $filter, orderby: "data/displayName/iv") {
      total
      items {
        ${getGraphQLQueryTeam({
          researchOutputsWithTeams: true,
        })}
      }
    }
  }
`;

export const buildGraphQLQueryFetchTeam = (): string => `
  query FetchTeam($id: String!) {
    findTeamsContent(id: $id) {
      ${getGraphQLQueryTeam({
        researchOutputsWithTeams: false,
      })}
      
    }
  }
`;

export interface ResponseFetchTeams {
  queryTeamsContentsWithTotal: {
    total: number;
    items: GraphqlTeam[];
  };
}

export interface ResponseFetchTeam {
  findTeamsContent: GraphqlTeam;
}

const transformGraphQLTeam = (
  team: GraphqlTeam,
  members: TeamMember[],
  user?: User,
): TeamResponse => ({
  ...parseGraphQLTeam(team, members),
  tools: user?.teams.find(({ id }) => id === team.id)
    ? team.flatData?.tools?.map(({ name, description, url }) => ({
        name,
        url,
        description: description ?? undefined,
      })) || []
    : undefined,
});

const transformGraphQLUser = (members: GraphqlUser[], team: GraphqlTeam) =>
  members.map(parseGraphQLUser).map((user) => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    displayName: user.displayName,
    email: user.email,
    avatarUrl: user.avatarUrl,
    labs: user.labs,
    role: user.teams.filter((t) => t.id === team.id)[0].role,
  }));

export interface TeamController {
  update: (id: string, tools: TeamTool[], user: User) => Promise<TeamResponse>;
  fetch: (
    options: {
      take: number;
      skip: number;
      search?: string;
      filter?: string | string[];
    },
    user: User,
  ) => Promise<ListTeamResponse>;
  fetchById: (teamId: string, user: User) => Promise<TeamResponse>;
}

export default class Teams implements TeamController {
  teams: InstrumentedSquidex<RestTeam>;

  users: InstrumentedSquidex<RestUser>;

  client: InstrumentedSquidexGraphql;

  constructor(ctxHeaders?: Record<string, string>) {
    this.client = new InstrumentedSquidexGraphql(ctxHeaders);
    this.users = new InstrumentedSquidex('users', ctxHeaders);
    this.teams = new InstrumentedSquidex('teams', ctxHeaders);
  }

  async update(
    id: string,
    tools: TeamTool[],
    user: User,
  ): Promise<TeamResponse> {
    const cleanUpdate = tools.map((tool) =>
      Object.entries(tool).reduce(
        (acc, [key, value]) =>
          value?.trim && value?.trim() === ''
            ? acc // deleted field
            : { ...acc, [key]: value },
        {} as TeamTool,
      ),
    );

    await this.teams.patch(id, { tools: { iv: cleanUpdate } });
    return this.fetchById(id, user);
  }

  async fetch(
    options: {
      take: number;
      skip: number;
      search?: string;
      filter?: string | string[];
    },
    user: User,
  ): Promise<ListTeamResponse> {
    const { take = 8, skip = 0, search } = options;

    const searchQ = (search || '')
      .split(' ')
      .filter(Boolean) // removes whitespaces
      .map(sanitiseForSquidex)
      .reduce(
        (acc: string[], word: string) =>
          acc.concat(
            `(${[
              [`contains(data/displayName/iv, '${word}')`],
              [`contains(data/projectTitle/iv, '${word}')`],
              [`contains(data/skills/iv, '${word}')`],
            ].join(' or ')})`,
          ),
        [],
      )
      .join(' and ');

    const query = buildGraphQLQueryFetchTeams();

    const { queryTeamsContentsWithTotal } = await this.client.request<
      ResponseFetchTeams,
      GraphqlFetchOptions
    >(query, {
      filter: searchQ,
      top: take,
      skip,
    });

    const { total, items: teams } = queryTeamsContentsWithTotal;

    const teamItems = teams.map((team) =>
      transformGraphQLTeam(
        team,
        transformGraphQLUser(team?.referencingUsersContents || [], team),
        user,
      ),
    );

    return {
      total,
      items: teamItems,
    };
  }

  async fetchById(teamId: string, user: User): Promise<TeamResponse> {
    const query = buildGraphQLQueryFetchTeam();
    const teamResponse = await this.client.request<
      ResponseFetchTeam,
      { id: string }
    >(query, { id: teamId });

    const { findTeamsContent: team } = teamResponse;

    if (!team) {
      throw Boom.notFound();
    }

    return transformGraphQLTeam(
      team,
      transformGraphQLUser(
        teamResponse?.findTeamsContent?.referencingUsersContents || [],
        team,
      ),
      user,
    );
  }
}
