import get from 'lodash.get';
import { Got } from 'got';
import { Squidex } from '@asap-hub/services-common';
import { ListTeamResponse, TeamResponse, TeamMember } from '@asap-hub/model';

import { CMS } from '../cms';
import { CMSTeam } from '../entities/team';
import { CMSUser } from '../entities/user';
import { createURL } from '../utils/assets';

function transformTeam(team: CMSTeam, members: TeamMember[]): TeamResponse {
  return {
    id: team.id,
    displayName: team.data.displayName.iv,
    applicationNumber: team.data.applicationNumber.iv,
    projectTitle: team.data.projectTitle.iv,
    projectSummary: team.data.projectSummary?.iv,
    email: team.data.email?.iv,
    skills: team.data.skills?.iv || [],
    lastModifiedDate: team.lastModified,
    members,
  };
}

const transformUser = (users: CMSUser[], teamId: string): TeamMember[] =>
  users.map((user) => ({
    id: user.id,
    firstName: user.data.firstName?.iv,
    lastName: user.data.lastName?.iv,
    displayName: user.data.displayName.iv,
    role: get(user, 'data.teams.iv', []).find(
      (t: { id: string[] }) => t.id[0] === teamId,
    ).role,
    avatarURL: user.data.avatar && createURL(user.data.avatar.iv)[0],
  }));

const fetchUsers = async (id: string, client: Got): Promise<CMSUser[]> => {
  try {
    const { items } = await client
      .get('users', {
        searchParams: {
          $filter: `data/teams/iv/id eq '${id}'`,
        },
      })
      .json();

    return items;
  } catch (err) {
    return [];
  }
};

export default class Teams {
  cms: CMS;

  teams: Squidex<CMSTeam>;

  users: Squidex<CMSUser>;

  constructor() {
    this.cms = new CMS();
    this.teams = new Squidex('teams');
    this.users = new Squidex('users');
  }

  async fetch({
    page = 1,
    pageSize = 8,
  }: {
    page: number;
    pageSize: number;
  }): Promise<ListTeamResponse> {
    const { total, items: teams } = await this.teams.fetch({
      take: pageSize,
      skip: (page - 1) * pageSize,
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
