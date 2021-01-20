import { GraphqlGroup } from '@asap-hub/squidex';
import { ListGroupResponse } from '@asap-hub/model';

import { InstrumentedSquidexGraphql } from '../utils/instrumented-client';
import { parseGraphQLGroup } from '../entities';
import { GraphQLQueryUser } from './users';
import { GraphQLQueryTeam } from './teams';

const GraphQLQueryGroup = `
id
created
flatData {
  name
  description
  summary
  tags
  tools {
    url
    name
    description
  }
  teams {
  ${GraphQLQueryTeam}
  }
  leaders{
    role
    user{
      ${GraphQLQueryUser}
    }
  }
  calendars {
    flatData {
      color
      id
      name
    }
  }
}`;

export const buildGraphQLQueryFetchGroups = (
  filter = '',
  top = 50,
  skip = 0,
): string =>
  `{
  queryGroupsContentsWithTotal(top: ${top}, skip: ${skip}, filter: "${filter}", orderby: "data/name/iv") {
    total
    items {
      ${GraphQLQueryGroup}
    }
  }
}`;

export interface ResponseFetchGroups {
  queryGroupsContentsWithTotal: {
    total: number;
    items: GraphqlGroup[];
  };
}

type FetchOptions = {
  take: number;
  skip: number;
  search?: string;
};

export default class Groups {
  client: InstrumentedSquidexGraphql;

  constructor(ctxHeaders?: Record<string, string>) {
    this.client = new InstrumentedSquidexGraphql(ctxHeaders);
  }

  async fetch(options: FetchOptions): Promise<ListGroupResponse> {
    const { take, skip, search } = options;

    const searchQ = (search || '')
      .split(' ')
      .filter(Boolean) // removes whitespaces
      .reduce(
        (acc: string[], word: string) =>
          acc.concat(
            `(${[
              [`contains(data/name/iv, '${word}')`],
              [`contains(data/description/iv, '${word}')`],
              [`contains(data/tags/iv, '${word}')`],
            ].join(' or ')})`,
          ),
        [],
      )
      .join(' and ');

    const query = buildGraphQLQueryFetchGroups(searchQ, take, skip);

    const { queryGroupsContentsWithTotal } = await this.client.request<
      ResponseFetchGroups,
      unknown
    >(query);
    const { total, items } = queryGroupsContentsWithTotal;

    return {
      total,
      items: items.map(parseGraphQLGroup),
    };
  }

  async fetchByTeamId(
    teamId: string,
    options: FetchOptions,
  ): Promise<ListGroupResponse> {
    const { take, skip } = options;
    const filter = `data/teams/iv eq '${teamId}'`;

    const query = buildGraphQLQueryFetchGroups(filter, take, skip);

    const { queryGroupsContentsWithTotal } = await this.client.request<
      ResponseFetchGroups,
      unknown
    >(query);
    const { total, items } = queryGroupsContentsWithTotal;

    return {
      total,
      items: items.map(parseGraphQLGroup),
    };
  }
}
