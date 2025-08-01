import { framework as lambda } from '@asap-hub/services-common';
import { Client, API } from '@opensearch-project/opensearch';
import { AwsSigv4Signer } from '@opensearch-project/opensearch/aws';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { UpdateWriteResponseBase } from '@opensearch-project/opensearch/api/_types/_core.update';
import {
  Logger,
  getOpenSearchEndpoint,
  extractDomainFromEndpoint,
} from '../../utils';

export type OpenSearchRequest = API.Search_RequestBody;
export type OpenSearchResponse = API.Search_ResponseBody;

const getClient = async (region: string): Promise<Client> => {
  const endpoint = await getOpenSearchEndpoint();
  const domainEndpoint = extractDomainFromEndpoint(endpoint);

  return new Client({
    ...AwsSigv4Signer({
      getCredentials: defaultProvider(),
      region,
    }),
    node: `https://${domainEndpoint}`,
  });
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Input = any; // Use any for flexibility across different operations

type Output =
  | {
      data: OpenSearchResponse | UpdateWriteResponseBase;
    }
  | {
      error: string;
      details?: string;
    };

export const opensearchHandlerFactory =
  (
    logger: Logger,
    region: string,
  ): ((request: lambda.Request<Input>) => Promise<lambda.Response<Output>>) =>
  async (request: lambda.Request<Input>): Promise<lambda.Response<Output>> => {
    logger.info(`Received request: ${JSON.stringify(request)}`);

    // Fix 1: Get the payload from the correct location
    const payload = request.payload || {};
    const index = request.params?.index;
    const id = request.params?.id;
    const method = request.method?.toLowerCase() || 'post';

    if (!index) {
      return {
        statusCode: 400,
        payload: {
          error: 'Missing index path parameter',
        },
      };
    }

    try {
      const client = await getClient(region);

      if (method === 'post') {
        // Handle search request
        const searchBody: API.Search_RequestBody = payload.query || {
          query: { match_all: {} },
        };

        logger.info(
          `Performing search with body: ${JSON.stringify(searchBody)}`,
        );

        const response = await client.search({
          index,
          body: searchBody,
        });

        if (!response.statusCode?.toString().startsWith('2')) {
          logger.error('OpenSearch search failed', {
            statusCode: response.statusCode,
            body: response.body,
          });

          return {
            statusCode: response.statusCode || 500,
            payload: {
              error: 'OpenSearch error',
              details: JSON.stringify(response.body),
            },
          };
        }

        return {
          statusCode: 200,
          payload: { data: response.body },
        };
      }

      if (method === 'put') {
        // Handle update request
        if (!id) {
          return {
            statusCode: 400,
            payload: {
              error: 'Missing document id for update operation',
            },
          };
        }

        // Extract the update body and separate query parameters
        // eslint-disable-next-line camelcase
        const { refresh, retry_on_conflict, ...updateBody } = payload;

        logger.info(
          `Performing update with body: ${JSON.stringify(updateBody)}`,
        );
        logger.info(`Update target: index=${index}, id=${id}`);

        // Build the update parameters
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updateParams: any = {
          index,
          id,
          body: updateBody,
          timeout: '30s',
        };

        // Add query parameters if they exist
        if (refresh) {
          updateParams.refresh = refresh;
        }

        // eslint-disable-next-line camelcase
        if (retry_on_conflict) {
          // eslint-disable-next-line camelcase
          updateParams.retry_on_conflict = retry_on_conflict;
        }

        const response = await client.update(updateParams);

        logger.info(
          `OpenSearch update response: ${JSON.stringify({
            statusCode: response.statusCode,
            result: response.body?.result,
          })}`,
        );

        if (!response.statusCode?.toString().startsWith('2')) {
          logger.error('OpenSearch update failed', {
            statusCode: response.statusCode,
            body: response.body,
            updateBody,
          });

          return {
            statusCode: response.statusCode || 500,
            payload: {
              error: 'OpenSearch update error',
              details: JSON.stringify(response.body),
            },
          };
        }

        return {
          statusCode: 200,
          payload: { data: response.body },
        };
      }

      return {
        statusCode: 405,
        payload: {
          error: 'Method not allowed',
          details: `HTTP method ${method} is not supported`,
        },
      };
    } catch (error) {
      logger.error('Error executing OpenSearch operation', {
        error:
          error instanceof Error
            ? {
                name: error.name,
                message: error.message,
                stack: error.stack,
              }
            : String(error),
        method,
        index,
        id,
        payload,
      });

      return {
        statusCode: 500,
        payload: {
          error: 'Error executing OpenSearch operation',
          details: error instanceof Error ? error.message : String(error),
        },
      };
    }
  };
