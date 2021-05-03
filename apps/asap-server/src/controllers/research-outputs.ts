import intercept from 'apr-intercept';
import {
  ResearchOutputResponse,
  ListResearchOutputResponse,
} from '@asap-hub/model';
import { RestTeam, RestResearchOutput } from '@asap-hub/squidex';

import { parseResearchOutput } from '../entities/research-output';
import { InstrumentedSquidex } from '../utils/instrumented-client';
import { sanitiseForSquidex } from '../utils/squidex';

function transform(
  output: RestResearchOutput,
  teams: RestTeam[],
): ResearchOutputResponse {
  const teamProps =
    teams.length > 0
      ? {
          team: {
            id: teams[0].id,
            displayName: teams[0].data.displayName.iv,
          },
        }
      : {};

  return {
    ...parseResearchOutput(output),
    ...teamProps,
    teams: teams.map((team) => ({
      id: team.id,
      displayName: team.data.displayName.iv,
    })),
  };
}

export const getGraphQLQueryResearchOutput = (withTeams = false): string => `
id
created
lastModified
flatData{
  title
  type
  description
  link
  addedDate
  publishDate
  tags
  labs{
    flatData{
      name
    }
  }
}
${
  (withTeams &&
    `referencingTeamsContents {
  id
  created
  lastModified
  flatData {
    displayName
  }
}`) ||
  ''
}
`;

export default class ResearchOutputs implements ResearchOutputController {
  researchOutputs: InstrumentedSquidex<RestResearchOutput>;

  teams: InstrumentedSquidex<RestTeam>;

  constructor(ctxHeaders?: Record<string, string>) {
    this.researchOutputs = new InstrumentedSquidex(
      'research-outputs',
      ctxHeaders,
    );
    this.teams = new InstrumentedSquidex('teams', ctxHeaders);
  }

  async fetchById(id: string): Promise<ResearchOutputResponse> {
    const res = await this.researchOutputs.fetchById(id);
    const [, teamResults] = await intercept(
      this.teams.fetch({
        filter: {
          path: 'data.outputs.iv',
          op: 'eq',
          value: res.id,
        },
      }),
    );

    return transform(res, teamResults.items);
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
      .map(sanitiseForSquidex)
      .reduce(
        (acc: string[], word: string) =>
          acc.concat(
            `contains(data/title/iv, '${word}') or contains(data/tags/iv, '${word}')`,
          ),
        [],
      )
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
          teams.items.filter(
            (t) =>
              t.data.outputs?.iv &&
              t.data.outputs.iv.filter((o) => o === item.id).length > 0,
          ),
        ),
      ),
    };
  }
}

export interface ResearchOutputController {
  fetch: (options: {
    take: number;
    skip: number;
    search?: string;
    filter?: string[];
  }) => Promise<ListResearchOutputResponse>;

  fetchById: (id: string) => Promise<ResearchOutputResponse>;
}
