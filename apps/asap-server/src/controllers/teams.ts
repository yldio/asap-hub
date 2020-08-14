import { TeamResponse, TeamMember } from '@asap-hub/model';
import Intercept from 'apr-intercept';
import get from 'lodash.get';
import Boom from '@hapi/boom';

import { CMS } from '../cms';
import { CMSTeam } from '../entities/team';
import { CMSUser } from '../entities/user';

function transform(team: CMSTeam, members?: TeamMember[]): TeamResponse {
  return {
    id: team.id,
    displayName: team.data.displayName.iv,
    applicationNumber: team.data.applicationNumber.iv,
    projectTitle: team.data.projectTitle.iv,
    projectSummary: team.data.projectSummary?.iv,
    proposalURL: team.data.proposalURL?.iv,
    skills: team.data.skills?.iv || [],
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
    const [notFound, team] = await Intercept(this.cms.teams.fetchById(teamId));
    if (notFound) {
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
