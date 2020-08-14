import { Base, BaseOptions } from '@asap-hub/services-common';
import Intercept from 'apr-intercept';
import Boom from '@hapi/boom';
import { HTTPError } from 'got';
import { TeamCreateRequest } from '@asap-hub/model';

import { CMSTeam } from '../entities/team';

export default class Teams extends Base {
  constructor(CMSConfig: BaseOptions) {
    super(CMSConfig);
  }

  create(team: TeamCreateRequest): Promise<CMSTeam> {
    return this.client
      .post<CMSTeam>('teams', {
        json: {
          displayName: {
            iv: team.displayName,
          },
          applicationNumber: {
            iv: team.applicationNumber,
          },
          projectTitle: {
            iv: team.projectTitle,
          },
          projectSummary: {
            iv: team.projectSummary,
          },
          proposalURL: {
            iv: team.proposalURL,
          },
          skills: {
            iv: team.skills,
          },
        },
        searchParams: { publish: true },
      })
      .json();
  }

  fetchById(id: string): Promise<CMSTeam> {
    return this.client.get<CMSTeam>(`teams/${id}`).json();
  }

  delete(id: string): Promise<void> {
    return this.client.delete(`teams/${id}`).json();
  }

  async fetchByApplicationNumber(appNumber: string): Promise<CMSTeam> {
    const { items } = await this.client
      .get('teams', {
        searchParams: {
          $filter: `data/applicationNumber/iv eq '${appNumber}'`,
        },
      })
      .json();

    return items[0] as CMSTeam;
  }

  async fetch(): Promise<CMSTeam[]> {
    const [error, res] = await Intercept<{
      items: CMSTeam[];
    }>(
      this.client
        .get('teams', {
          searchParams: {
            q: JSON.stringify({
              take: 30,
              sort: [{ path: 'data.displayName.iv' }],
            }),
          },
        })
        .json(),
    );

    if (error) {
      const e = error as HTTPError;
      if (e.response.statusCode === 404) {
        return [];
      }

      throw Boom.badImplementation('internal', {
        error,
      });
    }

    return res.items;
  }
}
