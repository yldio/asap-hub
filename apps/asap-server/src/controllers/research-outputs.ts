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
    filter?: string[];
  }): Promise<ListResearchOutputResponse> {
    const { search, filter, take = 8, skip = 0 } = options;

    const searchQ = (search || '')
      .split(' ')
      .filter(Boolean)
      .reduce((acc: string[], word: string) => {
        return acc.concat(`contains(data/firstName/iv, '${word}')`);
      }, [])
      .join(' or ');

    const filterQ = (filter || [])
      .reduce(
        (acc: string[], word: string) =>
          acc.concat([`data/type/iv eq '${word}'`]),
        [],
      )
      .join(' or ');

    const $filter = [filterQ && `(${filterQ})`, searchQ && `(${searchQ})`]
      .filter(Boolean)
      .join(' and ');

    const { total, items } = await this.researchOutputs.fetch({
      $top: take,
      $skip: skip,
      $orderby: 'created desc',
      $filter,
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
              t.data.outputs.iv.filter((o) => o === item.id).length > 0,
          ),
        ),
      ),
    };
  }
}
