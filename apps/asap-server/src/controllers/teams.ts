import { TeamResponse, TeamMember } from '@asap-hub/model';
import get from 'lodash.get';
import Boom from '@hapi/boom';

import { CMS } from '../cms';
import { CMSTeam } from '../entities/team';
import { CMSUser } from '../entities/user';

function transform(team: CMSTeam, members?: TeamMember[]): TeamResponse {
  return {
    id: team.id,
    displayName: get(team, 'data.displayName.iv', null),
    applicationNumber: get(team, 'data.applicationNumber.iv', null),
    projectTitle: get(team, 'data.projectTitle.iv', null),
    projectSummary: get(team, 'data.projectSummary.iv', null),
    tags: get(team, 'data.tags.iv', null),
    members,
  } as TeamResponse;
}

export default class Teams {
  cms: CMS;

  constructor() {
    this.cms = new CMS();
  }

  async fetch(): Promise<TeamResponse[]> {
    const teams = await this.cms.teams.fetch();
    return teams.length ? teams.map((team) => transform(team)) : [];
  }

  async fetchById(teamId: string): Promise<TeamResponse> {
    let team;
    try {
      team = await this.cms.teams.fetchById(teamId);
    } catch (e) {
      throw Boom.notFound();
    }

    const users: CMSUser[] = await this.cms.users.fetchByTeam(teamId);
    let teamUsers: TeamMember[] = [];

    /* istanbul ignore else */

    if (users.length) {
      teamUsers = users.map((user) => ({
        id: user.id,
        displayName: get(user, 'data.displayName.iv', null),
        role: get(user, 'data.teams.iv', []).find(
          (t: { id: string[] }) => t.id[0] === teamId,
        ).role,
      }));
    }

    return transform(team, teamUsers);
  }
}
