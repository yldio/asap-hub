import get from 'lodash.get';
import { Got } from 'got';
import Intercept from 'apr-intercept';
import { Squidex } from '@asap-hub/services-common';
import {
  ListTeamResponse,
  TeamResponse,
  TeamMember,
  TeamRole,
} from '@asap-hub/model';

import { CMSTeam } from '../entities/team';
import { CMSUser } from '../entities/user';
import { createURL } from '../utils/assets';

const priorities: Record<TeamRole, number> = {
  'Lead PI': 1,
  'Co-Investigator': 2,
  'Project Manager': 3,
  Collaborator: 4,
  'Key Personnel': 5,
};

function transformTeam(team: CMSTeam, members: TeamMember[]): TeamResponse {
  return {
    id: team.id,
    displayName: team.data.displayName.iv,
    applicationNumber: team.data.applicationNumber.iv,
    projectTitle: team.data.projectTitle.iv,
    projectSummary: team.data.projectSummary?.iv,
    skills: team.data.skills?.iv || [],
    lastModifiedDate: team.lastModified,
    pointOfContact: members.find(({ role }) => role === 'Project Manager')
      ?.email,
    members: members.sort((a, b) => priorities[a.role] - priorities[b.role]),
  };
}

const transformUser = (users: CMSUser[], teamId: string): TeamMember[] =>
  users.map((user) => ({
    id: user.id,
    firstName: user.data.firstName?.iv,
    lastName: user.data.lastName?.iv,
    email: user.data.email.iv,
    displayName: user.data.displayName.iv,
    role: get(user, 'data.teams.iv', []).find(
      (t: { id: string[] }) => t.id[0] === teamId,
    ).role,
    avatarURL: user.data.avatar && createURL(user.data.avatar.iv)[0],
  }));

const fetchUsers = async (id: string, client: Got): Promise<CMSUser[]> => {
  const [, res] = await Intercept(
    client
      .get('users', {
        searchParams: {
          $filter: `data/teams/iv/id eq '${id}'`,
        },
      })
      .json() as Promise<{ total: number; items: CMSUser[] }>,
  );

  return res ? res.items : [];
};

export default class Teams {
  teams: Squidex<CMSTeam>;

  users: Squidex<CMSUser>;

  constructor() {
    this.teams = new Squidex('teams');
    this.users = new Squidex('users');
  }

  async fetch(options: {
    take: number;
    skip: number;
    search: string;
  }): Promise<ListTeamResponse> {
    const { search, ...opts } = options;
    const { total, items: teams } = await this.teams.fetch({
      ...opts,
      ...(search
        ? {
            fullText: search,
            filter: {
              or: search.split(' ').flatMap((word) => [
                { path: 'data.displayName.iv', op: 'contains', value: word },
                { path: 'data.projectTitle.iv', op: 'contains', value: word },
              ]),
            },
          }
        : {}),
      sort: [{ path: 'data.displayName.iv' }],
    });

    const teamUsers = await Promise.all(
      teams.map((team) => fetchUsers(team.id, this.users.client)),
    );

    const teamItems = teams.map((team, index) =>
      transformTeam(team, transformUser(teamUsers[index], team.id)),
    );

    return {
      total,
      items: teamItems,
    };
  }

  async fetchById(teamId: string): Promise<TeamResponse> {
    const team = await this.teams.fetchById(teamId);
    const users = await fetchUsers(team.id, this.users.client);
    return transformTeam(team, transformUser(users, team.id));
  }
}
