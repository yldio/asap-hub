import intercept from 'apr-intercept';
import {
  ResearchOutputResponse,
  ListResearchOutputResponse,
} from '@asap-hub/model';
import { Squidex } from '@asap-hub/services-common';

import { CMSResearchOutput } from '../entities/research-outputs';
import { CMSTeam } from '../entities';

function transform(
  output: CMSResearchOutput,
  team?: CMSTeam,
): ResearchOutputResponse {
  const teamProps = team
    ? {
        team: {
          id: team.id,
          displayName: team.data.displayName.iv,
        },
      }
    : {};

  return {
    id: output.id,
    created: output.created,
    url: output.data.url?.iv || '',
    doi: output.data.doi?.iv || '',
    type: output.data.type.iv,
    title: output.data.title.iv,
    text: output.data.text?.iv || '',
    publishDate: output.data.publishDate?.iv,
    ...teamProps,
  } as ResearchOutputResponse;
}

export default class ResearchOutputs {
  researchOutputs: Squidex<CMSResearchOutput>;

  teams: Squidex<CMSTeam>;

  constructor() {
    this.researchOutputs = new Squidex('research-outputs');
    this.teams = new Squidex('teams');
  }

  async fetchById(id: string): Promise<ResearchOutputResponse> {
    const res = await this.researchOutputs.fetchById(id);
    const [, team] = await intercept(
      this.teams.fetchOne({
        filter: {
          path: 'data.proposal.iv',
          op: 'eq',
          value: res.id,
        },
      }),
    );

    return transform(res, team);
  }

  async fetch(options: {
    take: number;
    skip: number;
  }): Promise<ListResearchOutputResponse> {
    const res = await this.researchOutputs.fetch(options);
    const teams = res.items.length
      ? await this.teams.fetch({
          take: res.items.length,
          filter: {
            or: res.items.map((item) => ({
              path: 'data.proposal.iv',
              op: 'eq',
              value: item.id,
            })),
          },
        })
      : { items: [] };

    return {
      total: res.total,
      items: res.items.map((item) =>
        transform(
          item,
          teams.items.filter((t) => t.data.proposal?.iv[0] === item.id)[0],
        ),
      ),
    };
  }
}
