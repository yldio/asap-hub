import {
  GraphqlPage,
  GraphqlNews,
  GraphqlUser,
  SquidexGraphqlClient,
  SquidexGraphql,
} from '@asap-hub/squidex';
import { DiscoverResponse } from '@asap-hub/model';
import {
  parseGraphQLUser,
  parseGraphQLPage,
  parseGraphQLNews,
} from '../entities';
import { FetchDiscoverQuery } from '../gql/graphql';
import { FETCH_DISCOVER } from '../queries/discover.queries';

export default class Discover implements DiscoverController {
  squidexGraphqlClient: SquidexGraphqlClient;

  constructor() {
    this.squidexGraphqlClient = new SquidexGraphql();
  }

  async fetch(): Promise<DiscoverResponse> {
    const { queryDiscoverContents } = await this.squidexGraphqlClient.request<
      FetchDiscoverQuery,
      unknown
    >(FETCH_DISCOVER);

    const { queryDiscoverContents } = data;
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
