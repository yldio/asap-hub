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
    const res = await this.client.request<FetchDiscoverQuery, unknown>(
      FETCH_DISCOVER,
    );
    if (
      !res.queryDiscoverContents ||
      res.queryDiscoverContents.length === 0 ||
      !res.queryDiscoverContents[0]
    ) {
      return {
        aboutUs: '',
        training: [],
        members: [],
        pages: [],
      };
    }

    const [content] = res.queryDiscoverContents;
    return {
      aboutUs: content.flatData.aboutUs || '',
      training: content.flatData.training?.map(parseGraphQLNews) ?? [],
      members:
        content.flatData.members?.map((member) => parseGraphQLUser(member)) ??
        [],
      pages: content.flatData.pages?.map(parseGraphQLPage) ?? [],
    };
  }
}

export interface DiscoverController {
  fetch: () => Promise<DiscoverResponse>;
}
