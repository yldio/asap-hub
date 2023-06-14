import { DocumentNode } from 'graphql';
import { ClientError, GraphQLClient, Variables } from 'graphql-request';
import { GetAccessToken, SquidexConfig } from './auth';

type SquidexRequestOptions = {
  includeDrafts?: boolean;
};
export interface SquidexGraphqlClient {
  request<
    T extends { [key: string]: unknown } = { [key: string]: unknown },
    V extends { [key: string]: unknown } = { [key: string]: unknown },
  >(
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

  async request<T, V extends Variables>(
    query: string | DocumentNode,
    variables?: V,
    options?: SquidexRequestOptions,
  ): Promise<T> {
    const tk = await this.getAccessToken();
    this.client.setHeaders({ authorization: `Bearer ${tk}` });

    if (options?.includeDrafts) {
      this.client.setHeader('X-Unpublished', 'true');
    }
    return this.client.request(query, variables);
  }
}

export const SquidexGraphqlError = ClientError;
