import Boom from '@hapi/boom';
import { GraphqlGroup } from '@asap-hub/squidex';
import { ListGroupResponse, GroupResponse } from '@asap-hub/model';
import uniqBy from 'lodash.uniqby';

import { InstrumentedSquidexGraphql } from '../utils/instrumented-client';
import { FetchOptions } from '../utils/types';
import { parseGraphQLGroup } from '../entities';
import { GraphQLQueryUser } from './users';
import { GraphQLQueryTeam } from './teams';
import { sanitiseForSquidex } from '../utils/squidex';

export const GraphQLQueryGroup = `
id
created
lastModified
flatData {
  name
  description
  tags
  tools {
    slack
    googleDrive
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
  thumbnail {
    id
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

export const buildGraphQLQueryFetchGroup = (id: string): string =>
  `{
  findGroupsContent(id: "${id}") {
      ${GraphQLQueryGroup}
  }
}`;

export interface ResponseFetchGroups {
  queryGroupsContentsWithTotal: {
    total: number;
    items: GraphqlGroup[];
  };
}

export interface ResponseFetchGroup {
  findGroupsContent: GraphqlGroup;
}

export interface GroupController {
  fetch: (options: FetchOptions) => Promise<ListGroupResponse>;
  fetchById: (groupId: string) => Promise<GroupResponse>;
  fetchByTeamId: (
    teamId: string | string[],
    options: FetchOptions,
  ) => Promise<ListGroupResponse>;
  fetchByUserId: (
    userId: string,
    teamIds: string[],
    options: FetchOptions,
  ) => Promise<ListGroupResponse>;
}

export default class Groups implements GroupController {
  client: InstrumentedSquidexGraphql;

  constructor(ctxHeaders?: Record<string, string>) {
    this.client = new InstrumentedSquidexGraphql(ctxHeaders);
  }

  async fetchGroups(
    filter = '',
    options: FetchOptions,
  ): Promise<ListGroupResponse> {
    const { take, skip } = options;
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

  async fetch(options: FetchOptions): Promise<ListGroupResponse> {
    const { search } = options;

    const searchQ = ((search && sanitiseForSquidex(search)) || '')
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

    return this.fetchGroups(searchQ, options);
  }

  async fetchById(groupId: string): Promise<GroupResponse> {
    const { findGroupsContent: group } = await this.client.request<
      ResponseFetchGroup,
      unknown
    >(buildGraphQLQueryFetchGroup(groupId));

    if (!group) {
      throw Boom.notFound();
    }
    return parseGraphQLGroup(group);
  }

  async fetchByTeamId(
    teamId: string | string[],
    options: FetchOptions,
  ): Promise<ListGroupResponse> {
    const filter = Array.isArray(teamId)
      ? `data/teams/iv in [${teamId.map((id) => `'${id}'`).join(', ')}]`
      : `data/teams/iv eq '${teamId}'`;
    return this.fetchGroups(filter, options);
  }

  async fetchByUserId(
    userId: string,
    teamIds: string[],
    options: FetchOptions,
  ): Promise<ListGroupResponse> {
    const userFilter = `data/leaders/iv/user eq '${userId}'`;
    const requests = [this.fetchGroups(userFilter, options)];

    if (teamIds.length) {
      requests.push(this.fetchByTeamId(teamIds, options));
    }

    const groupsRes = await Promise.all(requests);
    const groups = groupsRes.map((g) => g.items).flat();
    const items = uniqBy(groups, 'id');

    return {
      total: items.length,
      items,
    };
  }
}
