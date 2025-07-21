import { OpenSearchRequest, OpenSearchResponse } from '@asap-hub/server-common';
import {
  LambdaClient,
  InvokeCommand,
  InvocationType,
} from '@aws-sdk/client-lambda';
import { region, environment } from '../config';
import logger from '../utils/logger';

export default class OpenSearchProvider {
  private lambda: LambdaClient;
  private stage: string;

  constructor() {
    this.lambda = new LambdaClient({ region });
    this.stage =
      environment === 'development' || environment === 'local'
        ? 'dev'
        : environment;
  }

  /**
   * Helper to invoke the OpenSearch Lambda function
   */
  private async invokeLambda(
    method: string,
    path: string,
    query?: OpenSearchRequest,
  ): Promise<OpenSearchResponse> {
    const lambdaParams = {
      FunctionName: `asap-hub-${this.stage}-openSearchHandler`,
      InvocationType: InvocationType.RequestResponse,
      Payload: JSON.stringify({
        httpMethod: method,
        path,
        ...(query && { body: JSON.stringify(query) }),
        headers: {
          'content-type': 'application/json',
        },
      }),
    };

    const command = new InvokeCommand(lambdaParams);
    const response = await this.lambda.send(command);

    if (!response.Payload) {
      throw new Error('Lambda returned an empty response');
    }

    const payloadText = response.Payload.toString().trim();

    try {
      const payload = JSON.parse(payloadText);

      if (payload.statusCode && payload.statusCode >= 400) {
        throw new Error(
          `OpenSearch operation failed: ${JSON.stringify(payload)}`,
        );
      }

      if (!payload.body) {
        throw new Error('Lambda response missing body');
      }

      const parsedBody =
        typeof payload.body === 'string'
          ? JSON.parse(payload.body)
          : payload.body;

      return parsedBody;
    } catch (parseError) {
      logger.error('Error parsing Lambda response', {
        rawPayload: payloadText,
        errorMessage: (parseError as Error).message,
      });
      throw new Error(`Invalid JSON response from Lambda: ${payloadText}`);
    }
  }

  /**
   * Search across indices
   */
  async search(params: {
    index: string;
    body: OpenSearchRequest;
    size?: number;
    from?: number;
  }): Promise<OpenSearchResponse> {
    try {
      const searchQuery = {
        ...params.body,
        ...(params.size && { size: params.size }),
        ...(params.from && { from: params.from }),
      };

      const indexPath = params.index;

      const response = await this.invokeLambda(
        'POST',
        `/opensearch/search/${indexPath}`,
        searchQuery,
      );

      return response;
    } catch (error) {
      logger.error('OpenSearch search failed', {
        error,
        index: params.index,
        searchBody: params.body,
      });
      throw error;
    }
  }

  //   /**
  //    * Index a document - might need to be updated - not tested
  //    */
  //   async indexDocument(params: {
  //     index: string;
  //     id?: string;
  //     body: OpenSearchRequest;
  //     refresh?: boolean;
  //   }): Promise<OpenSearchResponse> {
  //     try {
  //       const indexPath = `/opensearch/index/${params.index}`;
  //       const requestBody = {
  //         ...params.body,
  //         ...(params.id && { _id: params.id }),
  //         ...(params.refresh && { refresh: 'true' }),
  //       };

  //       const response = await this.invokeLambda('POST', indexPath, requestBody);

  //       return response;
  //     } catch (error) {
  //       logger.error('OpenSearch document indexing failed', {
  //         error,
  //         index: params.index,
  //         documentId: params.id,
  //       });
  //       throw error;
  //     }
  //   }

  //   /**
  //    * Update a document - might need to be updated - not tested
  //    */
  //   async updateDocument(params: {
  //     index: string;
  //     id: string;
  //     body: OpenSearchRequest;
  //     refresh?: boolean;
  //   }): Promise<OpenSearchResponse> {
  //     try {
  //       const updatePath = `/opensearch/update/${params.index}/${params.id}`;
  //       const requestBody = {
  //         ...params.body,
  //         ...(params.refresh && { refresh: 'true' }),
  //       };

  //       const response = await this.invokeLambda('PUT', updatePath, requestBody);

  //       return response;
  //     } catch (error) {
  //       logger.error('OpenSearch document update failed', {
  //         error,
  //         index: params.index,
  //         documentId: params.id,
  //       });
  //       throw error;
  //     }
  //   }

  //   /**
  //    * Delete a document - might need to be updated - not tested
  //    */
  //   async deleteDocument(params: {
  //     index: string;
  //     id: string;
  //     refresh?: boolean;
  //   }): Promise<OpenSearchResponse> {
  //     try {
  //       const deletePath = `/opensearch/delete/${params.index}/${params.id}`;
  //       const requestBody = {
  //         ...(params.refresh && { refresh: 'true' }),
  //       };

  //       const response = await this.invokeLambda(
  //         'DELETE',
  //         deletePath,
  //         requestBody,
  //       );

  //       return response;
  //     } catch (error) {
  //       logger.error('OpenSearch document deletion failed', {
  //         error,
  //         index: params.index,
  //         documentId: params.id,
  //       });
  //       throw error;
  //     }
  //   }

  //   /**
  //    * Check if OpenSearch cluster is healthy (via search on a common index)
  //    */
  //   async healthCheck(): Promise<boolean> {
  //     try {
  //       // Perform a simple search to check if OpenSearch is responsive
  //       await this.search({
  //         index: '_cluster',
  //         body: { query: { match_all: {} } },
  //         size: 1,
  //       });
  //       return true;
  //     } catch (error) {
  //       logger.error('OpenSearch health check failed', { error });
  //       return false;
  //     }
  //   }
}
