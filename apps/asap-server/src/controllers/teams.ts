import { TeamResponse, TeamMember } from '@asap-hub/model';
import Intercept from 'apr-intercept';
import get from 'lodash.get';
import Boom from '@hapi/boom';

import { CMS } from '../cms';
import { CMSTeam } from '../entities/team';
import { CMSUser } from '../entities/user';

function transformTeam(team: CMSTeam, members: TeamMember[]): TeamResponse {
  return {
    id: team.id,
    displayName: team.data.displayName.iv,
    applicationNumber: team.data.applicationNumber.iv,
    projectTitle: team.data.projectTitle.iv,
    projectSummary: team.data.projectSummary?.iv,
    proposalURL: team.data.proposalURL?.iv,
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
    avatarURL: user.data.avatarURL?.iv,
  }));

export default class Teams {
  cms: CMS;

  constructor() {
    this.cms = new CMS();
  }

  async fetch(): Promise<TeamResponse[]> {
    const teams = await this.cms.teams.fetch();
    const teamUsers = await Promise.all(
      teams.map((team) => this.cms.users.fetchByTeam(team.id)),
    );

    return teams.map((team, index) =>
      transformTeam(team, transformUser(teamUsers[index], team.id)),
    );
  }

  async fetchById(teamId: string): Promise<TeamResponse> {
    const [notFound, team] = await Intercept(this.cms.teams.fetchById(teamId));
    if (notFound) {
      throw Boom.notFound();
    }

    const users: CMSUser[] = await this.cms.users.fetchByTeam(teamId);
    return transformTeam(team, transformUser(users, team.id));
  }
}
