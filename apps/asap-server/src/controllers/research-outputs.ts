import Boom from '@hapi/boom';
import {
  ResearchOutputResponse,
  ListResearchOutputResponse,
} from '@asap-hub/model';
import { GraphqlResearchOutput } from '@asap-hub/squidex';

import { parseGraphQLResearchOutput } from '../entities/research-output';
import { InstrumentedSquidexGraphql } from '../utils/instrumented-client';
import { sanitiseForSquidex } from '../utils/squidex';
import { GraphQLQueryUser } from './users';
import { GraphqlFetchOptions } from '../utils/types';

export const getGraphQLQueryResearchOutput = ({
  withTeams,
}: {
  withTeams: boolean;
}): string => `
id
created
lastModified
flatData{
  title
  type
  subtype
  description
  link
  addedDate
  publishDate
  labCatalogNumber
  tags
  lastUpdatedPartial
  accessInstructions
  sharingStatus
  asapFunded
  usedInAPublication
  authors {
    __typename
    ... on Users {
      ${GraphQLQueryUser}
    }
    ... on ExternalAuthors {
      id
      created
      lastModified
      flatData {
        name
        orcid
      }
    }
  }
}
${
  withTeams
    ? `referencingTeamsContents {
  id
  created
  lastModified
  flatData {
    displayName
  }
  referencingUsersContents {
    flatData {
      email
      teams {
        role
        id {
          id
        }
      }
    }
  }
}`
    : ''
}
`;

export const buildGraphQLQueryResearchOutput = (): string => `
  query FetchResearchOutput($id: String!) {
    findResearchOutputsContent(id: $id) {
      ${getGraphQLQueryResearchOutput({ withTeams: true })}
    }
  }
`;

export const buildGraphQLQueryFetchResearchOutputs = (): string => `
  query FetchResearchOutputs($top: Int, $skip: Int, $filter: String) {
    queryResearchOutputsContentsWithTotal(top: $top, skip: $skip, filter: $filter, orderby: "created desc") {
      total
      items {
        ${getGraphQLQueryResearchOutput({ withTeams: true })}
      }
    }
  }
`;

export default class ResearchOutputs implements ResearchOutputController {
  graphqlSquidexClient: InstrumentedSquidexGraphql;

  constructor() {
    this.graphqlSquidexClient = new InstrumentedSquidexGraphql();
  }

  async fetchById(id: string): Promise<ResearchOutputResponse> {
    const query = buildGraphQLQueryResearchOutput();
    const researchOutputGraphqlResponse =
      await this.graphqlSquidexClient.request<
        ResponseFetchResearchOutput,
        { id: string }
      >(query, { id });

    const { findResearchOutputsContent: researchOutputContent } =
      researchOutputGraphqlResponse;
    if (!researchOutputContent) {
      throw Boom.notFound();
    }

    return parseGraphQLResearchOutput(researchOutputContent, {
      includeAuthors: true,
      includeTeams: true,
    }) as ResearchOutputResponse;
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

    const filterGraphql = [filterQ && `(${filterQ})`, searchQ && `(${searchQ})`]
      .filter(Boolean)
      .join(' and ');

    const query = buildGraphQLQueryFetchResearchOutputs();

    const { queryResearchOutputsContentsWithTotal } =
      await this.graphqlSquidexClient.request<
        ResponseFetchResearchOutputs,
        GraphqlFetchOptions
      >(query, {
        top: take,
        skip,
        filter: filterGraphql,
      });

    const { total, items: researchOutputs } =
      queryResearchOutputsContentsWithTotal;

    return {
      total,
      items: researchOutputs.map(
        (item) =>
          parseGraphQLResearchOutput(item, {
            includeAuthors: true,
            includeTeams: true,
          }) as ResearchOutputResponse,
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

export interface ResponseFetchResearchOutput {
  findResearchOutputsContent: GraphqlResearchOutput;
}

export interface ResponseFetchResearchOutputs {
  queryResearchOutputsContentsWithTotal: {
    total: number;
    items: GraphqlResearchOutput[];
  };
}
