import intercept from 'apr-intercept';
import {
  ResearchOutputResponse,
  ListResearchOutputResponse,
} from '@asap-hub/model';
import { Squidex } from '@asap-hub/squidex';

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
    search?: string;
    filter?: string | string[];
  }): Promise<ListResearchOutputResponse> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { search, filter, ...opts } = options;

    const { total, items } = await this.researchOutputs.fetch({
      ...opts,
      ...(search
        ? {
            filter: {
              or: search
                .split(' ')
                .filter(Boolean)
                .flatMap((word) => [
                  { path: 'data.title.iv', op: 'contains', value: word },
                ]),
            },
          }
        : {}),
      sort: [{ path: 'created', order: 'descending' }],
    });

    const teams = items.length
      ? await this.teams.fetch({
          take: items.length,
          filter: {
            or: items.map((item) => ({
              path: 'data.proposal.iv',
              op: 'eq',
              value: item.id,
            })),
          },
        })
      : { items: [] };

    return {
      total,
      items: items.map((item) =>
        transform(
          item,
          teams.items.filter((t) => t.data.proposal?.iv[0] === item.id)[0],
        ),
      ),
    };
  }
}
