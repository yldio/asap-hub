import { GraphQLClient } from 'graphql-request';
import { Headers } from 'cross-fetch';

import { cms as squidex } from '../config';
import { getAccessToken } from './client';

// @ts-ignore
global.Headers = global.Headers || Headers;

export class GraphQL {
  client: GraphQLClient;

  constructor() {
    this.client = new GraphQLClient(
      `${squidex.baseUrl}/api/content/${squidex.appName}/graphql`,
    );
  }

  async request<T, V>(query: string): Promise<T> {
    const tk = await getAccessToken();
    this.client.setHeaders({ authorization: `Bearer ${tk}` });
    return this.client.request<T, V>(query);
  }
}
