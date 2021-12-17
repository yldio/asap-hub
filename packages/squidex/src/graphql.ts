import { ClientError, GraphQLClient } from 'graphql-request';
import { DocumentNode } from 'graphql';

import squidex from './config';
import { GetAccessToken } from './auth';

export interface SquidexGraphqlClient {
  request<T, V>(query: string | DocumentNode, variables?: V): Promise<T>;
}

export class SquidexGraphql implements SquidexGraphqlClient {
  getAccessToken: GetAccessToken;
  client: GraphQLClient;

  constructor(getAccessToken: GetAccessToken) {
    this.client = new GraphQLClient(
      `${squidex.baseUrl}/api/content/${squidex.appName}/graphql`,
    );
    this.getAccessToken = getAccessToken;
  }

  async request<T, V>(query: string | DocumentNode, variables?: V): Promise<T> {
    const tk = await this.getAccessToken();
    this.client.setHeaders({ authorization: `Bearer ${tk}` });
    return this.client.request<T, V>(query, variables);
  }
}

export const SquidexGraphqlError = ClientError;
