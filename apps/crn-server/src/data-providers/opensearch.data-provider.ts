import { UserResponse } from '@asap-hub/model';
import { OpenSearchRequest, OpenSearchResponse } from '@asap-hub/server-common';
import {
  LambdaClient,
  InvokeCommand,
  InvocationType,
} from '@aws-sdk/client-lambda';
import Boom from '@hapi/boom';
import { region, environment } from '../config';
import logger from '../utils/logger';

export default class OpenSearchProvider {
  private lambda: LambdaClient;
  private stage: string;
  private opensearchDomainStage: string;

  constructor() {
    this.lambda = new LambdaClient({ region });
    this.stage = environment;
    this.opensearchDomainStage =
      environment === 'production' ? 'production' : 'dev';
  }

  /**
   * Helper to invoke the OpenSearch Lambda function
   */
  private async invokeLambda(
    method: string,
    path: string,
    body?: OpenSearchRequest,
    pathParameters?: Record<string, string>,
  ): Promise<OpenSearchResponse> {
    // Structure the event exactly like API Gateway would send it
    const event = {
      version: '2.0',
      routeKey: `${method.toUpperCase()} ${path}`,
      rawPath: path,
      rawQueryString: '',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
      },
      requestContext: {
        http: {
          method: method.toUpperCase(),
          path,
          protocol: 'HTTP/1.1',
          sourceIp: '127.0.0.1',
        },
        requestId: `lambda-invoke-${Date.now()}`,
        stage: this.opensearchDomainStage,
      },
      pathParameters: pathParameters || null,
      queryStringParameters: null,
      ...(body && {
        body: JSON.stringify(body),
        isBase64Encoded: false,
      }),
    };

    const lambdaParams = {
      FunctionName: `asap-hub-${this.stage}-opensearch-search-handler`,
      InvocationType: InvocationType.RequestResponse,
      Payload: JSON.stringify(event),
    };

    const command = new InvokeCommand(lambdaParams);
    const response = await this.lambda.send(command);

    if (!response.Payload) {
      throw new Error('Lambda returned an empty response');
    }

    let payloadText: string;

    if (response.Payload instanceof Uint8Array) {
      // Handle Uint8Array response
      payloadText = new TextDecoder().decode(response.Payload);
    } else {
      // Handle string response
      payloadText = (response.Payload as Record<string, unknown>)
        .toString()
        .trim();
    }

    try {
      const payload = JSON.parse(payloadText);

      // Check for Lambda execution errors
      if (payload.errorType || payload.errorMessage) {
        throw new Error(
          `Lambda execution error: ${
            payload.errorMessage || payload.errorType
          }`,
        );
      }

      if (payload.statusCode && payload.statusCode >= 400) {
        const errorBody =
          typeof payload.body === 'string'
            ? JSON.parse(payload.body)
            : payload.body;
        throw new Error(
          `OpenSearch operation failed with status ${
            payload.statusCode
          }: ${JSON.stringify(errorBody)}`,
        );
      }

      if (!payload.body) {
        throw new Error('Lambda response missing body');
      }

      const parsedBody =
        typeof payload.body === 'string'
          ? JSON.parse(payload.body)
          : payload.body;

      // The framework wraps the response in a 'data' property for successful responses
      return parsedBody.data || parsedBody;
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
    loggedInUser: UserResponse;
    size?: number;
    from?: number;
  }): Promise<OpenSearchResponse> {
    logger.info('Searching OpenSearch', {
      index: params.index,
      body: params.body,
      loggedInUser: !!params.loggedInUser,
    });

    if (!params.loggedInUser) {
      throw Boom.forbidden();
    }

    try {
      const searchPayload: OpenSearchRequest = {
        ...params.body,
        size: params.size ?? 10,
        from: params.from ?? 0,
      };

      const response = await this.invokeLambda(
        'POST',
        `/opensearch/search/${params.index}`,
        searchPayload,
        { index: params.index },
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
}
