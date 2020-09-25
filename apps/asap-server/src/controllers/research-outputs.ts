import {
  ResearchOutputResponse,
  ResearchOutputCreationRequest,
} from '@asap-hub/model';
import { Squidex } from '@asap-hub/services-common';

import { CMS } from '../cms';
import { CMSResearchOutput } from '../entities/research-outputs';
import { CMSTeam } from '../entities';
import intercept from 'apr-intercept';

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
  cms: CMS;

  teams: Squidex<CMSTeam>;

  researchOutputs: Squidex<CMSResearchOutput>;

  constructor() {
    this.cms = new CMS();
    this.teams = new Squidex('teams');
    this.researchOutputs = new Squidex('research-outputs');
  }

  async create(
    id: string,
    name: string,
    output: ResearchOutputCreationRequest,
  ): Promise<ResearchOutputResponse> {
    const createdOutput = await this.cms.researchOutputs.create(
      id,
      name,
      output,
    );
    return transform(createdOutput);
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

  async fetch(): Promise<ResearchOutputResponse[]> {
    const res = await this.researchOutputs.fetch();
    const teams = res.items.length
      ? await this.teams.fetch({
          filter: {
            or: res.items.map((item) => ({
              path: 'data.proposal.iv',
              op: 'eq',
              value: item.id,
            })),
          },
        })
      : { items: [] };

    return res.items.map((item) =>
      transform(
        item,
        teams.items.filter((t) => t.data.proposal?.iv[0] === item.id)[0],
      ),
    );
  }
}
