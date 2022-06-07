import { DocumentNode } from 'graphql';
import { ClientError, GraphQLClient } from 'graphql-request';
import { GetAccessToken } from './auth';
import squidex from './config';

type SquidexRequestOptions = {
  includeDrafts?: boolean;
};
export interface SquidexGraphqlClient {
  request<T, V>(
    query: string | DocumentNode,
    variables?: V,
    options?: SquidexRequestOptions,
  ): Promise<T>;
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

  async request<T, V>(
    query: string | DocumentNode,
    variables?: V,
    options?: SquidexRequestOptions,
  ): Promise<T> {
    const tk = await this.getAccessToken();
    this.client.setHeaders({ authorization: `Bearer ${tk}` });

    if (options?.includeDrafts) {
      this.client.setHeader('X-Unpublished', 'true');
    }
    return this.client.request<T, V>(query, variables);
  }
}

export const SquidexGraphqlError = ClientError;
