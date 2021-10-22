import Boom from '@hapi/boom';
import {
  ResearchOutputResponse,
  ListResearchOutputResponse,
} from '@asap-hub/model';
import { GraphqlResearchOutput, SquidexGraphqlClient } from '@asap-hub/squidex';

import { parseGraphQLResearchOutput } from '../entities/research-output';
import { sanitiseForSquidex } from '../utils/squidex';
import { GraphQLQueryUser } from './users';
import {
  FETCH_RESEARCH_OUTPUT,
  FETCH_RESEARCH_OUTPUTS,
} from '../queries/research-outputs.queries';
import logger from '../utils/logger';
import {
  FetchResearchOutputQuery,
  FetchResearchOutputQueryVariables,
  FetchResearchOutputsQuery,
  FetchResearchOutputsQueryVariables,
} from '../gql/graphql';

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
  doi
  labCatalogNumber
  accession
  rrid
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

export default class ResearchOutputs implements ResearchOutputController {
  squidexGraphlClient: SquidexGraphqlClient;

  constructor(squidexGraphlClient: SquidexGraphqlClient) {
    this.squidexGraphlClient = squidexGraphlClient;
  }

  async fetchById(id: string): Promise<ResearchOutputResponse> {
    const researchOutputGraphqlResponse =
      await this.squidexGraphlClient.request<
        FetchResearchOutputQuery,
        FetchResearchOutputQueryVariables
      >(FETCH_RESEARCH_OUTPUT, { id, withTeams: true });

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

    const { queryResearchOutputsContentsWithTotal } =
      await this.squidexGraphlClient.request<
        FetchResearchOutputsQuery,
        FetchResearchOutputsQueryVariables
      >(FETCH_RESEARCH_OUTPUTS, {
        top: take,
        skip,
        filter: filterGraphql,
        withTeams: true,
      });

    if (queryResearchOutputsContentsWithTotal === null) {
      logger.warn('queryResearchOutputsContentsWithTotal returned null');
      return {
        total: 0,
        items: [],
      };
    }

    const { total, items: researchOutputs } =
      queryResearchOutputsContentsWithTotal;

    if (researchOutputs === null) {
      logger.warn('queryResearchOutputsContentsWithTotal items returned null');
      return {
        total: 0,
        items: [],
      };
    }

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
