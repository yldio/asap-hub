import { DocumentNode } from 'graphql';
import { ClientError, GraphQLClient } from 'graphql-request';
import { GetAccessToken, SquidexConfig } from './auth';

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

  constructor(
    getAccessToken: GetAccessToken,
    config: Pick<SquidexConfig, 'baseUrl' | 'appName'>,
  ) {
    this.client = new GraphQLClient(
      `${config.baseUrl}/api/content/${config.appName}/graphql`,
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
