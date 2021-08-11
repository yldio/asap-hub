import get from 'lodash.get';
import Boom from '@hapi/boom';
import { Got } from 'got';
import Intercept from 'apr-intercept';
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
import { createURL, sanitiseForSquidex } from '../utils/squidex';
import { GraphqlFetchOptions } from '../utils/types';
import { GraphQLQueryUser } from './users';

export const getGraphQLQueryTeam = ({
  withResearchOutputs = true,
  researchOutputsWithTeams = true,
  withUsersContents = false,
}: {
  withResearchOutputs?: boolean;
  researchOutputsWithTeams?: boolean;
  withUsersContents?: boolean;
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
${
  withUsersContents
    ? `referencingUsersContents {
      ${GraphQLQueryUser}
}`
    : ''
}`;

export const buildGraphQLQueryFetchTeams = (): string => `
  query FetchTeams($top: Int, $skip: Int, $filter: String) {
    queryTeamsContentsWithTotal(top: $top, skip: $skip, filter: $filter, orderby: "data/displayName/iv") {
      total
      items {
        ${getGraphQLQueryTeam({ researchOutputsWithTeams: true })}
      }
    }
  }
`;

export const buildGraphQLQueryFetchTeam = (): string => `
  query FetchTeam($id: String!) {
    findTeamsContent(id: $id) {
      ${getGraphQLQueryTeam({
        researchOutputsWithTeams: false,
        withUsersContents: true,
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

const transformRestTeamMember = (
  users: RestUser[],
  teamId: string,
): TeamMember[] =>
  users.map((user) => ({
    id: user.id,
    displayName: `${user.data.firstName.iv} ${user.data.lastName.iv}`,
    firstName: user.data.firstName.iv,
    lastName: user.data.lastName.iv,
    email: user.data.email.iv,
    role: get(user, 'data.teams.iv', []).find(
      (t: { id: string[] }) => t.id[0] === teamId,
    ).role,
    avatarUrl: user.data.avatar?.iv
      ? createURL(user.data.avatar.iv)[0]
      : undefined,
  }));

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

const fetchUsers = async (id: string, client: Got): Promise<RestUser[]> => {
  const [, res] = await Intercept(
    client
      .get('users', {
        searchParams: {
          $filter: `data/teams/iv/id eq '${id}' and data/onboarded/iv eq true`,
        },
      })
      .json() as Promise<{ total: number; items: RestUser[] }>,
  );

  return res ? res.items : [];
};

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

    const teamUsers = await Promise.all(
      teams.map((team) => fetchUsers(team.id, this.users.client)),
    );

    const teamItems = teams.map((team, index) =>
      transformGraphQLTeam(
        team,
        transformRestTeamMember(teamUsers[index], team.id),
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
    const teamPromise = this.client.request<ResponseFetchTeam, { id: string }>(
      query,
      { id: teamId },
    );

    const teamResponse = await teamPromise;

    const { findTeamsContent: team } = teamResponse;
    const members = transformGraphQLUser(
      teamResponse?.findTeamsContent?.referencingUsersContents || [],
      team,
    );
    if (!team) {
      throw Boom.notFound();
    }

    return transformGraphQLTeam(team, members, user);
  }
}
