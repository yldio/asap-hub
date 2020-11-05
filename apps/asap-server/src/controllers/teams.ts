import get from 'lodash.get';
import { Got } from 'got';
import Intercept from 'apr-intercept';
import { Squidex, RestTeam, RestUser } from '@asap-hub/squidex';
import {
  ListTeamResponse,
  TeamResponse,
  TeamMember,
  TeamRole,
  TeamTool,
} from '@asap-hub/model';
import { User } from '@asap-hub/auth';

import { createURL } from '../utils/squidex';

const priorities: Record<TeamRole, number> = {
  'Lead PI': 1,
  'Project Manager': 2,
  'Co-Investigator': 3,
  Collaborator: 4,
  'Key Personnel': 5,
  Advisor: 6,
  Guest: 7,
  Staff: 8,
};

function transformTeam(
  team: RestTeam,
  members: TeamMember[] = [],
  user?: User,
): TeamResponse {
  return {
    id: team.id,
    displayName: team.data.displayName.iv,
    applicationNumber: team.data.applicationNumber.iv,
    projectTitle: team.data.projectTitle.iv,
    projectSummary: team.data.projectSummary?.iv,
    skills: team.data.skills?.iv || [],
    lastModifiedDate: team.lastModified,
    pointOfContact: members.find(({ role }) => role === 'Project Manager'),
    proposalURL: team.data.proposal?.iv[0],
    members: members.sort((a, b) => priorities[a.role] - priorities[b.role]),
    tools: user?.teams.find(({ id }) => id === team.id)
      ? team.data.tools?.iv
      : undefined,
  };
}

const transformUser = (users: RestUser[], teamId: string): TeamMember[] =>
  users.map((user) => ({
    id: user.id,
    firstName: user.data.firstName?.iv,
    lastName: user.data.lastName?.iv,
    email: user.data.email.iv,
    displayName: user.data.displayName.iv,
    role: get(user, 'data.teams.iv', []).find(
      (t: { id: string[] }) => t.id[0] === teamId,
    ).role,
    avatarUrl: user.data.avatar && createURL(user.data.avatar.iv)[0],
  }));

const fetchUsers = async (id: string, client: Got): Promise<RestUser[]> => {
  const [, res] = await Intercept(
    client
      .get('users', {
        searchParams: {
          $filter: `data/teams/iv/id eq '${id}'`,
        },
      })
      .json() as Promise<{ total: number; items: RestUser[] }>,
  );

  return res ? res.items : [];
};

export default class Teams {
  teams: Squidex<RestTeam>;

  users: Squidex<RestUser>;

  constructor() {
    this.teams = new Squidex('teams');
    this.users = new Squidex('users');
  }

  async update(
    id: string,
    tools: TeamTool[] | [],
    user: User,
  ): Promise<TeamResponse> {
    const team = await this.teams.patch(id, { tools: { iv: tools } });
    return transformTeam(team, [], user);
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
    const { take, skip, search } = options;

    const searchQ = (search || '')
      .split(' ')
      .filter(Boolean) // removes whitespaces
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

    const query = {
      $orderby: 'data/displayName/iv',
      ...(search ? { $filter: searchQ } : {}),
      ...(take ? { $top: take } : {}),
      ...(skip ? { $skip: skip } : {}),
    };

    const { total, items: teams } = await this.teams.fetch(query);

    const teamUsers = await Promise.all(
      teams.map((team) => fetchUsers(team.id, this.users.client)),
    );

    const teamItems = teams.map((team, index) =>
      transformTeam(team, transformUser(teamUsers[index], team.id), user),
    );

    return {
      total,
      items: teamItems,
    };
  }

  async fetchById(teamId: string, user: User): Promise<TeamResponse> {
    const team = await this.teams.fetchById(teamId);
    const users = await fetchUsers(team.id, this.users.client);
    return transformTeam(team, transformUser(users, team.id), user);
  }
}
