import { GraphQLClient } from 'graphql-request';
import { DocumentNode } from 'graphql';

import squidex from './config';
import { getAccessToken } from './client';

export class SquidexGraphql {
  client: GraphQLClient;

  constructor() {
    this.client = new GraphQLClient(
      `${squidex.baseUrl}/api/content/${squidex.appName}/graphql`,
    );
  }

  async request<T, V>(query: string | DocumentNode, variables?: V): Promise<T> {
    const tk = await getAccessToken();
    this.client.setHeaders({ authorization: `Bearer ${tk}` });
    return this.client.request<T, V>(query, variables);
  }
}
