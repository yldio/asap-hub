import intercept from 'apr-intercept';
import {
  ResearchOutputResponse,
  ListResearchOutputResponse,
} from '@asap-hub/model';
import { Squidex, RestTeam, RestResearchOutput } from '@asap-hub/squidex';

function transform(
  output: RestResearchOutput,
  team?: RestTeam,
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
    link: output.data.link?.iv || undefined,
    type: output.data.type.iv,
    title: output.data.title.iv,
    text: output.data.text?.iv || '',
    publishDate: output.data.publishDate?.iv,
    ...teamProps,
  } as ResearchOutputResponse;
}

export default class ResearchOutputs {
  researchOutputs: Squidex<RestResearchOutput>;

  teams: Squidex<RestTeam>;

  constructor() {
    this.researchOutputs = new Squidex('research-outputs');
    this.teams = new Squidex('teams');
  }

  async fetchById(id: string): Promise<ResearchOutputResponse> {
    const res = await this.researchOutputs.fetchById(id);
    const [, team] = await intercept(
      this.teams.fetchOne({
        filter: {
          path: 'data.outputs.iv',
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
              path: 'data.outputs.iv',
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
          teams.items.find(
            (t) =>
              t.data.outputs &&
              t.data.outputs.iv.filter((output) => output === item.id).length >
                0,
          ),
        ),
      ),
    };
  }
}
