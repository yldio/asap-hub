import get from 'lodash.get';
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
    skills: team.data.skills?.iv || [],
    members,
    lastModifiedDate: team.lastModified,
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
      teams.map((team) =>
        this.users
          .fetch({
            take: 100,
            filter: {
              path: 'data.teams.iv.id',
              op: 'eq',
              value: team.id,
            },
          })
          .then(({ items }) => items),
      ),
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

    const { items: users } = await this.users.fetch({
      take: 100,
      filter: {
        path: 'data.teams.iv.id',
        op: 'eq',
        value: team.id,
      },
    });

    return transformTeam(team, transformUser(users, team.id));
  }
}
