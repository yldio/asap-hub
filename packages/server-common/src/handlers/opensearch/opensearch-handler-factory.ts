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

type Input = {
  query: OpenSearchRequest;
};

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

    const { query } = request.payload;
    const index = request.params?.index;
    const id = request.params?.id;
    const method = request.method || 'post';

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
        const response = await client.search({
          index,
          body: query || { query: { match_all: {} } },
        });

        if (!response.statusCode?.toString().startsWith('2')) {
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

        const response = await client.update({
          index,
          id,
          body: query || {},
        });

        if (!response.statusCode?.toString().startsWith('2')) {
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
      logger.error('Error executing OpenSearch operation', { error });

      return {
        statusCode: 500,
        payload: {
          error: 'Error executing OpenSearch operation',
          details: (error as Error).message,
        },
      };
    }
  };
