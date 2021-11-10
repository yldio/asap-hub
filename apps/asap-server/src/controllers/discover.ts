import { GraphqlPage, GraphqlNews, GraphqlUser } from '@asap-hub/squidex';
import { DiscoverResponse } from '@asap-hub/model';

import { InstrumentedSquidexGraphql } from '../utils/instrumented-client';
import {
  parseGraphQLUser,
  parseGraphQLPage,
  parseGraphQLNews,
} from '../entities';
import { FetchDiscoverQuery } from '../gql/graphql';

import { FETCH_DISCOVER } from '../queries/discover.queries';

export interface SquidexDiscoverResponse {
  queryDiscoverContents: {
    flatData: {
      aboutUs: string;
      training: GraphqlNews[];
      members: GraphqlUser[];
      pages: GraphqlPage[];
    };
  }[];
}

export default class Discover implements DiscoverController {
  client: InstrumentedSquidexGraphql;

  constructor(ctxHeaders?: Record<string, string>) {
    this.client = new InstrumentedSquidexGraphql(ctxHeaders);
  }

  async fetch(): Promise<DiscoverResponse> {
    const { queryDiscoverContents } = await this.client.request<
      FetchDiscoverQuery,
      unknown
    >(FETCH_DISCOVER);
    if (
      !queryDiscoverContents ||
      queryDiscoverContents.length === 0 ||
      !queryDiscoverContents[0]
    ) {
      return {
        aboutUs: '',
        training: [],
        members: [],
        pages: [],
      };
    }

    const [{ flatData }] = queryDiscoverContents;
    return {
      aboutUs: flatData.aboutUs || '',
      training: flatData.training?.map(parseGraphQLNews) ?? [],
      members: flatData.members?.map(parseGraphQLUser) ?? [],
      pages: flatData.pages?.map(parseGraphQLPage) ?? [],
    };
  }
}

export interface DiscoverController {
  fetch: () => Promise<DiscoverResponse>;
}
